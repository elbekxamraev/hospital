import React from 'react';
import Cookies from 'cookies';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../../../styles/appointmentInfo.module.css';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();

export default function Home(props){
    const router= useRouter();
  if(props.accessDined){
    return (<div className='white-box'>
      <h1 className='danger'> Access Denied</h1>
    </div>)
  }
  if(props.preAppointment.doctor){
    return (
      <React.Fragment>
        <h1>Pre-Appointment info</h1>
      <div className='white-box'>
        
        <div className={styles.centered_info}>
          <h3>Feelings</h3>
         <p>{props.preAppointment.feelings}</p> 
         <h3> Doctor who created this pre-Appointment</h3>
         <p>{props.preAppointment.doctor.name}</p>
         <h3>This pre-appointment is follow up for appointment id: </h3>
         <p>{props.preAppointment.followUpAppointmentId}</p>
         <div className={styles.buttonsBlock} style={{margin: '2% auto'}}><button className='blueButton' onClick={()=>{ router.push(`/dashboard/createAppointment/${props.preAppointment._id}`)}}>Create Appoinment</button> </div>
        </div>  
    </div>
    </React.Fragment>
    );
  }
    return(<div className='white-box'>
           <div className={styles.centered_info}>
            <h3>Patient {props.preAppointment.patient.name}</h3>
            <h3>AvailableDate</h3>
             <p>{props.preAppointment.availableDate}</p>
             <h3>AvailableTime</h3>
             <p>{props.preAppointment.availableTime}</p>    
             
   
            <h3>Feelings</h3>
                 <p>{props.preAppointment.feelings}</p> 
                 <h3>Start Date</h3>
                 <p>{props.preAppointment.startDate}</p> 
                 <h3>Repeating times</h3>
                 <p>{props.preAppointment.repeatingTimes}</p>
                 <h3>Time comments</h3> 
                 <p>{props.preAppointment.timeComments}</p>
    
               { props.preAppointment.images.map((imageHref)=>{   
             return (
               <Image key={imageHref} src={imageHref.replace('public','')}alt={"Pre appointment image"} width='100%' height='100%' />
               );
            })
            }
          
         
        
          <div className={styles.buttonsBlock} style={{margin: '2% auto'}}><button className='blueButton' onClick={()=>{ router.push(`/dashboard/createAppointment/${props.preAppointment._id}`)}}>Create Appoinment</button> </div>
          </div> 
           </div>
           
         );
} 
export async function getServerSideProps(context){
    const cookies=Cookies(context.req,context.res);
    if(cookies.get('jwt')===undefined){
      return  {props: { preAppointment: {},accessDined: true}}
    }
    const response=await fetch(`${publicRuntimeConfig.sah}/api/v1/user/getPreAppointmentInfo/${context.params.preAppointmentId}`,  {headers:{
        'Authorization': 'Bearer ' +cookies.get('jwt') ,
      }});
      
      const data=   await response.json();
      if(response.status===200){
          return{
        props: { preAppointment: data.preAppointment}
    }
       
      }
   else{
   return{
          props: { preAppointment: {},accessDined: true}
      }
}
}