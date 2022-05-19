const mongoose =require('mongoose');
const bcrypt= require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3,'Name should be more than 3 characters']
        
    },
    dateOfB: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
     },
     phoneNumber: {
        type: Number,
        validatate: {
            validator: (number)=>{
                return number.length===10;
            }
        },
        message: "Phone number should be 10 digits"
    },
    role: {
        type : String,
        default: 'patient',
        enum: ['admin', 'patient', 'doctor', 'dispatcher']
    }    
    ,
    image: String,
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: [function(email) {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email);
        },'Please provide with valid email']
    },
    doctor: {
        type : mongoose.Schema.ObjectId,
        ref: 'Doctor'
    },
    patient:{
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
    },
    active: {
    type: Boolean,
    default: true
},
appointments :[{
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment'
}
]
});
UserSchema.pre('find',async function(next){
    this.find({active: {$ne: 'false'}});
    next();
})
UserSchema.pre('save', async function(next){
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
});
UserSchema.methods.comparePassword= async function(conPass){
             return  await bcrypt.compare(conPass, this.password);
};
module.exports= mongoose.model("User",UserSchema);