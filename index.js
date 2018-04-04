const dotenv = require('dotenv').config({path: __dirname + '/.env'})
if (dotenv.error) throw dotenv.error

const Temp = require('./temp.js')
const plug = require('./plug.js')
const push = require('./push.js')
const Db = require('./db.js')
const utils = require('./utils.js')
const cors = require('cors')
const basicAuth = require('express-basic-auth')
const express = require('express')
const app = express()
const db = new Db()
const temp = new Temp()

if(process.env.BUGSNAG_API_KEY) {
    const bugsnag = require("bugsnag")
    bugsnag.register(process.env.BUGSNAG_API_KEY)
}

const port = (process.env.PORT) ? process.env.PORT : 80

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use(cors())

const auth = basicAuth({
    users: { 'admin': process.env.ADMIN_ACCESS_PASSWORD },
    challenge: false,
    unauthorizedResponse: (req) => {
        return req.auth ? 'Incorrect login credentials' : 'No credentials provided'
    }
})

app.get('/', (req, res) => {
    temp.cachedRead(res, (err, c) => {
        let f = temp.c2f(c)
        res.render('index', {
            c: c,
            f: f,
            formatted: {
                c: `${utils.fmt(c)} C`,
                f: `${utils.fmt(f)} F`
            }
        })
    })
})

app.get('/api', (req, res) => {
    db.historic((history) => {
        temp.cachedRead(res, (err, c) => {
            res.json({
                c: utils.round(c),
                f: utils.round(temp.c2f(c)),
                history: history
            })
        })
    })
})

app.post('/api/save', (req, res) => {
    temp.cachedRead(res, (err, c) => {
        if(err) { return res.json({error: "Error reading temperature"}) }

        db.save(temp.c2f(c), (dbRes) => {
            res.json(dbRes)
        })
    })
})

app.get('/api/plug/:hostname', (req, res) => {
    plug.status(req.params.hostname, (device) => {
        res.json({ online: device.relay_state, device: device })
    })
})

app.post('/api/plug/:hostname/on', auth, (req, res) => {
    plug.on(req.params.hostname, (device) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        let message = `${ip} turned ${device.alias} on!`
        console.log(message)
        push.event('plug-update', message, device)
        res.json({ online: device.relay_state, device: device })
    })
})

app.post('/api/plug/:hostname/off', auth, (req, res) => {
    plug.off(req.params.hostname, (device) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        let message = `${ip} turned ${device.alias} off!`
        console.log(message)
        push.event('plug-update', message)
        res.json({ online: device.relay_state, device: device })
    })
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
