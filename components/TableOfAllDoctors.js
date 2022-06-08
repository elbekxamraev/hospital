import React,{useEffect,useState} from 'react';
import styles from './TableAppointment.module.css';
import { BallClipRotate } from 'react-pure-loaders';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();

export default function TableOfAllDoctors(props){
    const [doctors,setIsDoctors]= useState([]);
    const [isLoading, setIsLoading]= useState(true);
    const [errorMsg, setErrorMsg]= useState('');
    useEffect(()=>{
        fetch(`${publicRuntimeConfig.sah}/api/v1/doctor/getAllDoctors`).then((res)=>{
           res.json().then((dat)=>{
            if(res.status===200){
                setIsDoctors(dat.data);
                setIsLoading(false);
            }else{
                setErrorMsg(dat.message);
            }})
        }).catch(()=>{
            setErrorMsg("some thing went very wrong");
        });
    },[]);
    if(isLoading){
        return <BallClipRotate   color={'#123abc'} loading={isLoading}/>
    }
    if(errorMsg!==''){
        return (<React.Fragment><h1>Error occured</h1><div className='white-box'><div className='centered'><p className='danger'>{errorMsg}</p></div></div></React.Fragment>)
      }
    return(<div className={styles.tableWrapper}>
    <table className={styles.appointmentTable}> 
        <thead>
            <tr>
                <th>Name</th>
                <th>Proffesion</th>
                <th>Degree</th>
                <th>Date of Birth</th>
                <th>pending appointments</th>
                <th>closed appointments</th>
                <th>cancelled appointments</th>
            </tr>
        </thead>
        <tbody>
           { doctors.map(doctor=>{ 
           return (
            <tr key={doctor._id}>
               <td>{doctor.user.name}</td>
               <td>{doctor.proffesion}</td>
               <td>{doctor.degree}</td>
               <td>{new Date(doctor.user.dateOfB).toDateString()}</td>
               <td>{doctor.pendingAppointments}</td>
               <td>{doctor.closedAppointments}</td>
               <td>{doctor.cancelledAppointments}</td>
            </tr>);
            })
            }
            </tbody>
     </table>
</div>);
}

