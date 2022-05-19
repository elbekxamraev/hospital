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
ratingsAverage: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val=>Math.round(val*10)/10
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
}
});



module.exports= mongoose.model('Doctor',Doctor);