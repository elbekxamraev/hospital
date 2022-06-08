import Head from 'next/head';
import Link from 'next/link';
import  {useRouter}   from 'next/router';
import {useRef,useState} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
import { useAuth } from '../../components/context/AuthContext';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
export default function Login(props) { 
  const router =useRouter();
  const {login,user} =useAuth();
  const [errorMsg, setErrorMsg]= useState('');
  const loginInput= useRef();
  const passwordInput=useRef();
  const submitHandler= (event)=>{
    event.preventDefault();
     fetch(`${publicRuntimeConfig.sah}/api/v1/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginInput.current.value,
        password: passwordInput.current.value
      }),
    }).then((res)=>{
      if(res.status===200){
        res.json().then((dat)=>{
          login(dat.user);
           router.push('/dashboard');
        });
       
      }else{
        res.json().then((dat)=>{
          setErrorMsg(dat.message);
        })
      }
    })
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
          <h1 className={styles.welcome_header}> Welcome back</h1>
          <p className={styles.comments}>Sign in to your account to continue</p>
        <form className={styles.sign_up} onSubmit={submitHandler}>
        <label > Email</label>
        <input ref={loginInput} className={styles.form_input} type="text" name="email" placeholder="Enter you email" /> 
        <label > Password</label>
        <input ref={passwordInput} className={styles.form_input} type="password" name="password" placeholder="Enter your password"/>
        <Link href="/forgot-password" className={styles.blueLink}> Forgot password ?</Link>
        <p className='danger'>{errorMsg}</p>
        <div className='buttonSection'> <button type='submit' className='blueButton'>Submit </button> </div>
       
        </form> 
        </div>
        </div>
    </div>
  );
}
