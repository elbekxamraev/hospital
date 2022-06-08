import Head from 'next/head'
import React, {useState} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import {useRouter} from 'next/router';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
const validateEmail =(mail)=>{
return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}
const convertTimeToString=(time_str1, time_str2)=>{
    if(time_str1.length!==5 && time_str1.split(':')[0].length!==2) return false;
    if(time_str2.length!==5 && time_str2.split(':')[0].length!==2) return false;
   const [hours1,minutes1] =time_str1.split(':');
   const [hours2,minutes2] =time_str2.split(':');
    return  `${parseInt(hours1)*60+parseInt(minutes1)}-${parseInt(hours2)*60+parseInt(minutes2)}`;
}
export default function DoctorSignUp() {
    let errorMessage='';
    const router= useRouter();
const [sendData, setSendData] =useState({name: '', email: '',phoneNumber: '',dateOfB:''});
const [errorMsg, setErrorMsg]= useState('');
const [isDone,setIsDone]=useState(false);
const [isFirstStep ,setIsFirstStep]=useState(true);
    const backHandler= ()=>{
        setIsFirstStep(true);
    }
const submitHandler= (event)=>{
     event.preventDefault();
     let data=   [...event.currentTarget.elements]
            .filter((ele) => ele.type !== "submit")
            .map((ele) => {
       
                return  ele.value;
            }); 
    if(isFirstStep){
        if( !(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/.test(data[0]))){
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
    }else{
        console.log(data);
        if(!data[14] || data[14]===''){
            setErrorMsg('Proffesion parameter needed')
            return;
        }
        if(!data[15] || data[15]===''){
            setErrorMsg('Degree parameter needed')
            return;
        }
        let workArray=[];
        
        for(let i=0; i<13; i+=2){
            console.log(i);
           const workRange= convertTimeToString(data[i],data[i+1]);
           if(!workRange){
               setErrorMsg('Error with time input');
               return;
           } 
           workArray.push(workRange);
        }
        
        fetch( `${publicRuntimeConfig.sah}/api/v1/doctor/createDoctorUser`,{
            method: 'POST',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                ...sendData, workingHours: workArray,
                proffesion: data[14],
                degree: data[15]
            })
        }).then(res=>{
            res.json().then(dat=>{
                if(res.status===200){
                    setIsDone(true);
                    setTimeout(()=>{
                    router.push('/dashboard');
                    },2000);
                }else{
                    setErrorMsg(dat.message);
                }
            })
        })
    }
    
        
  }
  if(isDone){
      return(<div className='white-box' style={{border: '1px solid green'}}><h1>Submited successfully</h1></div>)
  }
if(isFirstStep){
  return (
    <div className={mainStyles.container}>
      <Head>

        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <div className={mainStyles.main}>
        <div className={styles.sign_up_content}>
       
          <h1 className={styles.welcome_header}> Lets register new Doctor</h1>

       <form className={styles.register} onSubmit={submitHandler}>
        <label >Full Name</label>
        <input  className={styles.form_input} type="text" name="name" defaultValue={sendData.name} placeholder="Enter your name" /> 
        <label > Email</label>
        <input  className={styles.form_input} type="text" name="email" defaultValue={sendData.email} placeholder="Enter your email" /> 
        <label> Password</label>
        <input  className={styles.form_input} type="password" name="password" defaultValue={sendData.password} placeholder="Enter your password" /> 
        <label >Conifirm Password</label>
        <input  className={styles.form_input} type="password" name="passwordConfirm" placeholder="Confirm your password" /> 
        <label > Phone number</label>
        <PhoneInput containerStyle={{ width: "100%" }}  country={'us'} value={sendData.phoneNumber}/> 
        <label >Date of birth</label>  
        <input className={styles.form_input} type="date" name="date" defaultValue={sendData.dateOfB} /> 
        <p className='danger'>{errorMsg}</p>
        

       <div className='buttonSection'> 
       <button type='submit' className='blueButton'>Continue </button></div> 
        </form>
       
        </div>
        </div>
    </div>
  )
    }
return(  
    <React.Fragment>

   <h1> Sign up a doctor</h1>
    <div className='white-box'>
    <form className={styles.workDaySetUp} onSubmit={submitHandler}>
       <div className={styles.workDayBlock}>
        <label>Monday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
       
        <label>Tuesday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
        <label>Wendsday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
        <label>Thursday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
        <label>Friday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
        <label>Saturday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
        <label>Sunday</label>
        <div className={styles.timeInputWrapper}>
            <div className={styles.timeInputBlock}><h5>Start Time</h5>
             <input type='time'/></div>
             <div className={styles.timeInputBlock}><h5> End Time</h5>
             <input type='time'/></div>
        </div>
       </div>
            <div className={styles.profesionForm}>
            <label>Proffesion</label>
            <input type='text'/>
            <label>Degree</label>
            <input type='text'/>
            
            </div>
            <div className={styles.submitBlock}>
                <p className='danger'>{errorMsg}</p>
                <button type='button'  onClick={backHandler} className={styles.backBttn}>back</button>
            <button type='submit' className='blueButton'>Submit </button>
            </div>
    </form>
    </div>
    </React.Fragment>
    )
}
