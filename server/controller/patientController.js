const Patient =require('../models/Patient');
const Appointment=require('../models/Appointment');
const catchAsync=require('../utils/catchAsync');
const authentication= require('./authentication');
const User = require('../models/User');
const AppError = require('../utils/AppError');

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
    authentication.createSendToken(req.newUser, 200, res);
});
exports.searchPatientsByName=catchAsync(async (req,res,next)=>{
    if(req.params.query===''){
     return  res.status(200).json({
            status: 'success',
            patients: []
        });
    }

    const potential_Patiens= await User.find({ "name": { "$regex": `${req.params.query}`, "$options": "i" }, role: 'patient'}).select('name patient');
    return res.status(200).json({
        status: 'success',
        patients: potential_Patiens
    });
}); 
exports.getPatientInfo=catchAsync(async (req,res,next)=>{

    if(!req.params.patientId || req.params.patientId.length!==24) return next(new AppError('bad request query',400)); 
    const patient= await User.findOne({_id: req.params.patientId}).populate('patient').select('-password -active -__v');
    if(!patient) return next(new AppError('Patient not found',404));
    const appointments= await Appointment.find({ _id: { $in: patient.appointments }}).populate({path: 'doctors', select: 'name'}).populate({path: 'patients',select: 'name'});
    patient.appointments=appointments;
    console.log(patient);
    return res.status(200).json({
        status: 'success',
        patient
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