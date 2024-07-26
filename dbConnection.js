const mongoose = require('mongoose')

async function dbConnect(url){
    return mongoose.connect(url)
    .then(()=> console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection Errror ', err))
}

module.exports = {
    dbConnect,
}