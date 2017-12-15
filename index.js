const thermometers = require('temper1')
const Db = require('./db')
const utils = require('./utils.js')
const cors = require('cors')
const express = require('express')
const app = express()
const db = new Db()

const port = 8000

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(cors())

let devices = thermometers.getDevices()
console.log(`Devices found: ${devices}`)

app.get('/', (req, res) => {
    
    thermometers.readTemperature(devices[0], (err, temp) => {
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
    thermometers.readTemperature(devices[0], (err, c) => {
        res.json({
            c: utils.round(c),
            f: utils.round(thermometers.celsiusToFahrenheit(c)),
            history: db.historic()
        })
    })
})

app.post('/api/save', (req, res) => {
    thermometers.readTemperature(devices[0], (err, c) => {
        res.json(db.save(thermometers.celsiusToFahrenheit(c)))
    })
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
