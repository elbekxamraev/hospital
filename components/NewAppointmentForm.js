import React, { useState } from 'react';
import styles from './NewAppointmentForm.module.css';
import InputImage from './InputImage';
const headerText= ['Tell us how you feel ', 'How often you feel that way?' , 'Tell us when you are available' ,'send us some pictures'];
let preAppointmentInfo={}
export default function NewAppointmentForm(props){
    const [stepNumber, setStepNumber]= useState(0);


    const submitHandler= (event)=>{
        event.preventDefault();

        let data=   [...event.currentTarget.elements]
        .filter((ele) => ele.type !== "submit")
        .map((ele) => {
            return  ele.value;
        }); 
        console.log("data", data);
        switch(stepNumber) {
            case 0:
            preAppointmentInfo.feelings= data[0];
            setStepNumber(1);
              break;
            case 1:
              preAppointmentInfo.startDate=data[0];
              preAppointmentInfo.repeatingTimes= data[1];
              setStepNumber(2);
              break;
            case 2: 
              preAppointmentInfo.avalableDate=data[0];
              preAppointmentInfo.avalableTime= data[1];
              preAppointmentInfo.TimeComments= data[2];
              setStepNumber(3);
          }
       
    }
    const submitInfoHandler=(event)=>{
      const data = new FormData();
      for (const entry of Object.entries(event)) {
        data.append('files[]', entry[1], entry[0]);
      }
    
      data.append ( 'preAppointmentInfo',JSON.stringify(preAppointmentInfo));
      fetch('http://localhost:3000/api/v1/user/requestAppointment', {
        method: 'POST',
        body: data,
      }).then((res)=>{
        console.log(res);
      });
    }
    
    return (
        <React.Fragment>
        <h1 className={styles.headerText}>{headerText[stepNumber]}</h1>
        <div className={styles.NewAppointmentForm}>
        
            {
                stepNumber==0 ? <form  onSubmit={submitHandler}>
                    <textarea  type='text'/> 
                    <button className='blueButton' type='submit'> Continue</button>
                </form> 
                : stepNumber==1 ?
                 <form className={styles.step_twoForm} id='stepTwoForm' onSubmit={submitHandler}>
                     <label> When did it start?</label>
                     <input type='date' id='discomfortStartTime' />
                     <label> How often does it happen?</label>
                    <select >
                     <option value="once a day" >once a day</option>
                     <option value="twice a day">twice a day</option>
                     <option value="static ache">static ache</option>
                     <option value="some times" >some times</option>
                     <option value="other">other</option>
                    </select>
                     <button className='blueButton' type='submit'> Continue</button>
                 </form>
                : stepNumber==2? 
                <form className={styles.step_twoForm} id='stepThreeForm' onSubmit={submitHandler}>
                <label> When date are you available</label>
                <div><input type='date' id='avalableDate'  /></div>
                <label> When time are you available?</label>
               <select >
                <option value="480-660" >8am-11am</option>
                <option value="660-840">11am-2pm</option>
                <option value="840-1020">2pm-5pm</option>
                <option value="1020-1200" >5pm-8pm</option>
                <option value="anytime">anytime</option>
                <option value="other">other</option>
               </select>
               <label> Comments</label>
               <input type='text' />
                <button className='blueButton' type='submit'> Continue</button>
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