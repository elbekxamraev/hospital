import React,{useEffect,useState} from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../components/context/AuthContext";
import styles from '../../styles/patientLookUp.module.css';
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();
export default function Home(props){
     const [user,setUser] =useState(); 
     const [errorMsg,setErrorMsg]=useState('');
     const router= useRouter();
     const  usercontext=useAuth().user;
     const id=  usercontext ? usercontext._id : undefined;
    useEffect(()=>{
       if(id){
        fetch(`${publicRuntimeConfig.sah}api/v1/patient/getPatient/${id}`).then((res)=>{
          
            res.json().then((data)=>{
                if(res.status===200){
                     setUser(data.patient);
                }else{
                    setErrorMsg(data.message);
                }
               
            });
        
        });}
    },[id]);
    if(!id){
        router.push('/login');
        return(<div></div>);
    }
    
    return (<React.Fragment><h1>Medical records</h1>
    <div className='white-box'>
            <p className='danger'>{errorMsg}</p>
               { user &&
               <React.Fragment>
                    <div className={styles.patientContactsBlock} >               
                            <h2>{user.name}</h2>
                    <div><h4>Email: </h4><p>{user.email}</p></div>
                   <div><h4>Date of Birth: </h4><p>{`${new Date(user.dateOfB).toDateString()}`}</p></div>
                    <div><h4>Height: </h4><p>{`${user.patient.height} feet`}</p></div>
                    <div><h4>Weight: </h4>{`${user.patient.weight} pounds`}</div>
                    </div>
                    <div className={styles.filesBlock}>
                        <h1>Medical records and files</h1>
                    <ul className={styles.fileList}>
                        {
                            user.patient.medicalReports.map((dir,i)=>{
                                
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
     
    
    </div></React.Fragment>)
}