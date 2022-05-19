const Appointment= require('../models/Appointment');
const catchAsync= require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const fs= require('fs');


exports.createAppointment= catchAsync(async(req,res,next)=>{
   
    const newAppointment= await Appointment.create({
            doctors: req.body.doctors,
            patients: req.body.patient,
            documents: req.body.documents,
            startDate: req.body.startDate,
            endDate: req.body.endDate
    });

    req.patient.appointments.push(newAppointment.id);
    await req.patient.save();
    await Promise.all(req.doctors.map((doctor)=>{
        doctor.appointments.push(newAppointment.id);
        doctor.save();
    }));
   res.status(201).json({
    status: 'success',
    message: "Appoinment was set up successfully",
    data: newAppointment
   });     
});

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
    req.body.startDate= new Date(req.body.startDate);
    req.body.endDate= new Date(req.body.endDate);
    if(!validateDates(req.body.startDate,req.body.endDate)){
        return next(new AppError('Date validation error',401));
    }
    const patient=(await User.findOne({_id: req.body.patient}).populate('appointments'));
    if(!intervalValidate(patient,req.body.startDate,req.body.endDate)){
        return next(new AppError('requested patient does not have time for this appointment',401));
    }
    req.doctors=[];
    for(const doctorId of req.body.doctors){
        const doctor= await User.findOne({_id: doctorId}).populate('appointments').populate('doctor');
        if(!doctor) return next('Requested doctor id was not found');
        if(doctor.vocationTime && inInterval(doctor.doctor.vocationTime.startDate,doctor.doctor.vocationTime.endDate, req.body.startDate,req.body.endDate))
        return next(`Doctor with id ${doctor.name} is on vocation`);
        let dayOfTheWeek= req.body.startDate.getDay();
        if(oneInInterval(doctor.doctor.workingHours[dayOfTheWeek].split('-')[0],doctor.doctor.workingHours[dayOfTheWeek].split('-')[1],dateToWorkingFormat(req.body.startDate))){
            dayOfTheWeek= req.body.endDate.getDay();
            if(!oneInInterval(doctor.doctor.workingHours[dayOfTheWeek].split('-')[0],doctor.doctor.workingHours[dayOfTheWeek].split('-')[1],dateToWorkingFormat(req.body.endDate))){
                return next(new AppError("End date is not matching with  the working hours week ",401))
            } 
        }else{
            return next(new AppError("Start date is not matching with  the working hours week ",401))
        }
        if(!intervalValidate(doctor,req.body.startDate,req.body.endDate)){
            const name= doctor.name;
            return next(new AppError(`doctor ${name} with this id: ${doctor.id} dont have available time`,401));
        }
        req.doctors.push(doctor);
    };
    req.patient=patient;
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
    console.log(req.files);
    const dir= `public/img/users/preAppointment/${req.user.id}`;
    
    console.log("dir", dir);
   /* if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    for( file of req.files){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        fs.writeFile(`${dir}/${file.originalname}_${Date.now()}.${ext}`, file.buffer, err => {
            if (err) {
              console.error(err);
            }
            console.log("writing done ");
          });
    
        }*/
   res.status(200).json(
       {
           stauts: 'success',
           message: "Appointment was taken successfuly"
       }
   )

});