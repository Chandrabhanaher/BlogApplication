const jwt = require('jsonwebtoken')
const secret = "chandra#$1591@%"


function setUser(user) {
    return jwt.sign({
        _id: user._id,
        name: user.fullname,
        email: user.email,
        role: user.role
    }, secret)
}

function getUser(token) {
    if (!token) return null
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null
    }
}

module.exports={
    getUser,
    setUser,
}