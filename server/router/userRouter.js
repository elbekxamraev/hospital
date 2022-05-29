const router= require('express').Router();
const authentication= require('../controller/authentication');
const userController=require('../controller/userController');
const appointmentController=require('../controller/appointmentController');
router.route('/login').post(authentication.login);
router.route('/logout').get(authentication.logout);
router.route('/getPatientsDashboard').get(authentication.protect,userController.getDashboard);
router.route('/userInfo').get(authentication.protect,userController.userInfo);
router.route('/updateUserPhoto').post(authentication.protect,userController.uploadUserPhoto, userController.resizeUserPhoto,userController.updatedImagePath);
router.route('/requestAppointment').post(authentication.protect,userController.uploadArrayPhoto, appointmentController.acceptFiles);
router.route('/getAllPreAppointments').get(authentication.protect,authentication.restrictTo('dispatcher'), appointmentController.getAllPreAppointments);
router.route('/getPreAppointmentInfo/:preAppointmentId').get(authentication.protect,appointmentController.getPreAppoinment);
module.exports=router;