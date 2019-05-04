const mongoose = require("mongoose") 
const Interviewer = require('../models/interviewers') 

const chai = require('chai') 
const chaiHttp = require('chai-http') 
const server = require('../index') 
const Util = require('../utils/utils')
const should = chai.should() 


chai.use(chaiHttp) 

describe('Interviewers', () => {
    beforeEach((done) => {
        Interviewer.deleteMany({}, (err) => { 
           done()         
        })   
    })

    describe('/GET interviewers', () => {
        it('should GET all the interviewers', (done) => {
            chai.request(server)
            .get('/interviewers')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(0)
            done()
            })
        })
    })

    describe('/POST interviewers', () => {
        it('should not POST a interviewer without availability field', (done) => {
            let interviewer = {
                name: "Carl"
            }
          
            chai.request(server)
            .post('/interviewers')
            .send(interviewer)
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.should.be.a('object') 
                res.body.should.have.property('info').eql('availability not provided') 
                done() 
            }) 
        }) 

        it('should POST a interviewer', (done) => {
            let interviewer = {
                name: "Carl",
                availability: [
                    {
                        "day": "06/05/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "07/04/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "06/04/2019",
                        "from": "10am",
                        "until": "12pm"
                    },
                    {
                        "day": "09/04/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "10/04/2019",
                        "from": "9am",
                        "until": "10am"
                    }
                ]
            }

            chai.request(server)
            .post('/interviewers')
            .send(interviewer)
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.should.be.a('object') 
                res.body.should.have.property('info').eql('interviewer created successfully') 
                res.body.interviewer.should.have.property('name') 
                res.body.interviewer.should.have.property('availability') 
                res.body.interviewer.should.have.property('timestamp') 
                res.body.interviewer.should.have.property('_id') 
                done() 
            }) 
        }) 
    }) 

    
    describe('/GET/ interviewers/:id', () => {
        it('should GET a interviewer by id', (done) => {
            const newInterviewer = new Interviewer({
                name: "Carl",
                availability: Util.getTimeSlots([
                    {
                        "day": "06/05/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "07/04/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "06/04/2019",
                        "from": "10am",
                        "until": "12pm"
                    },
                    {
                        "day": "09/04/2019",
                        "from": "9am",
                        "until": "10am"
                    },
                    {
                        "day": "10/04/2019",
                        "from": "9am",
                        "until": "10am"
                    }
                ])
            })

            newInterviewer.save((err, interviewer) => {
                chai.request(server)
                .get('/interviewers/' + interviewer.id)
                .send(interviewer)
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('availability') 
                    res.body.should.have.property('name') 
                    res.body.should.have.property('name').eql('Carl') 
                    res.body.should.have.property('timestamp') 
                    res.body.should.have.property('_id').eql(interviewer.id) 
                    done() 
                }) 
            }) 
        }) 
    }) 
    

    describe('/PUT/ interviewers/:id', () => {
        it('should UPDATE a interviewer by id', (done) => {
            
            const newInterviewer = new Interviewer({
                name: "Carl",
                availability: Util.getTimeSlots([
                    {
                        "day": "06/05/2019",
                        "from": "9am",
                        "until": "10am"
                    }
                ])
            })
            
            newInterviewer.save((err, interviewer) => {
                chai.request(server)
                .put('/interviewers/' + interviewer.id)
                .send({name: 'Alice'})
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('info').eql('interviewer updated successfully') 
                    res.body.interviewer.should.have.property('name').eql('Alice') 
                    done() 
                }) 
            }) 
            
        }) 
    }) 

    describe('/DELETE interviewers/:id', () => {
        it('should DELETE a interviewer by id', (done) => {
            let newInterviewer = new Interviewer({
                name: "Alice",
                availability: Util.getTimeSlots([
                    {
                        "day": "04/04/2019",
                        "from": "1pm",
                        "until": "2pm"
                    }
                ])
            })

            newInterviewer.save((err, interviewer) => {
                chai.request(server)
                .delete('/interviewers/' + interviewer.id)
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('info').eql('interviewer removed successfully') 
                done() 
                }) 
            }) 
        }) 
    }) 
}) 