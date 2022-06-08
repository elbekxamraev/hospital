
import React, {useEffect, useState} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { useRouter } from 'next/router';
import {useAuth} from '../../components/context/AuthContext.js';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();

const validateEmail =(mail)=>{
return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

export default function SignUp() {
  const router= useRouter();
  const {login,isAuthenticated} = useAuth();
  const [errorMsg, setErrorMsg]= useState('');
  const [isDone,setIsDone]=useState(false);
  const[sendData, setSendData]=useState({name: '', email: '',phoneNumber: '',dateOfB:''});
const [isFirstStep, setIsFirstStep]=useState(true);
const backHandler  =()=>{
  setIsFirstStep(true);
}
useEffect(()=>{
  if(isAuthenticated && !isDone){
    router.push('/dashboard');
  }
},[router,isAuthenticated,isDone]);
const submitHandler= (event)=>{
     event.preventDefault();
     console.log('in submit');
     let data=   [...event.currentTarget.elements]
            .filter((ele) => ele.type !== "submit")
            .map((ele) => {
       
                return  ele.value;
            }); 
            let errorMessage='';
        if(isFirstStep) {   if( !(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/.test(data[0]))){
              errorMessage+='Plase enter valid name ';
          }
          if(!validateEmail(data[1])) errorMessage+='please provide with valid email';
          
          if( !(data[2]===data[3] && data[2]!="")) errorMessage+= 'password confirm is not matching with password';
          if(data[2].length<8) errorMessage+='please provide with valid password';
          if( !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data[4].replace(/\D/g, '').slice(1))) errorMessage+= 'please provide with valid US phone number';
          if( (!data[5] || (new Date(data[5]))>(Date.now()))) errorMessage+='please provide with valid date of birth'; 
          if(errorMessage!==''){
             
              setErrorMsg(errorMessage);
              return;
          } 
          data[4]= data[4].replace(/\D/g, '');
          setSendData({
            name: data[0],
            email: data[1],
            password: data[2],
            phoneNumber: data[4],
            dateOfB: data[5]
        });
          setErrorMsg('');
          setIsFirstStep(false);
          return;
        }else{
        
          const height = parseFloat(data[0]);
          const weight= parseInt(data[1]);
          console.log(height,weight,data[0],data[1]);
          console.log( parseInt(data[1]));
          if(isNaN(height) || ( 0>parseInt(data[0])&& parseInt(data[0])>9) ) errorMessage+= 'set valid height in format: feet.inches'
          if(isNaN(weight) || (0> weight&& weight>1500)) errorMessage+='please provide with valid weight';
          if(data[2].length<3) errorMessage+= 'please provide with right insurance company or input none if not';
          if(errorMessage!==''){
            setErrorMsg(errorMessage);
            return;
          }else{
            fetch(`${publicRuntimeConfig.sah}/api/v1/patient/newPatient`,{
              method: 'POST',
              headers:{
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                ...sendData,
                height,
                weight,
                insurance: data[2]
              })
            }).then((res)=>{
                 res.json().then(dat=>{
                if(res.status===200){
                  setIsDone(true);
                  setTimeout(()=>{
                    login(dat.user);
                    router.push('/dashboard');
                  },2000);
                }else{
                  setErrorMsg(dat.message);
                  return;
                }
                 })
          
          }).catch((err)=>{
            setErrorMsg('Something went very wrong');
          });
          } 
        }
        
        
       
  }
  if(isDone){
    return(<React.Fragment><h1>Congratulation</h1><div className='white-box' style={{border: '1px solid green'}}><h1>Submited successfully</h1></div></React.Fragment>)
}
  return (
    <div className={mainStyles.container}>
      <div className={mainStyles.main}>
        <div className={styles.sign_up_content}>
       
          <h1 className={styles.welcome_header}> Welcome</h1>
          <p className={styles.comments}>Lets resiter you </p>
       {isFirstStep ?  <form className={styles.register} onSubmit={submitHandler}>
        <label >Full Name</label>
        <input  type="text" name="name" defaultValue={sendData.name} placeholder="Enter your name" /> 
        <label> Email</label>
        <input  type="text" name="email"  defaultValue={sendData.email} placeholder="Enter your email" /> 
        <label> Password</label>
        <input  type="password" name="password"  defaultValue={sendData.password}  placeholder="Enter your password" /> 
        <label >Conifirm Password</label>
        <input  type="password" name="passwordConfirm" placeholder="Confirm your password" /> 
        <label> Phone number</label>
        <PhoneInput containerStyle={{ width: "100%" }} value={sendData.phoneNumber} country={'us'} /> 
        <label >Date of birth</label>  
        <input  type="date" name="date"  defaultValue={sendData.dateOfB!==''? new Date(sendData.dateOfB): Date.now() } /> 
        
        <p className='danger'>{errorMsg}</p>
       <div className='buttonSection'> <button className='blueButton'>Continue </button></div> 
        </form> : 
        <form className={styles.register} onSubmit={submitHandler}>
         <label >Height</label>
         <div className={styles.inputWrapper}>  
            <input  className={styles.form_input} type="text" /> 
            <p className={styles.additionalInputInfo}>feet</p>
         </div>
      
        <label>Weight</label>
        <div className={styles.inputWrapper}>  
            <input  className={styles.form_input} type="text" /> 
            <p className={styles.additionalInputInfo}>pounds</p>
         </div>
        <label> Insurance</label>
        <div className={styles.inputWrapper}>
          <input  className={styles.form_input} type="text"  placeholder='put none if you do not have incurance'/> 
           </div>
           <p className='danger'>{errorMsg}</p>
           <div className='buttonSection'><button type='button' onClick={backHandler} className={styles.backBttn}>Back</button> <button type='submit' className='blueButton'>Continue </button></div> 
            </form>  
        }
        </div>
        </div>
    </div>
  )

  }
