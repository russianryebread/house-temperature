require('dotenv').config()
const Temp = require('./temp.js')
const plug = require('./plug.js')
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
app.use(express.static('public'))
app.use(cors())

const auth = basicAuth({
    users: { 'admin': process.env.ADMIN_ACCESS_PASSWORD },
    challenge: false
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
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log(`${ip} turned ${device.alias} on!`)
        res.json({ online: device.relay_state, device: device })
    })
})

app.post('/api/plug/:hostname/off', auth, (req, res) => {
    plug.off(req.params.hostname, (device) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log(`${ip} turned ${device.alias} off!`)
        res.json({ online: device.relay_state, device: device })
    })
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))