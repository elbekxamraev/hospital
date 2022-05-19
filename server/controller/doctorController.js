
const Doctor= require('../models/Doctor');
const catchAsync = require('../utils/catchAsync');




exports.getDoctor=catchAsync(async(req,res,next)=>{
    if(req.user.doctor == undefined){
        return next(new Error('doctor is not at this account'));
    }
    console.log("doctor" ,req.user.doctor.toString());
    const doctor= await Doctor.findOne({_id: req.user.doctor.toString()}).populate('appointments');
    if(!doctor){
            return next(new Error('no doctor was found with this authentication'));
    }
    res.status(200).json({
        status: 'success',
        data: doctor
    });
});
exports.createDoctor=catchAsync(async(req,res,next)=>{
    req.newUser.doctor= await Doctor.create({
        proffesion: req.body.proffesion,
        degree: req.body.degree,
        workingHours: req.body.workingHours,
        user: req.newUser.id

    });
        await req.newUser.save();
    res.status(200).json({
        status:'success',
        data: req.newUser
    }); 
});
exports.AdminchangeWorkingH= catchAsync(async (req,res,next)=>{
    const workingHours= req.body.workingsHours;
    const currectFormHour=[];
    const errorOcured= false;
    for(var i=0; i<=7; i++){
        if(workingHours[i]===undefined){
            errorOcured=true;
           break ;
        }
        if(workingHours[i].startHour===workingHours[i].endHour===0){
            currectFormHour.push({
                day: i,
                startHour: 0,
                endHour: 0 
            });
            continue;
        }
        if((0<= workingHours[i].startHour<=1440) && (0<=workingHours[i].endHour<=1440) && workingHours[i].endHour>workingHours[i].startHour){
            currectFormHour.push({
                day: i,
                startHour: workingHours[i].startHour,
                endHour: workingHours[i].endHour
            });
        }else{
            errorOcured=true;
            break;
        };
    }
    if(errorOcured){
        return next(new Error('Schedule was entered incorectly'));
    }
    const UpdateUser= await Doctor.findByIdAndUpdate({_id: req.body.id},{ workingHours: currectFormHour});
    res.status(201).json({
        status: "success",
        doctor: UpdateUser
    });
});
