
const Appoinment=require('../models/Appointment');
const Email= require('../utils/email');
const User =require('../models/User');
const VerifyCode=require('../models/VerifyCode');
const AppError =require('../utils/AppError');
const catchAsync =require('../utils/catchAsync');
const multer =require('multer');
const sharp= require('sharp');
const fs=require('fs');
const validateEmail =(mail)=>{
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
  }
  

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    cb(null, true);
  
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
 
  exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError("please provide valid image",400));
    req.file.filename = `user-photo-${Date.now()}.jpeg`;
    const dir = `public/img/users/${req.user.id}`;
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${dir}/${req.file.filename}`);
  
    next();
  });

exports.uploadArrayPhoto= upload.array('files[]', 3);
exports.uploadUserPhoto = upload.single('photo');
exports.updatedImagePath= catchAsync( async (req,res,next)=>{
    const upadatedUser= await User.findByIdAndUpdate(req.user.id,{image:`/${req.user.id}/${req.file.filename}` }, {
        new: true,
        runValidators: true
      });
      res.status(200).json({
        status: 'success',
        upadatedUser
      });
});
exports.getDashboard=catchAsync(async (req,res,next)=>{
    const appointments= await Appoinment.find({_id:  { $in: req.user.appointments}})
    .populate({
        path:'doctors',
        select:'name'
   })
   . populate({
    path:'patients',
    select:'name'
});
    res.status(200).json({
        status: 'success',
        role: req.user.role,
        user: await req.user.populate(req.user.role),
        appointments 
    });
});
exports.userInfo=catchAsync(async(req,res,next)=>{
  let user;
  if(req.user.role!=='dispatcher' && req.user.role!=='admin' ){
   user= await req.user.populate(req.user.role);
  }
  else{
    user=req.user;
  }
  res.status(200).json({
    status: 'success',
    role: req.user.role,
    user 
});
});
exports.changeUserInfo=catchAsync(async(req,res,next)=>{
  console.log(req.body);
  if(!(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/.test(req.body.name))){
    return next(new AppError('Please enter your full name',400));

 }
 if(!validateEmail(req.body.email)){
  return next(new AppError('Please enter valid email address',400));

 }
 if(!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(req.body.phoneNumber.replace(/\D/g, '').slice(1))){
     return next(new AppError('Please provide valid us phone number', 400));
 }
 req.body.phoneNumber= req.body.phoneNumber.replace(/\D+/g, '');
 console.log(req.body.phoneNumber);
  await User.findByIdAndUpdate(req.user._id,{email:req.body.email, phoneNumber: req.body.phoneNumber, name: req.body.name } )
 
  
  res.status(200).json({
    status: 'success',
    message: 'User is updated successfuly'
  })
});

exports.sendRecoverEmail=catchAsync(async (req,res,next)=>{
 const user= await User.findOne({email: req.body.email});
  if(!user) return next(new AppError('User with this email is not found',403));

    const email = new Email(user);
    const verify_code = Math.round(Math.random() * (10000000 - 1000000) + 1000000);
   const verifyModel=  await VerifyCode.create({
      email: user.email,
      verifyNumber: verify_code
    });
   await  email.send(`Do not share this code with any one. Here is your verification code ${verifyModel.verifyNumber}`,'Verification code');
   res.status(200).json({
     status: 'success',
     message: 'email was sent'
   });
});
