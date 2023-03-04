const { urlencoded } = require('express')
const express = require('express')
const { _applyPlugins } = require('mongoose')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(urlencoded({extended: false}))
// app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', async (req,res) => {
    try {
        const shortUrls = await ShortUrl.find()
        res.render('index', {shortUrls: shortUrls})    
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/delete/:shortUrl', async (req, res) => {
    let shortUrl
    try {
        shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })
        await shortUrl.remove()
        res.redirect('/')
    } catch (error) {
        res.status(400).send({
            success: false,
            'message': 'Something went wrong'
        })
    }
})

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })
        if (shortUrl === null) {
            return res.status(400).send('Short url not found')
        } else {
            shortUrl.clicks++
            shortUrl.save()
            res.redirect(shortUrl.full)
        }
    } catch (error) {
        return res.status(400).send(error)
    }

})

app.listen(port, () => {
     console.log(`server is running on port ${port}`)
})