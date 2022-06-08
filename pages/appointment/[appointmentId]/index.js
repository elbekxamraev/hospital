import React, {useState,useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'cookies';
import styles from '../../../styles/appointmentInfo.module.css';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();


const Date_string=(date)=>{
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}
export default function Home(props){
    console.log('props' ,props);
    const router= useRouter();
    const [errorMsg,setErrorMsg]=useState('');
    const FileUploadRef=useRef();
    const uploadedHandler=()=>{
        FileUploadRef.current.style.backgroundColor='rgb(86, 184, 86)';
        FileUploadRef.current.innerText='Files are Uploaded';

        }
  
    const submitFormHandler=(event)=>{
        event.preventDefault();
        const sendForm= new FormData();
        let data=   [...event.currentTarget.elements]
        .filter((ele) => ele.type !== "submit")
        .map((ele) => {
            return  ele.value;
        }); 
        if(data[0].trim().split(/\s+/).length<10){
            setErrorMsg('comments need to be more than 10 words');
            return;
        }
        if(data[2]===''){
            setErrorMsg('please select if appointment needs follow up appointment');
            return;
        }
        for (const entry of Array.from(event.currentTarget.elements[1].files)) {
            sendForm.append('files[]', entry, entry.name);
          }
        sendForm.append('otherInfo', JSON.stringify({comments: data[0] , followUpOption: data[2]}));
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/closeAppointment/${props.appointment._id}`,{
            method: 'POST',
            body: sendForm
        }).then((res)=>{
            console.log("res=" ,res); 
            if(res.status===200){
                console.log('router.push');
                router.push('/dashboard');
            }else{
                console.log('res', res);
                res.json().then((dat)=>{
                    setErrorMsg(dat.message);
                })
            }
        })
    }
    const deleteAppointmentHandler=()=>{
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/deleteAppointment/${props.appointment._id}`).then((res)=>{
           console.log("res=" ,res); 
           if(res.status===200){
                
                router.push('/dashboard');
            }else{
                res.json().then((dat)=>{
                    setErrorMsg(dat.message);
                });
            }
        })
    }
    const cancelAppointmentHandler=()=>{
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/cancelAppointment/${props.appointment._id}`).then((res)=>{
          console.log(res);    
            if(res.status===200){
                router.push('/dashboard');
            
            }
            else{
                res.json().then((dat)=>{
                    setErrorMsg(dat.message);
                })
            }
        })
    }
        return ( <React.Fragment>
            <h1>Appoinment Info</h1>
            <div className='white-box'>
                <div className={styles.appointmentInfoBlock}>
                <div className={styles.datesBox}> 
                    <h3>{`Appointment Id: ${props.appointment._id} `}</h3>
                    <h3>{`Start Date: ${Date_string(new Date(props.appointment.startDate))}`}</h3>
                    <h3>{`End Date: ${Date_string(new Date(props.appointment.endDate))}`}</h3>
                </div>
            <h3 className={styles.headers}>Files</h3>
            <ul className={styles.filesBox}>
                {props.appointment.documents.map((document,i)=>{
                    document= document.replace('public/','');
                    const documentName=document.split('/')[document.split('/').length-1];
                   return (<li key={i}>  <a
                   href={`${publicRuntimeConfig.sah}/${document}`}
                   alt="alt text"
                   target="_blank"
                   rel="noopener noreferrer"
                 >{documentName}</a></li> );
                })}
            </ul>
            </div>
            {(props.userRole==='doctor' && !props.viewOnly) ?
            <form className={styles.completingForm} onSubmit={submitFormHandler}>
                <div className={styles.comments}>
                    <label>Detailed comments </label>
                    <textarea style={{resize: 'none'}}></textarea>
                </div>
                <div className={styles.middleWrapper}>
                <div className={styles.fileUpload}>
                    
                    <input type='file' style={{display: 'none'}} id='file_end' onChange={uploadedHandler} multiple />
                    <label htmlFor='file_end' ref={FileUploadRef} >Upload Files</label>

                </div>
                <div className={styles.followUpOption}> 
                    <label> Create follow up appointment</label>
                    <select>
                        <option value=''> select</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>
                </div>
                </div>
               
                <div className={styles.buttonsBlock}>
                <p> {errorMsg} </p>
              <button type='button' onClick={cancelAppointmentHandler} className={styles.submitBttn} style={{backgroundColor: 'rgb(233, 41, 41)'}}>Cancel </button>
                <button type='submit' className={styles.submitBttn}>Close </button>
            </div>
            </form>:  
            <div className={styles.appointmentInfo} >
               <div className={styles.rowWrapper}>
                <div className={styles.userInfoWrapper}>
                <h3>Doctors</h3>
                <ul className={styles.listOfUsers}>{props.appointment.doctors.map((doctor)=>{
                    return <li key={doctor._id}>{doctor.name}</li>
                })}</ul>
                </div>
                <div className={styles.userInfoWrapper}>
                <h3>Patients</h3>
                <ul className={styles.listOfUsers}>{props.appointment.patients.map((patient)=>{
                    return <li key={patient._id}>{patient.name}</li>
                })}</ul>
                </div>
                </div>
                <div className={styles.rowWrapper}>
                <div className={styles.userInfoWrapper}>
                <h3> Drug List</h3>
                <ul className={styles.listOfUsers}>{props.appointment.drugsList.map((drug)=>{
                    return <li key={drug}>{drug}</li>
                })}</ul>
                </div>
                <div className={styles.statusWrapper}>
                    <div className={`${styles[props.appointment.status]} ${styles.status}`} ><p>{props.appointment.status}</p> </div>
                    </div>
                
                </div>
                <div className={styles.rowWrapper}>
                <div className={styles.buttonsBlock} style={{height: '25%', display: `${props.viewOnly ? 'none' : ''}`}}>
                <p> {errorMsg} </p>
                <button type='button'  onClick={cancelAppointmentHandler} className={styles.submitBttn} style={{backgroundColor: 'rgb(233, 41, 41)', display: `${props.appointment.status==='cancelled'? 'none': 'flex'}`}}>Cancel </button>
                <button type='button'  onClick={deleteAppointmentHandler} className={styles.submitBttn} style={{backgroundColor: 'rgb(233, 41, 41)', display: `${props.appointment.status==='cancelled'?  'flex': 'none'}`}}>Delete </button>
            
                </div></div>
            </div>
            
            }
                
             </div>
        </React.Fragment>);
  
}
export async function getServerSideProps(context){
    let appointment,userRole;
    const cookies= Cookies(context.req,context.res);
    if(!cookies.get('jwt')){
        return {
            redirect: {
                permanent: false,
                destination: "/login"
              }
        }
    }
    const res= await fetch(`${publicRuntimeConfig.sah}/api/v1/doctor/appointmentInfo/${context.params.appointmentId}`,{
        headers:{
            'Authorization': 'Bearer ' +cookies.get('jwt') 
        }
    });
    if(res.status===200){
        const data =await res.json();
        appointment= data.appointment;
        userRole= data.role;
        console.log('appointment', appointment._id);
        return {props: {appointment,userRole,viewOnly: appointment.status==='done'}}
    }else{
        return {
            redirect: {
                permanent: false,
                destination: "/login"
              }
        }
    }
        
    
    
}