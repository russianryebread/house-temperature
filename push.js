const Pusher = require('pusher')
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'us2',
    encrypted: true
});

const channel = process.env.PUSHER_CHANNEL

exports.event = (event, message, data = {}) => {
    pusher.trigger(channel, event, {
        message: message,
        data: data
    });
}

exports.trigger = (event, data = {}) => {
    pusher.trigger(channel, event, data);
}
