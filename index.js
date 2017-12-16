require('dotenv').config()
const thermometers = require('temper1')
const Db = require('./db')
const utils = require('./utils.js')
const cors = require('cors')
const express = require('express')
const app = express()
const db = new Db()

const port = (process.env.PORT) ? process.env.PORT : 80

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(cors())

let devices = thermometers.getDevices()
console.log(`Devices found: ${devices}`)

function readTemp(res, callback) {
    try {
        thermometers.readTemperature(devices[0], callback)
    } catch (error) {
        // If we get an exception, try getting the device again.
        // Sometimes the device changes addresses, so this keeps
        // the app alive.
        try {
            devices = thermometers.getDevices()
        } catch (error) {
            return res.json({error: error})
        }

        return res.json({error: error})
    }
}

app.get('/', (req, res) => {
    
    readTemp(res, (err, temp) => {
        let f = thermometers.celsiusToFahrenheit(temp)
        res.render('index', {
            c: temp,
            f: f,
            formatted: {
                c: `${utils.fmt(temp)} C`,
                f: `${utils.fmt(f)} F`
            }
        })
    });

})

app.get('/api', (req, res) => {
    db.historic((history) => {
        readTemp(res, (err, c) => {
            res.json({
                c: utils.round(c),
                f: utils.round(thermometers.celsiusToFahrenheit(c)),
                history: history
            })
        })
    })
})

app.post('/api/save', (req, res) => {
    readTemp(res, (err, c) => {
        db.save(thermometers.celsiusToFahrenheit(c), (dbRes) => {
            res.json(dbRes)
        })
    })
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
