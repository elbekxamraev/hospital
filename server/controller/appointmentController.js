const Appointment= require('../models/Appointment');
const PreAppointment =require('../models/PreAppointment');
const Patient =require('../models/Patient');
const catchAsync= require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const fs= require('fs');
const Doctor = require('../models/Doctor');
const availableTimes= ["480-660","660-840","840-1020","1020-1200","anytime","other"];   
const repeatingTimes= ["once a day","many times a day","static ache","some times","other"];
const uploadFiles=(files,dir)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let result=[];
    for( const file of files){
           
        const ext = file.mimetype.split('/')[1];
        const writeFileName= `${dir}/${file.originalname}.${ext}`;
        fs.writeFileSync(writeFileName, file.buffer);
        if(dir.split('/')[0]==='public'){
            const subPostion =dir.indexOf('/');
            dir= dir.substring(subPostion+1);
         }  
        result.push(`/${dir}/${file.originalname}.${ext}`);
} 
 return result;
}
exports.createAppointment= catchAsync(async(req,res,next)=>{
    const {doctors, patients,startDate,endDate,preAppointmentIds }= req.body.appointmentData;
    const newAppointment= await Appointment.create({
            doctors,
            patients,
            startDate,
            endDate,
    });

   for(const preAppointmentId of preAppointmentIds){
       await PreAppointment.findOneAndDelete({_id: preAppointmentId});
   }
    await Promise.all(req.patients.map((patient)=>{
        patient.appointments.push(newAppointment.id);
       
       return  patient.save();
    }));
    await Promise.all(req.doctors.map((doctor)=>{
        doctor.appointments.push(newAppointment.id);
       return doctor.save();
    }));
    for(const doctor of doctors){
        const con_doctor= await Doctor.findOne({user: doctor});
        con_doctor.pendingAppointments++;
        await con_doctor.save();
   }
    const dir= `public/files/appointments/${newAppointment._id}`;
    
    newAppointment.documents=uploadFiles(req.files,dir);
     await newAppointment.save();
   res.status(201).json({
    status: 'success',
    message: "Appoinment was set up successfully",
    data: newAppointment
   });     
});
exports.cancelAppointment= catchAsync(async (req,res,next)=>{
    const appointment= await Appointment.findOne({'_id': req.params.appointmentId});
    if(!appointment){
       return next(new AppError('Appointment was not found',404));
    }
    if(!req.user.appointments.includes(appointment.id)){
        return next(new AppError('Only members of appointment can change appointment',403));
    };
    for(const doctor of appointment.doctors){
        const con_doctor= await Doctor.findOne({user: doctor});
       if(con_doctor.pendingAppointments>0) con_doctor.pendingAppointments--;
        con_doctor.cancelledAppointments++;
        await con_doctor.save();
   }
    appointment.status='cancelled';
     await appointment.save();
    await removeAppointments(appointment.id,appointment.doctors);
    await removeAppointments(appointment.id, appointment.patients);
   
    res.status(200).json({
        status: 'success',
        message: 'appointment was successfuly canceled'
    })
})
const checkArrayIfHasString=(str, arr)=>{
    for(const s of arr){
        if(s===str){
        
            return true;
        }
    }
    cons
    return false;
}
const datesAreOnSameDay = (first, second) =>{
    return first.getFullYear() === second.getFullYear() &&
     first.getMonth() === second.getMonth() &&
     first.getDate() === second.getDate();
 }
 const filterObject=(obj, arr)=>{
     let result= {};
    for(const element of arr){
       result[element]=obj[element];
    }
    return result;
 }
const validatePreAppointment=(obj)=>{
   
    if( obj.feelings.trim().split(/\s+/).length<3) return false;
    
    if(!(obj.startDate!=='' &&(new Date(obj.startDate))<=(Date.now()))) return false; 
  
    if(!obj.repeatingTimes || !checkArrayIfHasString(obj.repeatingTimes,repeatingTimes)) return false;
   
    if(!obj.availableTime || !checkArrayIfHasString(obj.availableTime,availableTimes)) return false;
  
    if(obj.timeComments.trim().split(/\s+/).length>30) return false;
  
    if(!(obj.availableDate!=='' && (datesAreOnSameDay(new Date(obj.availableDate),new Date(Date.now())) ||(new Date(obj.availableDate))>=(Date.now()))) ) return false;
    return true;
}
const validateDates=(startDate,endDate)=>{
   return ((endDate-startDate)>0 && (endDate-startDate)/(1000*60*60)<6);
}
const inInterval= (startDate1,endDate1 ,startDate2,endDate2 )=>{
   return (startDate1-startDate2<=0 && endDate1-startDate2>=0 ) || (startDate1-endDate2<=0 && endDate1-endDate2>=0);    
}
const oneInInterval=(startDate,endDate, timePoint)=>{
    return (startDate-timePoint<=0 && endDate-timePoint>=0 )
}
const intervalValidate= ( patient, startDate,endDate)=>{
    if(!patient){
        return false;
    }
    for(const appointment of patient.appointments){
        if(appointment.status==='pending'){
            if(inInterval(appointment.startDate,appointment.endDate,startDate,endDate)){
           return false;
         }
       }
        }
   
    
    return true;
   
}
const dateToWorkingFormat =(date)=>{
    return date.getHours()*60+date.getMinutes();
}
const includesId= (arr, id)=>{
   
    for(const con_obj of arr){
        
        if(con_obj._id.toString()===id){
            return true;
        }
    }
    return false;
}
exports.setUpNewAppointment=catchAsync(async(req,res,next)=>{
    req.body.appointmentData=JSON.parse(req.body.appointmentData);
  
    req.body.appointmentData.startDate= new Date(req.body.appointmentData.startDate);
    req.body.appointmentData.endDate= new Date(req.body.appointmentData.endDate);
    if(!validateDates(req.body.appointmentData.startDate,req.body.appointmentData.endDate)){
        return next(new AppError('Date validation error',403));
    }
    let patients=[];
    for ( const patientId of req.body.appointmentData.patients){
        const patient= await User.findOne({_id: patientId}).populate('appointments').populate('patient');
        if(!intervalValidate(patient,req.body.appointmentData.startDate,req.body.appointmentData.endDate)){
        return next(new AppError(`${patient.name} patient does not have time for this appointment`,401));
        }
        patients.push(patient);
    }
    
    req.doctors=[];
    for(const doctorId of req.body.appointmentData.doctors){
        const doctor= await User.findOne({_id: doctorId}).populate('appointments').populate('doctor');
        if(!doctor) return next('Requested doctor id was not found');
        if(doctor.vocationTime && inInterval(doctor.doctor.vocationTime.startDate,doctor.doctor.vocationTime.endDate, req.body.appointmentData.startDate,req.body.appointmentData.endDate))
        return next(`Doctor with id ${doctor.name} is on vocation`);
        let dayOfTheWeek= req.body.appointmentData.startDate.getDay();
        if(oneInInterval(doctor.doctor.workingHours[dayOfTheWeek].split('-')[0],doctor.doctor.workingHours[dayOfTheWeek].split('-')[1],dateToWorkingFormat(req.body.appointmentData.startDate))){
            dayOfTheWeek= req.body.appointmentData.endDate.getDay();
            if(!oneInInterval(doctor.doctor.workingHours[dayOfTheWeek].split('-')[0],doctor.doctor.workingHours[dayOfTheWeek].split('-')[1],dateToWorkingFormat(req.body.appointmentData.endDate))){
                return next(new AppError("End date is not matching with  the working hours week ",401))
            } 
        }else{
            return next(new AppError("Start date is not matching with  the working hours week ",401))
        }
        if(!intervalValidate(doctor,req.body.appointmentData.startDate,req.body.appointmentData.endDate)){
            const name= doctor.name;
            return next(new AppError(`doctor ${name} with this id: ${doctor.id} dont have available time`,401));
        }
        req.doctors.push(doctor);
    };
    req.patients=patients;
    next();
});
const removeAppointments=async (app_id, id_arr)=>{
    for(const conId of id_arr){
        const condidate= await User.findOne({_id: conId});
        if(!condidate) return conId;
        condidate.appointments= condidate.appointments.filter((con_appointment)=>{
            return con_appointment.toString()!==app_id;
        });
        await condidate.save();
    }
}
exports.deleteAppointment=catchAsync(async (req,res,next)=>{
    if(!req.params.appointmentId){
        return next(new AppError('giving appointment id is invalid',404));
    }
  const appointment= await Appointment.findOne({'_id': req.params.appointmentId});
    if(!appointment)return next(new AppError('appointment was not found',404));

   let errorId= await removeAppointments(appointment.id, appointment.doctors);
    if(errorId){
        return next(new AppError(`Doctor with ${errorId} was not found`,404)); 
    }
    errorId=await removeAppointments(appointment.id, appointment.patients);
    if(errorId){
        return next(new AppError(`Patient with ${errorId} was not found`,404)); 
    }
   const deletedAppointment= await Appointment.findByIdAndDelete(appointment.id);
   res.status(200).json({
       status: 'success',
       data: deletedAppointment
   })
});
exports.acceptFiles = catchAsync(async (req,res,next)=>{
 
    const dir= `public/img/users/preAppointment/${req.user.id}`;
    const filteredObject= filterObject(JSON.parse( req.body.preAppointmentInfo),['availableDate','availableTime','timeComments','startDate','repeatingTimes','feelings']);
    let newPreAppointment;
    if(validatePreAppointment(filteredObject)){
      
    newPreAppointment=await PreAppointment.create({...filteredObject,patient: req.user.id });
      const images= uploadFiles(req.files,dir);
     
          newPreAppointment=  await PreAppointment.findByIdAndUpdate(newPreAppointment.id, {images});
 
    }
    else{
        return next(new AppError('Recieved information is invalid',403));
    }
    
  
   res.status(200).json(
       {
           stauts: 'success',
           message: "Appointment was taken successfuly",
           data: newPreAppointment
       }    
   )

});
exports.getAppointment=catchAsync (async(req,res,next)=>{
 
    const appointment =await Appointment.findOne({'_id': req.params.appointmentId}).populate({
        path: 'doctors',
        select: 'name'
    }).populate({
        path: 'patients',
        select: 'name'
    });
    if(req.user.role!=='dispatcher' && req.user.role!=='admin'){
    if(!includesId(appointment.doctors, req.user.id) && !includesId(appointment.patients,req.user.id)){
        return next(new AppError('logged in user does not have authentication to view this appointment ',403));
    }}

    res.status(200).json({
        status: 'success',
        appointment,
        role: req.user.role
    })
});
exports.getAllPreAppointments=catchAsync(async (req,res,next)=>{
 const preAppointments=  await PreAppointment.find().populate({
        path:'patient',
        select:'name'
   });

   res.status(200).json({
    status: 'success',
    preAppointments
   });
});
exports.getPreAppoinmentId = catchAsync(async (req,res,next)=>{
    if(req.params.preAppointmentId.length!==24){
        return next(new AppError('invalid pre-appointment id',404));
    }
    const preAppointment=  await PreAppointment.findOne({_id:req.params.preAppointmentId});
    
    if(!preAppointment){
        return next(new AppError('pre-appointment not found',404));
    }
    res.status(200).json({
        status: 'success',
        message: 'pre-appointment exists'
    })
    
});
exports.getPreAppoinment= catchAsync(async (req,res,next)=>{
   
    const preAppointment=  await PreAppointment.findOne({_id:req.params.preAppointmentId}).populate({
        path: 'patient',
        select: 'name'
    }).populate({
        path: 'doctor',
        select: 'name'
    });
    if(!preAppointment){
       return  next(new AppError('pre-appointment was not found',404));
    }
    if(preAppointment.patient===req.user.id || req.user.role=='dispatcher'){
    res.status(200).json({
        preAppointment,
        user: req.user
    });
    }
    else{
        return next(new AppError('not authorized',403));
    }
})
exports.getAllCancelledAppointments=catchAsync(async(req,res,next)=>{
    const appointments= await Appointment.find({'status': 'cancelled'}).populate({
        path:'patients',
        select:'name'
   }).populate({
       path: 'doctors',
       select: 'name'
   });

   res.status(200).json({
       status: 'success',
       appointments
   })
});
exports.closeAppointment= catchAsync(async(req,res,next)=>{
    if(!req.params.appointmentId){
        return next(new AppError('giving appointment id is invalid',404));
    }
    const dir= `public/files/appointments/${req.params.appointmentId}`;
  const appointment= await Appointment.findOne({'_id': req.params.appointmentId});
    if(!appointment)return next(new AppError('appointment was not found',404));
    if(appointment.status==='done') return next(new AppError('Appointment was already closed',403));
       const closingAppointmentDocuments= uploadFiles(req.files,dir);
      appointment.documents.push (...closingAppointmentDocuments);
      appointment.status= 'done';
      await appointment.save();
       req.body.otherInfo=JSON.parse(req.body.otherInfo);
      for(const doctor of appointment.doctors){
           const con_doctor= await Doctor.findOne({user: doctor});
          if(con_doctor.pendingAppointments>0) con_doctor.pendingAppointments--;
           con_doctor.closedAppointments++;
           await con_doctor.save();
      }
      if(req.body.otherInfo.followUpOption==='true'){
      for(const patient of appointment.patients){
      await PreAppointment.create({
            patient,
             feelings: req.body.otherInfo.comments,
             followUpAppointmentId: appointment._id,
             doctor:  req.user._id
      });
        }
    }
     for(const patientId of appointment.patients){
        const patient =await Patient.findOne({user: patientId});
        const patient_dir= `public/files/users/${patientId}`;
       patient.medicalReports.push(...uploadFiles(req.files,patient_dir));
       await patient.save();
    }
      res.status(200).json({
        status: 'success',
        message: `${appointment._id} was successfuly closed`
      })
});