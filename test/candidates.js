const mongoose = require("mongoose") 
const Candidate = require('../models/candidates') 

const chai = require('chai') 
const chaiHttp = require('chai-http') 
const server = require('../index') 
const Util = require('../utils/utils')
const should = chai.should() 

chai.use(chaiHttp) 

describe('Candidates', () => {
    beforeEach((done) => {
        Candidate.deleteMany({}, (err) => { 
           done()         
        })   
    })

    describe('/GET candidates', () => {
        it('should GET all the candidates', (done) => {
            chai.request(server)
            .get('/candidates')
            .end((err, res) => {
                  res.should.have.status(200)
                  res.body.should.be.a('array')
                  res.body.length.should.be.eql(0)
            done()
            })
        })
    })

    describe('/POST candidates', () => {
        it('should not POST a candidate without availability field', (done) => {
            let candidate = {
                name: "Carl"
            }
          
            chai.request(server)
            .post('/candidates')
            .send(candidate)
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.should.be.a('object') 
                res.body.should.have.property('info').eql('availability not provided') 
                done() 
            }) 
        }) 

        it('should POST a candidate', (done) => {
            let candidate = {
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
            .post('/candidates')
            .send(candidate)
            .end((err, res) => {
                res.should.have.status(200) 
                res.body.should.be.a('object') 
                res.body.should.have.property('info').eql('candidate created successfully') 
                res.body.candidate.should.have.property('name') 
                res.body.candidate.should.have.property('availability') 
                res.body.candidate.should.have.property('timestamp') 
                res.body.candidate.should.have.property('_id') 
                done() 
            }) 
        }) 
    }) 

    
    describe('/GET/ candidates/:id', () => {
        it('should GET a candidate by id', (done) => {
            const newCandidate = new Candidate({
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
           
            newCandidate.save((err, candidate) => {
                chai.request(server)
                .get('/candidates/' + candidate.id)
                .send(candidate)
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('availability') 
                    res.body.should.have.property('name') 
                    res.body.should.have.property('name').eql('Carl') 
                    res.body.should.have.property('timestamp') 
                    res.body.should.have.property('_id').eql(candidate.id) 
                    done() 
                }) 
            }) 
        }) 
    }) 
    

    describe('/PUT/ candidates/:id', () => {
        it('should UPDATE a candidate by id', (done) => {
            
            const newCandidate = new Candidate({
                name: "Carl",
                availability: Util.getTimeSlots([
                    {
                        "day": "06/05/2019",
                        "from": "9am",
                        "until": "10am"
                    }
                ])
            })
            
            newCandidate.save((err, candidate) => {
                chai.request(server)
                .put('/candidates/' + candidate.id)
                .send({name: 'Alice'})
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('info').eql('candidate updated successfully') 
                    res.body.candidate.should.have.property('name').eql('Alice') 
                    done() 
                }) 
            }) 
            
        }) 
    }) 

    describe('/DELETE candidates/:id', () => {
        it('should DELETE a candidate by id', (done) => {
            let newCandidate = new Candidate({
                name: "Alice",
                availability: Util.getTimeSlots([
                    {
                        "day": "04/04/2019",
                        "from": "1pm",
                        "until": "2pm"
                    }
                ])
            })

            newCandidate.save((err, candidate) => {
                chai.request(server)
                .delete('/candidates/' + candidate.id)
                .end((err, res) => {
                    res.should.have.status(200) 
                    res.body.should.be.a('object') 
                    res.body.should.have.property('info').eql('candidate removed successfully') 
                done() 
                }) 
            }) 
        }) 
    }) 
}) 