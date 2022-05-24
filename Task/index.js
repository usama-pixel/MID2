const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user')
const multer = require('multer')
const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')

// mongoose
mongoose.connect('mongodb://127.0.0.1:27017/Users')
.then((result) => {
    console.log('connected to db')
    app.listen(3000,()=> {
        console.log('listening to port 3000')
    })
})
.catch((err) => {
    console.log(err)
})
// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const {originalname} = file
        cb(null, originalname + '-' + Date.now())
    }
})
const upload = multer({ storage: storage })

// apis



app.post('/upload', upload.single('avatar'), (req, res) => {
    return res.json({ status: 'OK'});
});


app.post('/setData', (req,res) => {
    const {name, email, number, country, state, city, address, zip} = req.body
    const user = new User({
        name,
        email,
        number,
        country,
        state,
        city,
        address,
        zip
    })
    user.save()
    .then((result) => {
        console.log('added')
        res.redirect('/userlist')
    })
    .catch((err) => console.log(err))

    // console.log('yes')
    // res.send({data:'yes'})
})

app.get('/userlist',(req,res) => {
    User.find()
    .then((result)=>{
        console.log(result)
        res.render('Userlist',{result})
    }).catch((err)=> {
        console.log(err)
        res.send({data: 'errpr'})
    })
})

app.get('/',(req,res) => {
    res.render('Register')
})



