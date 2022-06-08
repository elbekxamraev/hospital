const mongoose =require('mongoose');
const User = require('./User');



const PreAppointmentSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    feelings: {
        type: String,
        required: true
    },
    availableDate: {
        type: Date,
    
    },
    availableTime: {
        type: String,
       
    },
    startDate:Date,
    repeatingTimes:String,
    timeComments: String,
    followUpAppointmentId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment'
    },
    images: [
        {type :String}
    ],
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});



module.exports=mongoose.model('PreAppointment',PreAppointmentSchema);