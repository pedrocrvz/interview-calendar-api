var mongoose = require('mongoose')

var interviewerSchema = mongoose.Schema({
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

module.exports = mongoose.model('Interviewer', interviewerSchema)