const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose')
const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png'
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: 'USER'
    }
}, { timestamps: true })


userSchema.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) return

    const key = randomBytes(16).toString()
    const hashPassword = createHmac('sha256', key)
        .update(user.password)
        .digest('Hex')
    this.salt = key
    this.password = hashPassword
    return next()
})

userSchema.static('matchPassword', async function (email, password) {
    const user = await this.findOne({ email })

    if (!user) throw new Error('User not found')

    const salt = user.salt
    const hashPassword = user.password

    const userProvideHash = createHmac('sha256', salt)
        .update(password)
        .digest('Hex')

    if (hashPassword !== userProvideHash) throw new Error('Incorrect password')

    console.log(user)
    return user
})



const User = model('user', userSchema)

module.exports = User