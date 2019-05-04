const mongoose = require("mongoose") 
const Interviewer = require('../models/interviewers') 
const Candidate = require('../models/candidates') 
const chai = require('chai') 
const chaiHttp = require('chai-http') 
const server = require('../index') 
const Util = require('../utils/utils')
const should = chai.should() 

chai.use(chaiHttp) 

describe('/GET/ candidates/:id/intersects=:Interviewers', () => {
    it('should check intersection between candidate and interviewers availability', (done) => {
        const carl = new Candidate({
            name: "Carl",
            availability: Util.getTimeSlots([
                {
                    "day": "06/05/2019",
                    "from": "9am",
                    "until": "10am"
                },
                {
                    "day": "07/05/2019",
                    "from": "9am",
                    "until": "10am"
                },
                {
                    "day": "06/05/2019",
                    "from": "10am",
                    "until": "12pm"
                },
                {
                    "day": "09/05/2019",
                    "from": "9am",
                    "until": "10am"
                },
                {
                    "day": "10/05/2019",
                    "from": "9am",
                    "until": "10am"
                }
            ])
        })

        const ines = new Interviewer({
            name: "Ines",
            availability: Util.getTimeSlots([
                {
                    "day": "06/05/2019",
                    "from": "9am",
                    "until": "4pm"
                },
                {
                    "day": "07/05/2019",
                    "from": "9am",
                    "until": "4pm"
                },
                {
                    "day": "08/05/2019",
                    "from": "9am",
                    "until": "4pm"
                },
                {
                    "day": "09/05/2019",
                    "from": "9am",
                    "until": "4pm"
                },
                {
                    "day": "10/05/2019",
                    "from": "9am",
                    "until": "4pm"
                }
            ])
        })

        const ingrid = new Interviewer({
            name: "Ingrid",
            availability: Util.getTimeSlots([
                {
                    "day": "06/05/2019",
                    "from": "12pm",
                    "until": "6pm"
                },
                {
                    "day": "07/05/2019",
                    "from": "9am",
                    "until": "12pm"
                },
                {
                    "day": "08/05/2019",
                    "from": "12pm",
                    "until": "6pm"
                },
                {
                    "day": "09/05/2019",
                    "from": "9am",
                    "until": "12pm"
                }
            ])
        })

        const expectedResult = [
            {
                "day": "Tuesday, 7 May 2019",
                "from": "9AM",
                "until": "10AM"
            },
            {
                "day": "Thursday, 9 May 2019",
                "from": "9AM",
                "until": "10AM"
            }
        ]

        ines.save((err, candidate) => {
            chai.request(server)
            .post('/interviewers/')
            .send(candidate)
        }) 

        ingrid.save((err, candidate) => {
            chai.request(server)
            .post('/interviewers/')
            .send(candidate)
        }) 

        carl.save((err, candidate) => {
            chai.request(server)
            .post('/candidates/')
            .send(candidate)
        }) 
        
        chai.request(server)
            .get('/candidates/' + carl.id + '/intersects?interviewers=' + ines.name + ',' + ingrid.name )
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')  
                res.body.should.be.eql(expectedResult) 
                done()
            })
    }) 
}) 