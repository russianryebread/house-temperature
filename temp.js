const thermometers = require('temper1')

class Temp
{

    constructor()
    {
        this.devices = this.getDevices()
    }

    getDevices()
    {
        try {
            let devices = thermometers.getDevices()
            if(devices.length) {
                console.log(`Devices found: ${devices}`)
                return devices
            }
            throw new Error('No TEMPer Devices found.')
        } catch (error) {
            console.error(error)
        }
        return []
    }

    read(res, callback)
    {
        try {
            if(this.devices.length) {
                thermometers.readTemperature(this.devices[0], callback)
            } else {
                throw new Error('No available TEMPER devices to read.')
            }
        } catch (error) {
            console.error(error)

            // If we get an exception, try getting the device again.
            // Sometimes the device changes addresses, so this keeps
            // the app alive.
            this.getDevices()

            res.status(500)
            return res.json({error: error.message})
        }
    }

    c2f(c)
    {
        return thermometers.celsiusToFahrenheit(c)
    }
}

module.exports = Temp