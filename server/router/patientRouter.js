const router= require('express').Router();
const patientController= require('../controller/patientController');
const authentication= require('../controller/authentication');
router.route('/newPatient').post(authentication.signup, patientController.createNewPatient);

//router.route('/sheduleAppointment').post(patientController.postNewAppointment);
router.route('/patientsProfile/updateMetrics').patch(patientController.updateMetrics);
router.route('/adminGetPatient').get(patientController.AdminGetPatientInfo);

module.exports=router;