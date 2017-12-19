const { Client } = require('tplink-smarthome-api')
const client = new Client()

// exports.status = (callback) => {
//     plug = client.getDevice({host: '10.0.1.2'}).then((device)=>{
//         device.getSysInfo().then(callback);
//     })
// }

exports.status = (host, callback) => {
    return client.getDevice({host: host}).then((device) => {
        device.getSysInfo().then(callback)
    }).catch((err) => {
        console.error(err)
        callback(err.message)
    })
}

exports.on = (callback) => {
    return client.startDiscovery().on('device-new', (device) => {
        device.getSysInfo().then(callback)
        device.setPowerState(true)
    }).catch((err) => {
        console.error(err)
        callback(err.message)
    })
}

exports.off = () => {
    return client.startDiscovery().on('device-new', (device) => {
        device.getSysInfo().then(callback)
        device.setPowerState(false)
    }).catch((err) => {
        console.error(err)
        callback(err.message)
    })
}
