const mongoose= require('mongoose');


const VerifyCodeSchema= mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    verifyNumber: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('VerifyCode', VerifyCodeSchema);