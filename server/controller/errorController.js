const globalErrorHandler= (error,req,res,next)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }else{
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
module.exports=globalErrorHandler;