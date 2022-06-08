import styles from '../../styles/dashboard.module.css'
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import TableAppointment from '../../components/TableAppointment';
import TableOfAllDoctors from '../../components/TableOfAllDoctors';
import { BallClipRotate } from 'react-pure-loaders';
import { useAuth } from '../../components/context/AuthContext';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
export default function Home(props) {
  const [appointments,setAppointments ]=useState([]);
  const [isLoading, setIsLoading]=useState(true);
  const [errorMsg, setErrorMsg]=useState('');
  const router= useRouter();
  const {user}= useAuth();
 useEffect(()=>{
  if(user && user.role!=='admin'){
   async function getAppointments(){
  let result=[];
  
  const url_role = `${publicRuntimeConfig.sah}/api/v1/user/${ user.role==='dispatcher' ? 'getAllPreAppointments': 'getPatientsDashboard'} `;
  const res_data= await fetch(url_role );
   
       let buf;
      if(res_data.status===200){
       buf= await res_data.json();
      
  if(user.role==='patient' || user.role==='doctor' ){
  result= buf.appointments;

  }else if(user.role==='dispatcher'){
    result.push( buf.preAppointments);
  const res= await fetch(`${publicRuntimeConfig.sah}/api/v1/user/getAllCancelledAppointments`)
    if(res.status===200){
     result.push((await res.json()).appointments);
    }
    else{
     setErrorMsg((await res.json()).message);
    }
  }
 
}else{
  setErrorMsg((await res_data.json()).message);
}
      setAppointments(result);
      setIsLoading(false);

}
 setIsLoading(true);
  getAppointments();
}

 },[router,user]);

 if(!user || Object.keys(user).length===0) {
   router.push('/login');
  return (<div></div>);
}
if(errorMsg!==''){
  return (<React.Fragment><h1>Error occured</h1><div className='white-box'><div className='centered'><p className='danger'>{errorMsg}</p></div></div></React.Fragment>)
}
if(user.role==='admin'){
  return(
<React.Fragment>
  <h1> All Doctors</h1>

  <TableOfAllDoctors/>
</React.Fragment>);
} 
 if(user.role==='dispatcher'){
   return( <React.Fragment>
     <h1> Pre-Appointments</h1>
    {isLoading ? <BallClipRotate   color={'#123abc'} loading={isLoading}/>:<TableAppointment appointments={ appointments[0]} user={user} isAppointments={ false }/>}
    <h1 className={styles.header}> Cancelled Appointments</h1>
    {isLoading ? <BallClipRotate   color={'#123abc'} loading={isLoading}/>:<TableAppointment appointments={ appointments[1]} user={user} viewOnly={true} isAppointments={ true}/>}
    </React.Fragment> );
 } 
 return (
    <React.Fragment>
       <h1 >Appointments</h1>
      {isLoading ? <BallClipRotate   color={'#123abc'} loading={isLoading}/>:<TableAppointment appointments={appointments} user={user} isAppointments={ true}/>}
      </React.Fragment> 
  )
}