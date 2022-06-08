import Head from 'next/head'

import  {useRouter}   from 'next/router';
import {useRef,useState} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
import { useAuth } from '../../components/context/AuthContext';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
  const content = [{ comments: 'Type your email', label: 'Email', button:'Send recover email'},{comments: 'Type verification code',label: 'Verification code',button: 'Verify code'},{comments: 'create new password', label: 'new password', button: 'Set password'}];
export default function Login(props) { 
  
  const router =useRouter();
  const {login,user} =useAuth();
  const [stepNumber, setStepNumber]=useState(0);
  const [errorMsg, setErrorMsg]= useState('');
  const [emailInput,setEmailInput]=useState('');
  const mainInput= useRef();
  const submitHandler= (event)=>{
    event.preventDefault();
    let sendObject={};
        const url = `${publicRuntimeConfig.sah}/api/v1/user/${stepNumber===0 ? 'sendRecoverEmail' : stepNumber===1? 'verifyCode' : 'resetPassword'}`;
        if(stepNumber===0){ 
            sendObject.email=mainInput.current.value;
        } else if(stepNumber===1){
          sendObject.email=emailInput;
          sendObject.verify_code= mainInput.current.value;
        } else if(stepNumber===2){
           if(mainInput.current.value.length<7){
            setErrorMsg ('Password should be at least 7 characters long');
            return;
            }
            sendObject.password= mainInput.current.value;
        }
     fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendObject),
    }).then((res)=>{  
        res.json().then((dat)=>{
      if(res.status===200){
          if(stepNumber===2){
            login(dat.user);
            router.push('/dashboard');
            return;
          }
        const buf= stepNumber+1;
        if(stepNumber===0) setEmailInput(sendObject.email);
        mainInput.current.value='';
        setStepNumber(buf);
        setErrorMsg('');
        return;
      }else{
          setErrorMsg(dat.message);
      }
    })
    });
  }
  if(user){
    router.push('/dashboard');
    return (<div> </div>);
  }

  return (
    <div className={mainStyles.container}>
      <Head>
        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={mainStyles.main}>
        <div className={styles.sign_up_content}>
          <h1 className={styles.welcome_header}>Reset your password</h1>
          <p className={styles.comments}>{content[stepNumber].comments}</p>
        <form className={styles.sign_up} onSubmit={submitHandler}>
        <label > {content[stepNumber].label}</label>
        <input ref={mainInput} className={styles.form_input} type="text" name="email"  /> 
        <p className='danger'>{errorMsg}</p>
        <div className='buttonSection'> <button type='submit' className='blueButton'>{content[stepNumber].button}</button> </div>
        </form> 
        </div>
        </div>
    </div>
  );
  
}