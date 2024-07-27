const { Router } = require('express')
const path = require('path')
const multer = require('multer')
const User = require('../models/user')
const { setUser } = require('../service/auth')

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/images/')
        )
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

router.get('/signup', (req, res) => {
    return res.render('signup')
})
router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.post('/signup', upload.single('profilePic'), async (req, res) => {
    console.log(req.file)
    const { fullname, email, password } = req.body;
    await User.create({
        fullname: fullname,
        email: email,
        password: password
    })
    //profileImageUrl : `/public/images/${req.file.filename}`
    return res.redirect('/')
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.matchPassword(email, password)
        const token = setUser(user)
        return res.cookie('token', token).redirect('/')
    } catch (error) {
        return res.render('signin', { error: 'Incurrect email or password' })
    }
})

router.get('/logout', async (req, res) => {
    return res.clearCookie('token').redirect('/')
})


module.exports = router