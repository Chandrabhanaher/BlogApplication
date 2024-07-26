const { Router } = require('express')
const User = require('../models/user')
const { setUser } = require('../service/auth')

const router = Router()

router.get('/signup', (req, res) => {
    return res.render('signup')
})
router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    await User.create({
        fullname: fullname,
        email: email,
        password: password
    })
    return res.redirect('/')
})

router.post('/signin', async(req, res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.matchPassword(email,password)
        const token = setUser(user)
        return res.cookie('token', token).redirect('/')
    }catch(error){
        return res.render('signin',{error:'Incurrect email or password'})
    } 
})

router.get('/logout', async(req, res)=>{
    return res.clearCookie('token').redirect('/')
})


module.exports = router