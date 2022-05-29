const mongoose =require('mongoose');



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
        required: true,
    },
    availableTime: {
        type: String,
        required: true
    },
    startDate:Date,
    repeatingTimes:String,
    timeComments: String,
    images: [
        {type :String}
    ]
});



module.exports=mongoose.model('PreAppointment',PreAppointmentSchema);