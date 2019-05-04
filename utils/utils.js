const moment = require('moment')

/*
EXAMPLE
IF INPUT IS:
"availability": [
    {
        "day": "2019/05/04",
            "from": "11am",
            "until": "2pm"
    }
]

OUTPUT IS:
{ availability:
   [ 2019-05-04T11:00:00.000Z,    AVAILABLE FROM 11 UNTIL 12
     2019-05-04T12:00:00.000Z,    AVAILABLE FROM 12 UNTIL 13
     2019-05-04T13:00:00.000Z]    AVAILABLE FROM 13 UNTIL 14
}
*/

exports.getTimeSlots = (availability) => {
    const slots = []
    if(!availability)
        return
    availability.forEach((slot) => {
        const start = moment(`${slot.day} ${slot.from}`, 'DD-MM-YYYY hh:mm a')
        const end = moment(`${slot.day} ${slot.until}`, 'DD-MM-YYYY hh:mm a')
        

        //1h slot
        while(start < end) {
            slots.push(new moment(start, 'DD-MM-YYYY hh:mm a'))
            start.add(1, 'hours')
        }
    })
    return slots
}



exports.getTimeSlotsIntersection = (candidateAvailability, interviewersAvailability) => {
    const slots = []
    candidateAvailability.forEach((candidateSlot) => {
        interviewersAvailability.forEach((interviewerSlot) => {
            if (interviewerSlot.getTime() === candidateSlot.getTime()){
                slots.push(interviewerSlot)
                    
            }
        })
    })
    return slots
    /*
    //remove duplicates
    return slots
        .map((date) => { 
            return date.getTime() 
        })
        .filter( (date, i, array) => {
            return array.indexOf(date) === i
        })
        .map( (time) => { 
            return new Date(time)
        })
    */
}


exports.slotsParser = (arr) =>{
    slotsParsed = []
    arr.forEach((slot) => {

        const numDay = moment(slot).format('D')
        const day = moment(slot).format('dddd')
        const month = moment(slot).format('MMMM')
        const year = moment(slot).format('YYYY')
        const from = moment(slot).format('HA')
        const until = moment(slot).add(1,'hours').format('HA')

        const slotParsed = {
            day : `${day}, ${numDay} ${month} ${year}`,
            from : from,
            until: until
        }

        slotsParsed.push(slotParsed)
    })
    return slotsParsed
}

    