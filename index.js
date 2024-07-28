require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const { dbConnect } = require('./dbConnection')
const { checkForAuthontication, restrictTo } = require('./middlewares/auth')

const userRoute = require('./routes/userroute')
const blogRoute = require('./routes/blogroute')
const Blog = require('./models/blog')

console.log('MongoDB URL :',process.env.MONGO_URL, ' PORT : ', process.env.PORT)
const app = express()
const PORT = process.env.PORT || 8001

dbConnect(process.env.MONGO_URL)

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthontication)

app.use(express.static(path.resolve('./public')));
app.use('*/images',express.static(path.join(__dirname, 'public/images')));
app.use('*/uploads',express.static(path.join(__dirname, 'public/uploads')));

app.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    return res.render('home', { 
        user: req.user, 
        blog: blogs 
    })
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)


const utcDate = new Date(new Date().toUTCString())
console.log(`UTS Date Time : `,utcDate)
const d = new Date(utcDate)
console.log(`IST Date time : `,formatAMPM(d))
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return `${d.toLocaleDateString()} ${strTime}`;
  }

app.listen(PORT, () => { console.log('Server is running') })