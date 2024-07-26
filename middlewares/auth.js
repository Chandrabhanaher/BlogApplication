const { getUser } = require('../service/auth')

function checkForAuthontication(req, res, next) {
    req.user = null
    const token = req.cookies?.token
    if (!token) return next()
 
    const user = getUser(token)

    req.user = user
    next()
}

function restrictTo(roles) {
    return function (req, res, next) {
        if (!req.user) { return res.redirect('/user/signin') }
        if (!roles.includes(req.user.role)) { return res.end('UnAuthorized') }
        return next()
    }
}

module.exports={
    checkForAuthontication,
    restrictTo,
}