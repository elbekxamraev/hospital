import React,{useState,useRef} from 'react';
import Image from 'next/image';
import styles from '../../styles/patientLookUp.module.css';
import TableAppointment from '../../components/TableAppointment';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();

export default function Home(props){
    const [resultsPatient, setResultsPateint]= useState([]);
    const [patientInfo ,setPatientInfo]= useState();
    const [errorMsg,setErrorMsg]= useState('');
    const patientResultsRef=useRef();
    const patientSearchInputRef=useRef();
    const searchChangeHandler=(event)=>{
        if(event.target.value===''){
            setResultsPateint([]);
            patientResultsRef.current.style.display='none';
            return ;
        }
        fetch(`${publicRuntimeConfig.sah}/api/v1/patient/searchPatientsByName/${event.target.value}`).then((res)=>{
            if(res.status===200){
                res.json().then((data)=>{
                    setResultsPateint(data.patients);
                    console.log(data.patients);
                    patientResultsRef.current.style.display='block';
                })
            }
        })
    }
    const fetchPatientInfo=(patientId)=>{
        fetch(`${publicRuntimeConfig.sah}/api/v1/patient/getPatient/${patientId}`).then((res)=>{
          
                res.json().then((data)=>{
                    if(res.status===200){
                        patientSearchInputRef.current.value='';
                        patientResultsRef.current.style.display='none';
                         setPatientInfo(data.patient);
                    }else{
                        setErrorMsg(data.message);
                    }
                   
                });
            
            });
}
    return (<React.Fragment><h1>Patient Look Up</h1>
        <div className='white-box'>
            <div className={styles.searchWrapper}>
                    <input type='text' onChange={searchChangeHandler} ref={patientSearchInputRef} className={styles.searchInput}/>
                    <ul className={styles.results} ref={patientResultsRef}> 
                        {
                            resultsPatient.map(patient=>{
                                return <li key={patient._id}><button onClick={()=>{fetchPatientInfo(patient._id)}}>{patient.name}</button></li>
                            })
                        }
                    </ul>
                    <p className='danger'>{errorMsg}</p>   
            </div> 
            <div className={styles.patientInfoWrapper}>
                   { patientInfo &&
                   <React.Fragment>
                        <div className={styles.patientContactsBlock}>   
                             <p>
                            <Image src={ patientInfo.image ? `${publicRuntimeConfig.sah}/img/users/${patientInfo.image}`: `${publicRuntimeConfig.sah}/user.png`} onError={() => setSrc('/user.png')}
                             alt="user " width={"100%"} height={"100%"}/></p>
                            
                                <h2>{patientInfo.name}</h2>
                        <div><h4>Email: </h4><p>{patientInfo.email}</p></div>
                       <div><h4>Date of Birth: </h4><p>{`${new Date(patientInfo.dateOfB).toDateString()}`}</p></div>
                        <div><h4>Height: </h4><p>{`${patientInfo.patient.height? patientInfo.patient.height: ''} feet`}</p></div>
                        <div><h4>Weight: </h4>{`${patientInfo.patient.weight? patientInfo.patient.weight: ''} pounds`}</div>
                        </div>
                        <div className={styles.filesBlock}>
                            <h1>Medical records and files</h1>
                        <ul className={styles.fileList}>
                            {
                                patientInfo.patient.medicalReports.map((dir,i)=>{
                                    
                                    return   <li key={i}>  <a
                                    href={`${publicRuntimeConfig.sah}/${dir}`}
                                    alt="alt text"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >{dir.split('/')[dir.split('/').length-1]}</a></li>
                                })
                            }    
                        </ul> 
                         </div>
                   </React.Fragment>

                    }
            </div>
        
        </div>
        
        {patientInfo && 
       <React.Fragment> <h1>{`Appointments of ${patientInfo.name}`}</h1>
        <TableAppointment appointments={patientInfo.appointments} isAppointments={true}></TableAppointment> </React.Fragment>}</React.Fragment>)
}