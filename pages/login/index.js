import Head from 'next/head'
import Link from 'next/link';
import  {useRouter}   from 'next/router';
import {useRef,useEffect} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
export default function Login(props) { 
  const router =useRouter();
  useEffect(()=>{
    if(props.user && Object.keys(props.user).length!==0){
      router.push('/dashboard');
    }
  }, [router,props.user])
 
  const loginInput= useRef();
  const passwordInput=useRef();
  const submitHandler= (event)=>{
    event.preventDefault();
    loginInput.current.value;
    try{
     fetch('http://localhost:3000/api/v1/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginInput.current.value,
        password: passwordInput.current.value
      }),
    }).then((data)=>{
      
      data.json().then((obj)=>{router.reload('/dashboard')});
    }).catch((error)=>{
      console.log(error);
    });
  }catch(err){
    console.log(err);
  }
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
        <Link href="#" className={styles.blueLink}> Forgot password ?</Link>
        <button className='blueButton'>Submit </button> 
        </form> 
        </div>
        </div>
    </div>
  );
}
