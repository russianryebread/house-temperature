const thermometers = require("temper1");
const express = require('express')
const cors = require('cors')
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
		let fmt = function(t){ return `${parseFloat(t).toFixed(1)}°` }
		res.render('index', {
			c: temp,
			f: f,
			formatted: {
				c: `${fmt(temp)} C`,
				f: `${fmt(f)} F`
			}
		})
	});

})


app.get('/api', (req, res) => {
	
	thermometers.readTemperature(devices[0], function(err, value) {
		console.log(`Result: ${value}`);
		res.json({
			f: value,
			pretty: `${parseFloat(value).toFixed(1)}° F`
		})
	}, thermometers.toDegreeFahrenheit);

})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
