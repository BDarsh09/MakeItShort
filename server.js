const { urlencoded } = require('express')
const express = require('express')
const app = express()
// const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

const port = process.env.PORT || 3000

// mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

app.use(urlencoded({extended: false}))
// app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', async (req,res) => {
    try {
        const shortUrls = await shortUrl.find()
        res.render('index', {shortUrls: shortUrls})    
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl =  await shortUrl.findOne({ short: req.params.shortUrl })
        if (shortUrl === null) {
            return res.status(400).send('Short url not found')
        } else {
            shortUrl.clicks++
            shortUrl.save()
            res.redirect(shortUrl.full)
        }
    } catch(error) {
        return res.status(400).send(error)
    }
    
})

app.post('/shortUrls', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})



app.listen(port, () => {
     console.log(`server is running on port ${port}`)
})