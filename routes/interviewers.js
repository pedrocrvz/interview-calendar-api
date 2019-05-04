const _ = require('lodash')
const Interviewer = require('../models/interviewers')
const Util = require('../utils/utils')

module.exports = (app) => {

    /* Create interviewer */
    app.post('/interviewers', (req, res) => {
        if(!req.body.availability)
            return res.json({ info: 'availability not provided'})

        const newInterviewer = new Interviewer({
            name: req.body.name,
            availability: Util.getTimeSlots(req.body.availability)
        })

        newInterviewer.save()
            .then( interviewer => { 
                //console.log(interviewer) 
                res.status(200).json({
                    info: 'interviewer created successfully',
                    interviewer: interviewer
                })
            })
            .catch(err => { console.log(err) })
    })

    /* Find all interviewer */
    app.get('/interviewers', (req, res) => {
        Interviewer.find()
        .then( interviewers => {
            res.status(200).json(interviewers)
        })
        .catch(err => { console.log(err) })
    })

    /* Find interviewer by id */
    app.get('/interviewers/:id', (req, res) => {
        const id = req.params.id
        Interviewer.findById(id)
            .exec()
            .then(interviewer => {
                if (interviewer) 
                    res.status(200).json(interviewer)
                else 
                    res.json({info: 'error finding interviewer', error: err})
            })
            .catch(err => { console.log(err) })
    })


    /* Update */
    app.put('/interviewers/:id', function (req, res) {
        const id = req.params.id
        Interviewer.findById(id)
            .exec()
            .then(interviewer => {
                if (interviewer) {
                    const timeSlots = Util.getTimeSlots(req.body.availability)
                    interviewer.availability = timeSlots
                    _.merge(interviewer, req.body)
                    interviewer.save(function(err) {
                        if (err) 
                            res.json({info: 'error during interviewer update', error: err})
                        res.json({info: 'interviewer updated successfully', interviewer: interviewer})
                    })
                } 
                else {
                    res.json({info: 'interviewer not found'})
                }
            })
            .catch(err => { console.log(err) })
    })

    /* Delete */
    app.delete('/interviewers/:id', (req, res) => {
        const id = req.params.id
        Interviewer.findByIdAndRemove(id, (err) => {
            if (err) 
                res.json({info: 'error removing interviewer', error: err})
            res.json({ info: 'interviewer removed successfully'})
        })
    })
}