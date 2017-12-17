const sqlite3 = require('sqlite3').verbose();

const TABLE_NAME = 'historic_temps'
const DB_NAME = 'temps.db'

class Db
{
    constructor()
    {
        this.db = new sqlite3.Database(`${__dirname}/db/${DB_NAME}`);
        this.up()
    }

    up() {
        this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (temp, created_at)`);
    }

    historic(callback, limit = 100) {
        let results = []
        let sql = `SELECT * FROM (SELECT * FROM ${TABLE_NAME} ORDER BY created_at ASC LIMIT ${limit}) ORDER BY created_at DESC LIMIT ${limit}`

        this.db.each(sql, (err, row) => {
            if (err) throw err
            results.push(row)
        }, () => {
            return callback(results)
        })
    }

    save(temp, callback) {
        let sql = `INSERT INTO ${TABLE_NAME} (temp, created_at) VALUES (?, ?)`
        let date = new Date().toISOString()

        let response = {
            success: true,
            message: `Updating temp to ${temp} at ${date}.`
        }

        this.db.run(sql, [temp, date], (err) => {
            if (err) {
                console.error(err.message)
                response.success = false
                response.message = `Error saving temp: ${err.message}`
            }
            return callback(response)
        })
    }


    destroy() {
        this.db.close();
    }
}

module.exports = Db