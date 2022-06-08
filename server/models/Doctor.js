const mongoose = require('mongoose');


const Doctor= mongoose.Schema({
 proffesion:{
     type: String,
     required: true
 },
 degree: {
     type : String,
     required: true
 },
 ratings: [{ 
     type: mongoose.Schema.ObjectId,
     ref: 'Ratings'
 }],
 workingHours: {
     type: [{
         type:String
     }],
     required: true
 },
vocationTime:{
    startDate: Date,
    endDate: Date
}
,
 pendingAppointments:{
     type: Number,
     default: 0 
 },
 closedAppointments:{
    type: Number,
    default: 0
},
 cancelledAppointments: {
    type: Number,
    default: 0
},
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
}
});



module.exports= mongoose.model('Doctor',Doctor);