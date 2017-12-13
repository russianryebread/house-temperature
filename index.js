const thermometers = require("temper1");
const express = require('express')
const app = express()

const port = 80

app.set('view engine', 'pug')
app.use(express.static('public'))

var devices = thermometers.getDevices()
console.log(`Devices found: ${devices}`)

app.get('/', (req, res) => {
	
	thermometers.readTemperature(devices[0], (err, temp) => {
		res.render('index', {
			f: temp,
			formatted: `${parseFloat(temp).toFixed(1)}° F`
		})
	}, thermometers.toDegreeFahrenheit);

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
