const mongoose=require('mongoose');

const Patient= mongoose.Schema({
   height: {
       type : Number,
       required: true
   },
   weight: {
       type: Number,
       required: true
   },
   previousDoctors:{
       type: mongoose.Schema.ObjectId,
       ref: 'Doctor'
   },
   medicalReports:[ {
       type: String
   }],
   insurance: {
       type: [Array],
       required: true
   },
 user: {
     type: mongoose.Schema.ObjectId,
     ref: 'User',
     required: true
 }
   });

   module.exports= mongoose.model('Patient',Patient);