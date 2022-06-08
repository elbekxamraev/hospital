import React from 'react';

import styles from './TableAppointment.module.css';
import BodyOFTableAppointment from './BodyOFTableAppointment';
const patientTableHeads=['Start Date','Doctors','Patients','Start Time','End Time','Comments','Status','Appointment id'];
const dispatcherTableHeads=['Patient','Feelings','Available Date','Available Time'];
export default function TableAppointment(props){
    let trHead_content;
    if(props.isAppointments){
        trHead_content= patientTableHeads.map((tableHead)=>{
           return (<th key={tableHead}>{tableHead}</th>);
        });
    }else if(!props.isAppointments){
        trHead_content= dispatcherTableHeads.map((tableHead)=>{
         return (<th key={tableHead}>{tableHead}</th>);;
        });
    }
    return (
       <div className={styles.tableWrapper}>
           <table className={styles.appointmentTable}> 
               <thead>
                   <tr>
                       {trHead_content}
                   </tr>
               </thead>
             <BodyOFTableAppointment appointments={props.appointments} isAppointments={props.isAppointments}/>
            </table>
       </div>
    );
}