const Pusher = require('pusher')
const pusher = new Pusher({
    appId: '489906',
    key: 'e00904f9d5e6bca9fa0c',
    secret: 'f1bf8a6a81024b78a3c6',
    cluster: 'us2',
    encrypted: true
});

const channel = 'house'

exports.event = (event, message, data = {}) => {
    pusher.trigger(channel, event, {
        message: message,
        data: data
    });
}
