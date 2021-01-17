import express from 'express'
import bodyParser from 'body-parser'
import ejs from 'ejs'
import mongoose from 'mongoose'

const PORT = 3000
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = {
    email: String,
    password: String
}

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
    const userInfo = {
        username: req.body.username,
        password: req.body.password
    }

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save((err) => {
        if (!err) {
            console.log('User saved!')
            res.render('secrets')
        }

    })
    console.log(userInfo)
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
        if (err)
            console.error(err)
        else if (foundUser) {
            if (foundUser.password === password)
                res.render('secrets')
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})