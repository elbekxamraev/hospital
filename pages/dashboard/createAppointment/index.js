import React,{useState,useRef, useEffect} from 'react';
import Cookies from 'cookies';
import styles from '../../../styles/createAppointment.module.css';




 function includesToArray(arr1,arr2){
    
    for(const element of arr1){
        console.log(element[0],arr2[0]);
        if(element[0]===arr2[0]){
            return true;
        }
    }

    return false;
}
function includesToObject(arr,obj, fieldName){
 
    for(const element of arr){

        if(element[fieldName]===obj[fieldName]){
            return true;
        }
    }

    return false;
}
const fileterArray=(arr,str)=>{
    var reg = new RegExp(str.toUpperCase());
    let filteredArray= [];
    
    for(let i=0; i<arr.length; i++){

        if (arr[i].user.name.toUpperCase().match(reg)) {
            filteredArray.push([arr[i].user._id, arr[i].user.name]);
        }
        return filteredArray;
}
}
export default function Home(props){
    const [resultsDoc,setResultsDoc]=useState([]);
    const [resultsPatient, setResultsPateint]=useState([]);
    const [chosenDoc,setChosenDoc]=useState([]);
    const [chosenPatient,setChosenPatient]=useState([]);
    const [errorMsg,setErrorMsg]=useState('');
    const [isAppointmentSent,setIsAppointmentSent]=useState(false);
    const FileUploadRef=useRef();
    const docResultsRef= useRef();
    const patientResultsRef= useRef();
    const docInputRef=useRef();
    const patientInputRef=useRef();
    useEffect(()=>{
        docResultsRef.current.style.display='none';
        patientResultsRef.current.style.display='none';
    },[]);
    const searchDocHandler=(event)=>{
            if(event.target.value===''){
                setResultsDoc([]);
                docResultsRef.current.style.display='none';
                return ;
            }
        setResultsDoc(fileterArray(props.doctors,event.target.value));
        docResultsRef.current.style.display='block';
    }
    const searchPateintHandler=(event)=>{
        if(event.target.value===''){
            setResultsPateint([]);
            patientResultsRef.current.style.display='none';
            return ;
        }
        fetch(`http://localhost:3000/api/v1/patient/searchPatientsByName/${event.target.value}`).then((res)=>{
            if(res.status===200){
                res.json().then((data)=>{
                    console.log(data);
                    setResultsPateint(data.patients);
                    patientResultsRef.current.style.display='block';
                })
            }
        })
    }
    const chooseHandler=( chosen,type,event)=>{
        if(type==='doc'){
           
            if(!includesToArray(chosenDoc,chosen)){
                docInputRef.current.value='';
                docResultsRef.current.style.display='none';
                setResultsDoc([]);
                setChosenDoc([...chosenDoc,chosen]);
            }
             
        }
        else if(type==='patient'){
            if(!includesToObject(chosenPatient,chosen,'patient')){
                patientResultsRef.current.style.display='none';
                patientInputRef.current.value='';
                setResultsPateint([]);
                setChosenPatient([...chosenPatient,chosen]);
            }
          
        }
       
    }
    const removeHandler=(removeArr, type)=>{
        if(type==='doc'){
           const buf=  chosenDoc.filter((arr)=>{
             if(arr[0]===removeArr[0] && arr[1]===removeArr[1]){
                 return false;
             }
                return true;
           });
            setChosenDoc(buf);
        }
        else if(type==='patient'){
            const buf=  chosenPatient.filter((obj)=>{
                if(obj.name===removeArr.name && obj.patient===removeArr.patient){
                    return false;
                }
                   return true;
              });
               setChosenPatient(buf);
          
        }
    }
    const formSubmitHandler= (event)=>{ 
        event.preventDefault();
    if(chosenDoc.length===0 || chosenPatient.length===0){
        setErrorMsg('doctors and patients needed to be chosen');
        return ;
    }
        const sendObject={
    doctors: chosenDoc.map((doc)=>{ return doc[0];}),
    patients: chosenPatient.map((patient)=>{ return patient._id;})
    };
        const sendData = new FormData();
        event.preventDefault();
        let data=   [...event.currentTarget.elements]
        .filter((ele) => ele.type !== "submit")
        .map((ele) => {
            return  ele.value;
        }); 
        sendObject.startDate= new Date(`${data[0]} ${data[1]}:00`);
        sendObject.endDate= new Date(`${data[2]} ${data[3]}:00`);
        for (const entry of Array.from(event.currentTarget.elements[4].files)) {
            sendData.append('files[]', entry, entry.name);
          }
          sendData.append ( 'appointmentData',JSON.stringify(sendObject));
         
          fetch('http://localhost:3000/api/v1/doctor/createAppointment',{
              method: 'POST',
              body: sendData
          }).then((res)=>{
              console.log(res);
              if(res.status===201){
                  setIsAppointmentSent(true);
                

              }
          
          });
           setErrorMsg('');
    }
    const uploadedHandler=()=>{
        FileUploadRef.current.style.backgroundColor='rgb(86, 184, 86)';
        FileUploadRef.current.innerText='Files are Uploaded';

        }
    if(isAppointmentSent){
        return (
        <div className={styles.appointmentSentBlock}>
            <h2> Appointment sent successfully</h2>
        </div>);
    }
    return (
        <React.Fragment>
            <h1 className={styles.mainHeader}>Create An Appointment</h1>
        <div className='white-box'> 
            <form autoComplete="off" className={styles.searchForm} >
                <label>Type Doctor name</label>
                <input type="text" name="q" id="q" onChange={searchDocHandler} ref={docInputRef} />
            <div className={styles.result} ref={docResultsRef}>
                <ul>
                {resultsDoc.map((doctor)=>{
                  
                    return <li key={doctor[0]}><button onClick={(e)=>{ e.preventDefault();return chooseHandler(doctor,'doc',e)}}>{doctor[1]}</button> </li>
                })
                }
                </ul>
            </div>
            <div className={styles.chosenListWrapper}>
                <h3> Choosen Doctors</h3>
                <ul className={styles.chosenList}>
                {
                    chosenDoc.map(doc=>{
                        return <li key={doc[0]}><p>{doc[1]}</p><button onClick={()=>{removeHandler(doc,'doc')}}>x</button></li>
                    })
                }
                </ul>
            </div>
            </form>
            <form autoComplete="off" className={styles.searchForm}>
            <label>Type Patients name</label>
                <input type="text" name="q" id="q" onChange={searchPateintHandler} ref={patientInputRef}/>
            <div className={styles.result} ref={patientResultsRef}>
                <ul>
                {resultsPatient.map((patient)=>{
                  
                    return <li key={patient.patient}><button onClick={(e)=>{ e.preventDefault();return chooseHandler(patient,'patient')}}>{patient.name}</button> </li>
                })
                }
                </ul>
            </div>
            <div className={styles.chosenListWrapper}>
            <h3> Choosen Patients</h3>
                <ul className={styles.chosenList}>
                {
                    chosenPatient.map(patient=>{
                       
                        return <li key={patient.patient}><p>{patient.name}</p><button onClick={()=>{removeHandler(patient,'patient')}}>x</button></li>
                    })
                }
                </ul>
            </div>
            </form>
            <form className={styles.endForm} onSubmit={formSubmitHandler}>
                <div className={styles.dateWrapper}>
                <label>Start Time</label> 
                <div className={styles.dateBlock}>
                
                <input type='date' />
                <input type='time'/>
                </div> 
                </div>
                <div className={styles.dateWrapper}>
                <label>End Time</label>
                <div className={styles.dateBlock}>
                <input type='date' />
                <input type='time'/> 
                </div>
                </div>
                
                <div className={styles.fileBlock}>
                <h3>Choose files to upload</h3>
                
                     <input type="file" accept="image/*,.pdf" id='file' onChange={uploadedHandler} multiple/>
                     <label ref={FileUploadRef }  htmlFor='file'>Press to upload</label>
            
               
                </div>
                <label className='danger'>{errorMsg}</label>
                <button type='submit' className={styles.submitBttn}>Submit</button>
            </form>
        </div>
        </React.Fragment>
    );
}
export async function getServerSideProps(context){
    const cookies = Cookies(context.req,context.res);
    if(!cookies.get('jwt')){
        return {
            redirect: {
              permanent: false,
              destination: "/login"
            }
    }
    }
   const response= await fetch('http://localhost:3000/api/v1/doctor/getAllDoctors',{
    headers:{
            'Authorization': 'Bearer ' +cookies.get('jwt') 
        },
    });
    console.log(response);
    if(response.status===200){
        const data= await response.json();
        return{
            props: {
                doctors: data.data
            }
        }
    }
    else if(response.status===403){
        return {
            redirect: {
              permanent: false,
              destination: "/login"
            }
    }
    }
    else if(response.status===500){
        return {
            props: {
                error: true
            }
        }
    }
}