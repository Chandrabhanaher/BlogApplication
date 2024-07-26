const { Router } = require('express')
const multer  = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const router = Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function(req, file, cb){
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

router.get('/', (req, res)=>{
    return res.render('add_blog',{
        user: req.user
    })
})

router.post('/addblog', upload.single('coerImageUrl'),async(req,res)=>{
    const {title,body} = req.body
    await Blog.create({
        title:title,
        body:body,
        coerImageUrl:`uploads/${req.file.filename}`,
        createdBy:req.user._id
    })
    return res.redirect('/add-blog')
})


module.exports = router