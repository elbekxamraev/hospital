import React from 'react';

import styles from './TableAppointment.module.css';

export default function TableAppointment(props){
    return (
       <div className={styles.tableWrapper}>
           <table className={styles.appointmentTable}> 
               <thead>
                   <tr>
                       <th> Start Date</th>
                       <th>Doctors</th>
                       <th>Patients</th>
                       <th>Start Time</th>
                       <th>End Time</th>
                       <th>comments</th>
                       <th>Status</th>
                       <th>Appointment id</th>
                   </tr>
               </thead>
               <tbody>
                  { props.appointments.map((appointment)=>{
                      const startDate = new Date(appointment.startDate);
                      const doctors= appointment.doctors.length>1 ? appointment.doctors.reduce((str, a) => {return str+ a.name+" , "},appointment.doctors[0].name) : appointment.doctors[0].name;
                      const patients=appointment.patients.length>1 ?  appointment.patients.reduce((str, a) => {return str +a.name+" , "},appointment.patients[0].name ) : appointment.patients[0].name;
                      const endDate= new Date(appointment.endDate);
                       return (
                       
                      
                  <tr key ={ appointment._id}>
                    <td>{startDate.toDateString()}</td>
                   <td>{doctors}</td>
                   <td>{patients}</td>
                   <td>{startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getSeconds()}</td>
                   <td>{endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getSeconds()}</td>
                   <td>{!appointment.comments ? 'none': appointment.comments}</td>
                   <td><div  className={`${styles.status} ${styles[`status_${appointment.status}`]}`}>{appointment.status}</div></td>
                   <td>{appointment._id}</td>
                   </tr>);
                   })} 
               </tbody>
            </table>
       </div>
    );
}