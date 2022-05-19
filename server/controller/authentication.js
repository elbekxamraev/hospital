const jwt= require('jsonwebtoken');
const catchAsync= require('../utils/catchAsync');
const User= require('../models/User');
const Doctor= require('../models/Doctor');
const AppError = require('../utils/AppError');
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
        data: {
          user 
        }
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
        }else if(req.cookies && req.cookies.jwt){
            token=req.cookies.jwt;
        }
    if(!token){
        return next( new AppError('You are not logged in! please log in to continue',403))
    }

    const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
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
exports.onlyAdmin=catchAsync(async(req,res,next)=>{
    if(!(req.user.role==='admin')){
        return next( new AppError("No admin was found with this token",403));
    }
    next();
});

module.exports.createSendToken=createSendToken;



exports.authroizeAppointment=catchAsync(async(req,res,next)=>{
    if(req.user.role==='patient'){
        return next(new AppError('Patients can not create/delete appointments',403));
    }
    next();
});