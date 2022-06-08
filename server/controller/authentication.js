const jwt= require('jsonwebtoken');
const catchAsync= require('../utils/catchAsync');
const User= require('../models/User');
const VerifyCode= require('../models/VerifyCode');
const AppError = require('../utils/AppError');
const bcrypt =require('bcrypt');
const { promisify } = require('util');
const createSendToken= (user,statusCode,res)=>{
    const token= jwt.sign({id: user.id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });;
    const cookieOptions={
        expires: new Date(
            Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000
        ),
        httpOnly: true
    };
    res.cookie('jwt', token.toString(),cookieOptions);
    user.password=undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        user 
    });
};
exports.signup=catchAsync(async(req,res,next)=>{
    const newModel={
        name: req.body.name,
        dateOfB: req.body.dateOfB,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        patient: req.body.patient
    }
    if(req.role==='doctor'){
        newModel.role= req.role;
    }
    const NewUser =await User.create(newModel);



    // Email will be sent 


    req.newUser=NewUser;
    next();
});
exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
        }else if(req.cookies && req.cookies.jwt && req.cookies.jwt!=='loggedout'){
            token=req.cookies.jwt;
        }
    if(!token){
        return next( new AppError('You are not logged in! please log in to continue',403))
    }


  
    let decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const currentUser= await User.findOne({_id:decoded.id});

    if(!currentUser){
        return next(
        new AppError('the user belonging to this token does no longer exist',403)
        );
    }
    
    req.user=currentUser;
    req.user.password=undefined;
    next();
});
exports.login=catchAsync(async(req,res,next)=>{
    if(!req.body.email || !req.body.password ){
        return next(new AppError('email and password needed for authentication',403));
    }
    const user= await User.findOne({email: req.body.email});
    if(!user || !(await user.comparePassword(req.body.password))){
        return next(new AppError('email or password is incorrect',403));
    }

    createSendToken(user,200,res);
});

exports.logout=(req,res)=>{
        res.cookie('jwt', 'loggedout', {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly: true
        });
        res.status(200).json({ status: 'success' });
}
exports.restrictTo = (...roles) => {
    
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
 
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
      next();
    }}

module.exports.createSendToken=createSendToken;



exports.authroizeAppointment=catchAsync(async(req,res,next)=>{
    if(req.user.role==='patient'){
        return next(new AppError('Patients can not create/delete appointments',403));
    }
    next();
});
exports.verifyCode= catchAsync(async(req,res,next)=>{
    const verfiyModel= await VerifyCode.findOne({verifyNumber: req.body.verify_code});
    if(!verfiyModel)return next(new AppError('not valid verification code',400));
    console.log(verfiyModel);
        const token= jwt.sign({id: verfiyModel._id},process.env.JWT_SECRET, {
        expiresIn:  10*60*1000
    });;
    const cookieOptions={
        expires: new Date(
            Date.now()+ 10*60*1000
        ),
        httpOnly: true
    };
    res.cookie('verifyCode', token.toString(),cookieOptions);
    res.status(200).json({
        status: 'success'
    })
});
exports.protectVerifyCode=catchAsync(async(req,res,next)=>{
    let token;
    if(req.cookies && req.cookies.verifyCode){
        token=req.cookies.verifyCode;
    }
    if(!token){
        return next( new AppError('You are not logged in! please log in to continue',403))
    }
    let decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const currentVerify= await VerifyCode.findOneAndDelete({_id:decoded.id});
    console.log(currentVerify);
    if(!currentVerify){
        return next(
        new AppError('the verify code belonging to this token does no longer exist',403)
        );
    }

    req.email= currentVerify.email;
    next();
});
exports.setUpNewPassword= catchAsync(async (req,res,next)=>{
    if(req.body.password<7) return next(new AppError('Password too short',400));
    const password= await bcrypt.hash(req.body.password,12);
    const updatedUser= await   User.findOneAndUpdate({email: req.email},{password});
    if(!updatedUser) return next(new AppError('User not found',403));
      updatedUser.password=undefined;
    createSendToken(updatedUser,200,res);
  });