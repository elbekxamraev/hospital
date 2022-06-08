import React, { useState } from 'react';
import styles from './NewAppointmentForm.module.css';
import InputImage from './InputImage';
import {useRouter} from 'next/router';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
const datesAreOnSameDay = (first, second) =>{
   return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

const headerText= ['Tell us how you feel ', 'How often you feel that way?' , 'Tell us when you are available' ,'send us some pictures'];
let preAppointmentInfo={}
export default function NewAppointmentForm(props){
    const router=useRouter();
    const [stepNumber, setStepNumber]= useState(0);
    const [errorMessage, setErrorMessage]=useState('');
    const [isDone,setIsDone]=useState(false);
    const submitHandler= (event)=>{
        event.preventDefault();

        let data=   [...event.currentTarget.elements]
        .filter((ele) => ele.type !== "submit")
        .map((ele) => {
            return  ele.value;
        }); 
        
        switch(stepNumber) {
            case 0:
              if(data[0]. trim(). split(/\s+/).length>=3){
                preAppointmentInfo.feelings= data[0];
                setErrorMessage('');
                setStepNumber(1);
                 break;
              }else{
                setErrorMessage('feeling should be described with at least 3 words');
                break;    
              }
                  
            case 1:
             
              if(data[0]!=='' &&(new Date(data[0]))<=(Date.now())){
              preAppointmentInfo.startDate=data[0];
              preAppointmentInfo.repeatingTimes= data[1];
              setStepNumber(2);
              setErrorMessage('');
              break;
              }
              else{
                setErrorMessage('start date have to be defined and can not exceed more than today');
                break;
              }
            case 2:
              data[0]=data[0]+'T00:00:00';
            if(data[0]!=='' && (datesAreOnSameDay(new Date(data[0]),new Date(Date.now())) ||(new Date(data[0]))>=(Date.now())) && data[1]!==''){
                preAppointmentInfo.availableDate=data[0];
              preAppointmentInfo.availableTime= data[1];
              preAppointmentInfo.timeComments= data[2];
              setErrorMessage('');
              setStepNumber(3);
              break;
            }else{
              let err_str='';
              if(data[0]==='' || (!datesAreOnSameDay((new Date(data[0])),new Date(Date.now()))  && (new Date(data[0]))<(Date.now()))){
                err_str='appointment date have to be defined and can not be in past';
              }
              if(data[1]===''){
                err_str= err_str+'please choose your avalable time';
              }
              setErrorMessage(err_str);
              break;
            }
            
          }
       
    }
    const submitInfoHandler=(event)=>{
      const data = new FormData();
      for (const entry of Object.entries(event)) {
        data.append('files[]', entry[1], entry[0]);
      }
    
      data.append ( 'preAppointmentInfo',JSON.stringify(preAppointmentInfo));
      fetch(`${publicRuntimeConfig.sah}/api/v1/user/requestAppointment`, {
        method: 'POST',
        body: data,
      }).then((res)=>{
        res.json().then(dat=>{
          if(res.status===200){
            setIsDone(true);
            setTimeout(()=>{
            router.push('/dashboard');
            },2000);
          }else{
            setErrorMessage(dat.message);
          }
        })
      });
    }
      if(isDone){
    return(<React.Fragment><h1>Congratulation</h1><div className='white-box' style={{border: '1px solid green'}}><h1>Submited successfully</h1></div></React.Fragment>)
      }
    return (
        <React.Fragment>
        <h1 className={styles.headerText}>{headerText[stepNumber]}</h1>
        <div className={styles.NewAppointmentForm}>
        
            {
                stepNumber==0 ? <form  onSubmit={submitHandler}>
                    <textarea  type='text'/> 
                    <p className='red-text'>{errorMessage}</p>
                    <div className='buttonSection'>
                      <button className='blueButton' type='submit'> Continue</button>
                    </div>
                    
                </form> 
                : stepNumber==1 ?
                 <form className={styles.step_twoForm} id='stepTwoForm' onSubmit={submitHandler}>
                     <label> When did it start?</label>
                     <input type='date' id='discomfortStartTime'/>
                     <label> How often does it happen?</label>
                    <select >
                     <option value="once a day" >once a day</option>
                     <option value="many times a day">many times a day</option>
                     <option value="static ache">static ache</option>
                     <option value="some times" >some times</option>
                     <option value="other">other</option>
                    </select>
                    <p className='red-text'>{errorMessage}</p>
                    <div className='buttonSection'><button className='blueButton' type='submit'> Continue</button></div>
                 </form>
                : stepNumber==2? 
                <form className={styles.step_twoForm} id='stepThreeForm' onSubmit={submitHandler}>
                <label> What date are you available</label>
                <div><input type='date' id='avalableDate'  /></div>
                <label> What time are you available?</label>
               <div>
               <select >
                <option value="">select</option>
                <option value="480-660" >8am-11am</option>
                <option value="660-840">11am-2pm</option>
                <option value="840-1020">2pm-5pm</option>
                <option value="1020-1200" >5pm-8pm</option>
                <option value="anytime">anytime</option>
                <option value="other">other</option>
               </select>
               </div>
               <label> Comments</label>
               <input type='text' />
               <p className='red-text'>{errorMessage}</p>
                <div className='buttonSection'><button className='blueButton' type='submit'> Continue</button></div>
            </form> :stepNumber==3?  
                <div className={styles.imageForm}>
                     
              <InputImage onSubmitDataHandler={submitInfoHandler}/>
            </div>
              : <p> Error occured</p>
            }
        </div>
        </React.Fragment>
        
    );
}