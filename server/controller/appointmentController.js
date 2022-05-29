const Appointment= require('../models/Appointment');
const PreAppointment =require('../models/PreAppointment');
const catchAsync= require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const fs= require('fs');;
const availableTimes= ["480-660","660-840","840-1020","1020-1200","anytime","other"];   
const repeatingTimes= ["once a day","many times a day","static ache","some times","other"];
const uploadFiles=(files,dir,id)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    let result=[];
    for( const file of files){
           
        const ext = file.mimetype.split('/')[1];
        const writeFileName= `${dir}/${file.originalname}.${ext}`;
        fs.writeFileSync(writeFileName, file.buffer);
          result.push(writeFileName)
} 
 return result;
}
exports.createAppointment= catchAsync(async(req,res,next)=>{
    const {doctors, patients,startDate,endDate }= req.body.appointmentData;
    const newAppointment= await Appointment.create({
            doctors,
            patients,
            startDate,
            endDate,
    });

    
    await Promise.all(req.patients.map((patient)=>{
        patient.appointments.push(newAppointment.id);
        patient.save();
    }));
    await Promise.all(req.doctors.map((doctor)=>{
        doctor.appointments.push(newAppointment.id);
        doctor.save();
    }));
    const dir= `public/files/appointments/${newAppointment._id}`;
    console.log(req.files);
    newAppointment.documents=uploadFiles(req.files,dir);
     await newAppointment.save();
   res.status(201).json({
    status: 'success',
    message: "Appoinment was set up successfully",
    data: newAppointment
   });     
});
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
    console.log(obj);
    if( obj.feelings.trim().split(/\s+/).length<3) return false;
    console.log(1);
    if(!(obj.startDate!=='' &&(new Date(obj.startDate))<=(Date.now()))) return false; 
    console.log(2);
    if(!obj.repeatingTimes || !checkArrayIfHasString(obj.repeatingTimes,repeatingTimes)) return false;
    console.log(3);
    if(!obj.availableTime || !checkArrayIfHasString(obj.availableTime,availableTimes)) return false;
    console.log(4);
    if(obj.timeComments.trim().split(/\s+/).length>30) return false;
    console.log(5);
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
       if(inInterval(appointment.startDate,appointment.endDate,startDate,endDate)){
           return false;
       }
    }
    return true;
   
}
const dateToWorkingFormat =(date)=>{
    return date.getHours()*60+date.getMinutes();
}
exports.setUpNewAppointment=catchAsync(async(req,res,next)=>{
    req.body.appointmentData=JSON.parse(req.body.appointmentData);
    console.log('appointmentData',req.body.appointmentData);
    req.body.appointmentData.startDate= new Date(req.body.appointmentData.startDate);
    req.body.appointmentData.endDate= new Date(req.body.appointmentData.endDate);
    if(!validateDates(req.body.appointmentData.startDate,req.body.appointmentData.endDate)){
    
        return next(new AppError('Date validation error',403));
    }
    const patients=(await User.find({_id: req.body.appointmentData.patient}).populate('appointments'));
    patients.map((patient)=>{
        if(!intervalValidate(patient,req.body.appointmentData.startDate,req.body.appointmentData.endDate)){
        return next(new AppError(`${patient.name} patient does not have time for this appointment`,401));
    }
    })
    
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
  const appointment= await Appointment.findOne({_id: req.body.appointment});
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
   res.status(201).json({
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
exports.getPreAppoinment= catchAsync(async (req,res,next)=>{
   
    const preAppointment=  await PreAppointment.findOne({_id:req.params.preAppointmentId}).populate({
        path: 'patient',
        select: 'name'
    })
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