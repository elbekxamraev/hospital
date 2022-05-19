const router= require('express').Router();
const authentication= require('../controller/authentication');
const userController=require('../controller/userController');
const appointmentController=require('../controller/appointmentController');
router.route('/userInfo').get(authentication.protect,userController.getDashboard);
router.route('/updateUserPhoto').post(authentication.protect,userController.uploadUserPhoto, userController.resizeUserPhoto,userController.updatedImagePath);
router.route('/requestAppointment').post(authentication.protect,userController.uploadArrayPhoto, appointmentController.acceptFiles);
module.exports=router;