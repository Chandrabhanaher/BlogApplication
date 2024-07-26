const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const { dbConnect } = require('./dbConnection')
const { checkForAuthontication, restrictTo } = require('./middlewares/auth')

const userRoute = require('./routes/userroute')
const blogRoute = require('./routes/blogroute')


const app = express()
const PORT = 8000

dbConnect('mongodb://127.0.0.1:27017/blogs')

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthontication)

const Blog = require('./models/blog')
app.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    return res.render('home', { 
        user: req.user, 
        blog: blogs 
    })
})

app.use('/user', userRoute)
app.use('/add-blog', blogRoute)


const utcDate = new Date().toUTCString()
const d = new Date(utcDate)
console.log(formatAMPM(d))
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return `${d.toLocaleDateString()} ${strTime}`;
  }

app.listen(PORT, () => { console.log('Server is running') })