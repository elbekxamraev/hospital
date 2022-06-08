const mongoose=require('mongoose');



const AppointmentShcema= mongoose.Schema({
    doctors:[ { 
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    }],
    patients:[{ 
       type: mongoose.Schema.ObjectId,
       ref: 'User',
       required: true
   }],
   comments: { 
       type: String
   },
   status: {
     type: String,
     enum: ['done','pending','started','cancelled'],
     default: 'pending'  
   },
   documents:{
       type: [ {
           type: String
           
       }],
       default: []
    },
    drugsList: {
        type: [ {
            type: String
            
        }],
        default: []
     },
    referenceToOtherDoctors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Appointment',AppointmentShcema);