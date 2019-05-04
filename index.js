const express = require('express')
const app = express()

const mongoose = require('mongoose')

//'mongodb://localhost/interviewcalendar'
mongoose.connect('mongodb://mongo:27017/interviewcalendar', { useNewUrlParser: true, useFindAndModify: false } )
.then(
    () => { 
      console.log("Database connected")
    },
    err => {
      console.log(err)
    }
)

app.use(express.urlencoded({extended: false}))
app.use(express.json())


const candidatesRoutes = require('./routes/candidates')(app)
const interviewersRoutes = require('./routes/interviewers')(app)

const server = app.listen(3000, () =>{
    console.log('Server running at http://127.0.0.1:3000/')
})

module.exports = server //for test purposes