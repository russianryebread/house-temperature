const thermometers = require('temper1')
const utils = require('./utils.js')
const cors = require('cors')
const express = require('express')
const app = express()

const port = 80

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(cors())

var devices = thermometers.getDevices()
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
        })
    });

})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
