const dotenv = require('dotenv').config({path: __dirname + '/.env'})
if (dotenv.error) throw dotenv.error

const sys = require('sys')
const exec = require('child_process').exec
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
app.use(express.json());

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

app.get('/api/screen', (req, res) => {
    exec("vcgencmd display_power", (error, stdout, stderr) => {
    	let screen = stdout.trim()
	res.json({
	    screen: screen,
	    power: screen.slice(-1)
	})
    })
})

app.post('/api/screen/toggle', (req, res) => {
    exec("vcgencmd display_power", (error, stdout, stderr) => {
	let t = stdout.trim().slice(-1)
	let toggle = (t == 1) ? 0 : 1
        exec(`vcgencmd display_power ${toggle}`, (e, stdout, stderr) => {
	    let out = stdout.trim()
            res.json({
	        screen: out,
		power: toggle,
		t: t
	    })
	})
    })
})

app.post('/api/pictureframe', (req, res) => {
    let response = {
        success: false,
        request: req.body
    }

    // Are you human?
    if(!req.body.captcha || req.body.captcha != 4) {
        return res.status(403).json(response)
    }

    // What?  No payload?
    if(!req.body.message && !req.body.image) {
        return res.status(418).json(response)
    }

    // All good!
    push.trigger('pictureframe-update', req.body)
    response.success = true
    return res.status(200).json(response)
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
