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

const port = (process.env.PORT) ? process.env.PORT : 80

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(cors())

const auth = basicAuth({
    users: { 'admin': process.env.ADMIN_ACCESS_PASSWORD },
    challenge: false
})

app.get('/', (req, res) => {
    temp.read(res, (err, temp) => {
        let f = temp.c2f(temp)
        res.render('index', {
            c: temp,
            f: f,
            formatted: {
                c: `${utils.fmt(temp)} C`,
                f: `${utils.fmt(f)} F`
            }
        })
    })
})

app.get('/api', (req, res) => {
    db.historic((history) => {
        temp.read(res, (err, c) => {
            res.json({
                c: utils.round(c),
                f: utils.round(temp.c2f(c)),
                history: history
            })
        })
    })
})

app.post('/api/save', (req, res) => {
    temp.read(res, (err, c) => {
        db.save(temp.c2f(c), (dbRes) => {
            res.json(dbRes)
        })
    })
})

app.get('/api/plug', (req, res) => {
    plug.status((status) => {
        res.json({ status: status })
    })
})

app.post('/api/plug/on', auth, (req, res) => {
    plug.on((status) => {
        res.json({ status: status })
    })
})

app.post('/api/plug/off', auth, (req, res) => {
    plug.off((status) => {
        res.json({ status: status })
    })
})

app.listen(port, () => console.log(`Temperature app listening on port ${port}!`))
