const mongoose = require('mongoose')

const candidatesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    availability: [Date],
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Candidates', candidatesSchema)