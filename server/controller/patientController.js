const Patient =require('../models/Patient');
const Appointment=require('../models/Appointment');
const catchAsync=require('../utils/catchAsync');
const authentication= require('./authentication');
const User = require('../models/User');

exports.createNewPatient=catchAsync(async(req,res,next)=>{
    req.newUser.patient=await Patient.create({
        appointment: [],
        height: req.body.height,
        weight: req.body.weight,
        previousDoctor: [],
        medicalReports: [],
        insurance: req.body.insurance,
        user:  req.newUser.id
    });
    await req.newUser.save();
    authentication.createSendToken(await req.newUser.populate('patient'), 200, res);
});
exports.searchPatientsByName=catchAsync(async (req,res,next)=>{
    if(req.params.query===''){
     return  res.status(200).json({
            status: 'success',
            patients: ''
        });
    }

    const potential_Patiens= await User.find({ "name": { "$regex": `${req.params.query}`, "$options": "i" }, role: 'patient'}).select('name patient');
    return res.status(200).json({
        status: 'success',
        patients: potential_Patiens
    });
}); 

exports.postNewAppointment= catchAsync(async(req,res,next)=>{

    const appointment= await Appointment.create(req.body);
    if(!appointment){
        next(new Error('error while creating appointment'));
    }
    res.status(201).json({
        status: 'success',
        appointment 
    });
}); 

exports.updateMetrics=catchAsync(async(req,res,next)=>{

    const updatedPatient= Patient.findOneAndUpdate({_id: req.user.id},{
        height: req.body.height,
        weight: req.body.weight,
        insurance: req.body.insurance
    } );
    if(!updatedPatient){
        return next(new Error("Updated failed"));
    }
    res.status(201).json({
        status:"success",
        updatedPatient
    });
});
exports.AdminGetPatientInfo=catchAsync((req,res,next)=>{
    const patient= Patient.findOne({_id: req.body.id});
    if(!patient){
        return next(new Error("No patient with this id was found"));
    }
    res.status(200).json({
        status: "success",
        patient
    });
}); 