const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const cookieParser= require('cookie-parser');
const next = require('next');
const patientRouter= require('./server/router/patientRouter');
const doctorRouter=require('./server/router/doctorRouter');
const authentication= require('./server/controller/authentication');
const errorController=require('./server/controller/errorController');
const userRouter= require('./server/router/userRouter');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
require('dotenv').config({path: __dirname+'/server/config.env'});
const express= require('express');

const server=express();
const DB= process.env.DATABASE.replace(
    '<password>', process.env.DATABASE_PASSWORD
)
mongoose.connect(DB, { useNewUrlParser: true,}).then(()=>{
    console.log("DB connection was successful");
});


const PORT= process.env.PORT || 3000;
const handle = app.getRequestHandler()

app.prepare().then(() => {
 
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended:true}));
server.use(cookieParser());
server.route('/api/v1/login').post(authentication.login);
server.use('/api/v1/patient', patientRouter);
server.use('/api/v1/doctor', doctorRouter);
server.use('/api/v1/user', userRouter);

server.use(errorController);


  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(PORT)
  })
})
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    app.close(() => {
      process.exit(1);
    });
  });