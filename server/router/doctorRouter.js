const router= require('express').Router();
const doctorController= require('../controller/doctorController.js');
const authentication =require('../controller/authentication');
const appointmentController= require('../controller/appointmentController');
const userController =require('../controller/userController');


router.route('/profileInfo').get(authentication.protect, doctorController.getDoctor);
router.route('/getAllDoctors').get(authentication.protect,authentication.restrictTo('dispatcher','admin'),doctorController.getAllDoctors);
//router.route('/manageAppointment').patch(doctorController.manageAppointment);
//router.route('/showAvailabletime').get(doctorController.showAvailableTime);
router.route('/createDoctorUser').post(authentication.protect, authentication.restrictTo(['admin']),(req,res,next)=>{req.role='doctor'; next();},authentication.signup,doctorController.createDoctor );
router.route('/AdminChanxgeDoctorWorkH').patch(doctorController.AdminchangeWorkingH);
router.route('/createAppointment').post(authentication.protect,authentication.restrictTo('dispatcher','admin'),userController.uploadArrayPhoto, appointmentController.setUpNewAppointment,appointmentController.createAppointment);
router.route('/deleteAppointment').patch(authentication.protect,authentication.authroizeAppointment, appointmentController.deleteAppointment);
module.exports=router;