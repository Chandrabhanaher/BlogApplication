const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const Comment = require('../models/comments')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

router.get('/', (req, res) => {
    return res.render('add_blog', {
        user: req.user
    })
})
router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const sort = {createdAt:-1}
    const comments = await Comment.find({blogId:req.params.id}).populate('createdBy').sort(sort)
    return res.render('blogview', {
        user: req.user,
        blog,
        comments
    })
})

router.post('/add_comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.comment,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/addblog', upload.single('coerImageUrl'), async (req, res) => {
    const { title, body } = req.body
    await Blog.create({
        title: title,
        body: body,
        coerImageUrl: `uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    return res.redirect('/blog')
})



module.exports = router