const router= require('express').Router();
const patientController= require('../controller/patientController');
const authentication= require('../controller/authentication');

router.route('/newPatient').post(authentication.signup, patientController.createNewPatient);
router.route('/patientsProfile/updateMetrics').patch(patientController.updateMetrics);
router.route('/adminGetPatient').get(patientController.AdminGetPatientInfo);
router.route('/searchPatientsByName/:query').get(authentication.protect,patientController.searchPatientsByName);
router.route('/getPatient/:patientId').get(authentication.protect, patientController.getPatientInfo);
module.exports=router;