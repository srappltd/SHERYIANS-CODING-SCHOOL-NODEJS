const mongoose = require("mongoose")

async function Mongoose(DATABASE_URL){
    await mongoose.connect(DATABASE_URL)
}

module.exports = {Mongoose}