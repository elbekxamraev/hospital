import Head from 'next/head'
import styles from '../../styles/dashboard.module.css'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import TableAppointment from '../../components/TableAppointment';
import { BallClipRotate } from 'react-pure-loaders';

 
export default function Home(props) {
  const [appointments,setAppointments ]=useState([]);
  const [isLoading, setIsLoading]=useState(true);
  const router= useRouter();
 useEffect(()=>{
   console.log("user",props.user);
   if(!props.user || Object.keys(props.user).length===0){
      router.push('/login');
   }else{
   async function getAppointments(){
  let appointments=[];
  const url_role = `http://localhost:3000/api/v1/user/${ props.user.role==='patient' ? 'getPatientsDashboard' : 'getAllPreAppointments'} `;
  const res_data= await fetch(url_role );
   
       let buf;
      if(res_data.status===200){
       buf= await res_data.json();
     

  if(props.user.role==='patient'){
  appointments= buf.appointments;
  }else if(props.user.role==='dispatcher'){
    appointments= buf.preAppointments;

  }
 
}
  
      setAppointments(appointments);
      setIsLoading(false);
 
 }
 setIsLoading(true);
  getAppointments();
}
 },[router,props.user]);

 if(!props.user || Object.keys(props.user).length===0) return (<div></div>);
  return (
    <React.Fragment>
      <Head>
        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
       <h1 className={styles.header}> {props.user.role==='dispatcher'? 'Pre-Appointments':'Appointments' }</h1>
      {isLoading ? <BallClipRotate   color={'#123abc'} loading={isLoading}/>:<TableAppointment appointments={appointments} user={props.user}/>}
      </React.Fragment> 
  )
}