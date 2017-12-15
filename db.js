const sqlite3 = require('sqlite3').verbose();

const TABLE_NAME = 'historic_temps'
const DB_NAME = 'temps.db'

class Db
{
    constructor()
    {
        this.db = new sqlite3.Database(`./db/${DB_NAME}`);
        this.up()
    }

    up() {
        this.db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (temp, created_at)`);
    }

    historic() {
        let results = []

        let sql = `SELECT temp, created_at FROM ${TABLE_NAME} ORDER BY created_at ASC LIMIT 100`;        
        this.db.each(sql, ['w'], (err, row) => {
            if (err) throw err
            results.push(row)
        })

        return results
    }

    save(temp) {
        let response = {
            success: true,
            message: "Updated!"
        }
        let sql = `INSERT INTO ${TABLE_NAME}(temp, created_at)`
        let date = new Date().toISOString()

        this.db.run(sql, [temp, date], function(err) {
            if (err) {
                console.error(err.message)
                response.success = false
                response.message = `Error saving temp: ${err.message}`
                return response
            }
        })
        
        return response
    }


    destroy() {
        this.db.close();
    }
}

exports.init = () => { return new Db() }

module.exports = Db