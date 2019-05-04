const _ = require('lodash')
const Candidate = require('../models/candidates')
const Interviewer = require('../models/interviewers')
const Util = require('../utils/utils')

module.exports = function(app) {

    /* Create candidate */
    app.post('/candidates',  (req, res) => {
        if(!req.body.availability)
            return res.json({info: 'availability not provided'})

        const newCandidate = new Candidate({
            name: req.body.name,
            availability: Util.getTimeSlots(req.body.availability)
        })

        newCandidate.save()
            .then( candidate => { 
                res.status(200).json({
                    info: 'candidate created successfully',
                    candidate: candidate
                })
            })
            .catch(err => { console.log(err) })
    })

    /* Find all candidates */
    app.get('/candidates', (req, res) => {
        Candidate.find()
        .then( candidates => {
            res.status(200).json(candidates)
        })
        .catch(err => { console.log(err) })
    })

    /* Find candidate by id */
    app.get('/candidates/:id', (req, res) => {
        const id = req.params.id
        Candidate.findById(id)
            .exec()
            .then(candidate => {
                if (candidate) 
                    res.status(200).json(candidate)
                else 
                    res.json({info: 'error finding candidate'})
            })
            .catch(err => { console.log(err) })
    })

    /* Get slots intersection */
    app.get('/candidates/:id/intersects', async (req, res) => {
        if(!req.query.interviewers) res.status(400).send("you must provide interviewers names")
        const interviewersNames = req.query.interviewers.split(",")
    
        try{
            const candidate = await Candidate.findOne({_id: req.params.id})
            const candidateAvailability = candidate.availability

            //get interviewers availability
            const interviewers =  await Interviewer.find({name:{$in: interviewersNames}, availability:{$in: candidateAvailability}}, '-timestamp -__v -_id', async (err, results) =>  results)
            
            //get names of interviewers that are available
            const interviewersAvailable = []
            _.forEach(interviewers, (interviewer) => {
                interviewersAvailable.push(interviewer.name)
            })
            
            //if any interviewer is not available, send name of the first interviewer that is not available
            _.forEach(interviewersNames, (name) => {
                if (!interviewersAvailable.includes(name)) 
                    res.status(404).send(name + " is not available")
            })

            //get interviewers availabity intersection
            const interviewersAvailability = interviewers.map( (interviewer) => Util.getTimeSlotsIntersection(candidateAvailability, interviewer.availability))
            const availabilityIntersection = _.last(interviewersAvailability)

            //parse output to be easily readable
            const slotsParsed = Util.slotsParser(availabilityIntersection)

            res.status(200).json(slotsParsed)
        }
        catch(err) {
            if(err.kind == "ObjectId")
                res.status(404).send("candidate not found, please check if id is correct")
            else
                res.status(500).send(err)
        }
    })

    /* Update */
    app.put('/candidates/:id', function (req, res) {
        const id = req.params.id
        Candidate.findById(id)
            .exec()
            .then(candidate => {
                if (candidate) {
                    const timeSlots = Util.getTimeSlots(req.body.availability)
                    candidate.availability = timeSlots
                    _.merge(candidate, req.body)
                    candidate.save(function(err) {
                        if (err) 
                            res.json({info: 'error during candidate update', error: err})
                        res.json({info: 'candidate updated successfully',
                            candidate: candidate})
                    })
                } 
                else {
                    res.json({info: 'candidate not found'})
                }
            })
            .catch(err => { console.log(err) })
    })

    /* Delete */
    app.delete('/candidates/:id', (req, res) => {
        const id = req.params.id
        Candidate.findByIdAndRemove(id, (err) => {
            if (err) 
                res.json({info: 'error removing candidate', error: err})
            res.json({ info: 'candidate removed successfully'})
        })
    })
}