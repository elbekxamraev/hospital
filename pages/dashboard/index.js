import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/dashboard.module.css'
import React, {useState,useCallback} from 'react';
import Cookies from 'cookies';
import Topbar from '../../components/Topbar';
import TableAppointment from '../../components/TableAppointment';
import MedicalRecors from '../../components/MedicalRecors';
import NewAppointmentForm from '../../components/NewAppointmentForm';
export default function Home(props) {
  const [ content , setContent]= useState('appointments');
 const  ChangeContentHandler= useCallback((content_type)=>{

    setContent(content_type);
 },[]);
  return (
    <React.Fragment>
      <Head>
        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <Topbar user={props.user} onChangeContent={ChangeContentHandler}/>
     <div className={styles.bodyWrapper}>
       { content==='appointments' ? 
       <React.Fragment>
       <h1 className={styles.header}> Appointments</h1>
      <TableAppointment appointments={props.appointments} />
      </React.Fragment> 
      : content==='medicalRecords' ? 
        <MedicalRecors />
      :content==='newAppointmentForm' ?
      
        <NewAppointmentForm/> : ''
      }
      </div>
    </React.Fragment>
  )
}

  
export async function getServerSideProps( {req,res}){
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  )
  const cookies= new Cookies(req,res);
  let appointments;
  const resoponse= await fetch('http://localhost:3000/api/v1/user/userInfo' , {
    headers:{
      'Authorization': 'Bearer ' +cookies.get('jwt') ,
    }
  });
  const data= await resoponse.json();
  if(data.role!='admin'){
  
  appointments= data.appointments;
  console.log("user" ,data.user);
  }
  return {
    props: {user: data.user,appointments}
  }
}