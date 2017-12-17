const thermometers = require('temper1')

class Temp
{

    constructor()
    {
        this.devices = this.getDevices()
        this.update = {
            time: 0,
            temp: null
        }
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

    cachedRead(res, callback)
    {
        var now = new Date().getTime()
        var cacheTime = 3000 // Three Seconds
        var t = 0

        if(this.update.time < (now - cacheTime)) {
            return this.read(res, (err, c) => {
                console.log(`Updating cached temperature (${c}).`)
                this.update.temp = c
                this.update.time = new Date().getTime()
                callback(err, c)
            })
        }
        
        console.log(`Returning cached temperature (${this.update.temp}). Cache expires in ${(this.update.time - now) / 1000} seconds.`)
        return callback(null, this.update.temp)
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