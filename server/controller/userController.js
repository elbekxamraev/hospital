
const Appoinment=require('../models/Appointment');
const User =require('../models/User');
const AppError =require('../utils/AppError');
const catchAsync =require('../utils/catchAsync');
const multer =require('multer');
const sharp= require('sharp');



const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    cb(null, true);
  
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
 
  exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError("please provide valid image"));
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  
    next();
  });
exports.uploadArrayPhoto= upload.array('files[]', 3);
exports.uploadUserPhoto = upload.single('photo');
exports.updatedImagePath= catchAsync( async (req,res,next)=>{
    const upadatedUser= await User.findByIdAndUpdate(req.user.id,{image:req.file.filename }, {
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
  console.log('user', user);
  res.status(200).json({
    status: 'success',
    role: req.user.role,
    user 
});
});