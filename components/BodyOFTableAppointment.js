import React from 'react';
import { useRouter } from 'next/router';
import styles from './TableAppointment.module.css';
const Date_string=(date)=>{
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}
export default function BodyOFTableAppointment(props){
  let content;
  console.log("0" ,props.appointments[0]);
  const router=useRouter();
  const RedirectUser=(url)=>{
    router.push(url);
  }
   if(props.user.role==='patient'){ content=props.appointments.map((appointment)=>{
        const startDate = new Date(appointment.startDate);
        const doctors= appointment.doctors.length>1 ? appointment.doctors.reduce((str, a) => {return str+ a.name+" , "},appointment.doctors[0].name) : appointment.doctors[0].name;
        const patients=appointment.patients.length>1 ?  appointment.patients.reduce((str, a) => {return str +a.name+" , "},appointment.patients[0].name ) : appointment.patients[0].name;
       
         return (
         
        
    <tr key ={ appointment._id} onClick={()=>RedirectUser(`/appointment/${appointment._id}`)}>
      <td>{startDate.toDateString()}</td>
     <td>{doctors}</td>
     <td>{patients}</td>
     <td>{Date_string(new Date(appointment.startDate))}</td>
     <td>{Date_string(new Date(appointment.endDate))}</td>
     <td>{!appointment.comments ? 'none': appointment.comments}</td>
     <td><div  className={`${styles.status} ${styles[`status_${appointment.status}`]}`}>{appointment.status}</div></td>
     <td>{appointment._id}</td>
     </tr>);
     })} 
     else if(props.user.role==='dispatcher'){
       content=props.appointments.map((appointment)=>{
           
        return( 
                <tr key={appointment._id} onClick={()=>RedirectUser(`/preAppointment/${appointment._id}`)}>
                    <td>{appointment.patient.name}</td>
                    <td>{appointment.feelings}</td>
                    <td>{(new Date(appointment.availableDate)).toDateString()}</td>
                    <td>{appointment.availableTime}</td>
                </tr>
            );
       });
     }
   
   return (<tbody>
     {content}
 </tbody>);
}