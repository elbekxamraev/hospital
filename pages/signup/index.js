import Head from 'next/head'
import Link from 'next/link';
import Script  from 'next/script';
import React, {useRef,useState} from 'react';
import mainStyles from '../../styles/Home.module.css';
import  styles from '../../styles/Login.module.css';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

const validateEmail =(mail)=>{
return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

export default function SignUp() {
const [isErrorOccured, setIsErrorOccured]= useState({name: false , email: false, phone: false, dateOfB: false, password: false, passwordConfirm: false});
  const submitHandler= (event)=>{
     event.preventDefault();
     let data=   [...event.currentTarget.elements]
            .filter((ele) => ele.type !== "submit")
            .map((ele) => {
       
                return  ele.value;
            }); 
     let errorObj= {
        name: !(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/.test(data[0])),
        email: !validateEmail(data[1]),
        passwordConfirm: !(data[2]===data[3] && data[2]!=""),
        password: !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(data[2]),
        phone: !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data[4].replace(/\D/g, '').slice(1)),
        dateOfB: (!data[5] || (new Date(data[5]))>(Date.now()))
     }
    setIsErrorOccured(errorObj);

  }
 
  return (
    <div className={mainStyles.container}>
      <Head>

        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <div className={mainStyles.main}>
        <div className={styles.sign_up_content}>
       
          <h1 className={styles.welcome_header}> Welcome</h1>
          <p className={styles.comments}>Lets resiter you </p>
        <form className={styles.register} onSubmit={submitHandler}>
        <label className={`${isErrorOccured.name ? "red-bold-label": ''}`}>Full Name</label>
        <input  className={styles.form_input} type="text" name="name" placeholder="Enter your name" /> 
        <label className={`${isErrorOccured.email ? "red-bold-label": ''}`}> Email</label>
        <input  className={styles.form_input} type="text" name="email" placeholder="Enter your email" /> 
        <label className={`${isErrorOccured.password ? "red-bold-label": ''}`}> Password</label>
        <input  className={styles.form_input} type="password" name="password" placeholder="Enter your password" /> 
        <label className={`${isErrorOccured.passwordConfirm ? "red-bold-label": ''}`}>Conifirm Password</label>
        <input  className={styles.form_input} type="password" name="passwordConfirm" placeholder="Confirm your password" /> 
        <label className={`${isErrorOccured.phone ? "red-bold-label": ''}`}> Phone number</label>
        <PhoneInput containerStyle={{ width: "100%" }}  country={'us'} /> 
        <label className={`${isErrorOccured.dateOfB ? "red-bold-label": ''}`}>Date of birth</label>  
        <input className={styles.form_input} type="date" name="date"  /> 
        {isErrorOccured.name&&<p className='red-text'>Provide with full name</p>}
        {isErrorOccured.email &&<p className='red-text'>Provide with validate Email</p>}
        {isErrorOccured.phone &&<p className='red-text'>Provide with valid US number</p>}
        {isErrorOccured.password &&<p className='red-text'>Password must have at least : 1 upper case, 1 lower case, 1 symbol , 5 character </p>}
        {isErrorOccured.passwordConfirm &&<p className='red-text'>Passwords needs to be matched</p>}
        {isErrorOccured.dateOfB &&<p className='red-text'>Provide with valid date of birth</p>}
        

        <button className={styles.blueButton}>Submit </button> 
        </form>
        </div>
        </div>
    </div>
  )
}
