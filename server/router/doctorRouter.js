const router= require('express').Router();
const doctorController= require('../controller/doctorController.js');
const authentication =require('../controller/authentication');
const appointmentController= require('../controller/appointmentController');



router.route('/profileInfo').get(authentication.protect, doctorController.getDoctor);

//router.route('/manageAppointment').patch(doctorController.manageAppointment);
//router.route('/showAvailabletime').get(doctorController.showAvailableTime);
router.route('/createDoctorUser').post(authentication.protect, authentication.onlyAdmin,(req,res,next)=>{req.role='doctor'; next();},authentication.signup,doctorController.createDoctor );
router.route('/AdminChanxgeDoctorWorkH').patch(doctorController.AdminchangeWorkingH);
router.use(authentication.protect,authentication.authroizeAppointment);
router.route('/createAppointment').post(appointmentController.setUpNewAppointment,appointmentController.createAppointment);
router.route('/deleteAppointment').patch( appointmentController.deleteAppointment);
module.exports=router;