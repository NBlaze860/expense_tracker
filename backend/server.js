import express from 'express'
import Transaction from './models/transaction.js'
import User from './models/user.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

dotenv.config();
const app = express()
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send("<h2>WORKING</h2>")
})

app.get('/api/transactions', isLoggedIn, async (req, res) => {
    if (req.err) {
        res.send(req.err)
    }
    else {
        let user = await User.findOne({ email: req.user.email }).populate("transactions")
        res.send(user) // sends response to frontend request
    }
})

app.post('/api/transactions', isLoggedIn, async (req, res) => {
    if (req.err) {
        res.send(req.err)
    }
    else {
        let user = await User.findOne({ email: req.user.email })
        const { description, amount, date, time } = req.body
        const transaction = await Transaction.create({ description, amount, date, time })
        user.transactions.push(transaction._id)
        await user.save()
        res.send(req.body)
    }
})

app.delete('/api/delete', isLoggedIn, async (req, res) => {
    if (req.err) {
        res.send(req.err)
    }
    else {
        let user = await User.findOne({ email: req.user.email })
        user.transactions.splice(user.transactions.indexOf(req.body.id), 1)
        await user.save()
        await Transaction.findByIdAndDelete({ _id: req.body.id })
    }
})

app.get('/api/transaction/:id', async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
    res.send(transaction)
})

app.post('/api/transaction/:id', async (req, res) => {
    const { description, amount, date, time } = req.body
    await Transaction.findOneAndUpdate({ _id: req.params.id }, { description, amount, date, time })
    res.send()
})

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body
    if (!name) {
        return res.json({
            error: 'Please enter name'
        })
    }
    if (!password || password.length < 8) {
        return res.json({
            error: 'Password should be atleast 8 characters long'
        })
    }
    const exist = await User.findOne({ email })
    if (exist) {
        return res.json({
            error: 'Email already taken'
        })
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const user = await User.create({ name, email, password: hash })
            const token = jwt.sign({ email: email, userid: user._id }, process.env.SECRET_KEY)
            res.cookie("token", token)
            return res.json(user)
        })
    })
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.json({
            error: 'something went wrong'
        })
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email: email, userid: user._id }, process.env.SECRET_KEY)
            res.cookie("token", token)
            return res.json(user)
        }
        else {
            return res.json({ error: 'something went wrong' })
        }
    })
})

app.get('/api/logout', (req, res) => {
    res.cookie("token", "")
    res.send()
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token && req.cookies.token == "") {
        req.err = { error: "Not logged in" }
        next()
    }
    else {
        try {
            let data = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
            req.user = data
            next()
        }
        catch (err) {
            req.err = { error: "Not logged in" }
            next()
        }
    }
}

app.listen(port, () => { console.log("http://localhost:4000") })
