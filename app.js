require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const PORT = 3000
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash    //hash password by bcrypt
        })

        newUser.save((err) => {
            if (!err) {
                console.log('User saved!')
                res.render('secrets')
            }
        })
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
        if (err)
            console.error(err)
        else if (foundUser) {
            bcrypt.compare(password, foundUser.password, function (err, result) {
                // result == true
                if (result) {
                    res.render('secrets')
                } else {
                    console.error(err)
                }
            })
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})