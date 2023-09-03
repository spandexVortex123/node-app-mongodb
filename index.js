const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 3000
const db = require('./db')
const User = require('./user-model')
const md5 = require('md5')

app.use(express.json())

mongoose.connect(db.url)
    .then(() => console.log('Connected To Database'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    console.log(User);
    res.json({
        message: "Hello world"
    })
})

// get all users
app.get('/all', (req, res) => {
    User.find()
        .then((response) => {
            res.json({
                users: response
            })
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err.message
            })
        })
})

// add new user
app.post('/add', (req, res) => {
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        res.json({
            status: false,
            error: 'Invalid JSON body received'
        })
    } else {
        let user = {
            username,
            password: md5(password),
            role: 'user'
        }
        User.create(user)
            .then(() => {
                res.json({
                    status: true,
                    message: 'User Created Successfully'
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: false,
                    message: err.message
                })
            })
    }
})

// delete user by id
app.delete('/delete', (req, res) => {
    let id = req.query.id
    if( !id ) {
        res.json({
            status: false,
            message: 'Invalid Id'
        })
    } else {
        User.findByIdAndDelete(id)
        .then((response) => {
            console.log(response);
            res.json({
                status: true,
                message: 'User deleted successfully'
            })
        })
        .catch(err => {
            res.json({
                status: false,
                message: err.message
            })
        })
    }
})

app.put('/update', (req, res) => {
    let id = req.body.id
    let username = req.body.username
    let password = req.body.password
    if( !id || !username || !password) {
        res.json({
            status: false,
            error: 'Invalid JSON body received for update'
        })
    } else {
        User.findById(id)
            .then(oldUser => {
                console.log('Old user' + oldUser);
                let newUser = {
                    username,
                    password: md5(password),
                    role: oldUser.role
                }
                User.findByIdAndUpdate(id, newUser)
                    .then((response) => {
                        console.log('updated user' + response);
                        res.json({
                            status: true,
                            message: 'User updated successfully'
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: false,
                            message: err.message
                        })
                    })
            })
            .catch(err => {
                res.json({
                    status: false,
                    message: err.message
                })
            })
    }
})


app.listen(port, () => console.log(`Server started on port ${port}`))