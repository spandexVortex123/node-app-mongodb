const host = 'localhost'
const username = 'dbuser'
const password = 'dbpassword'
const port = 27017
const dbname = 'app'

const url = {
    url: `mongodb://${username}:${password}@${host}:${port}/${dbname}`
}

module.exports = url;