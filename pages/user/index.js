import React,{useState,useRef} from 'react';
import styles from '../../styles/userPage.module.css';
import PhoneInput from 'react-phone-input-2';
import {useAuth} from '../../components/context/AuthContext';
import { useRouter } from 'next/router';
import 'react-phone-input-2/lib/bootstrap.css'
import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();


const validateEmail =(mail)=>{
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
    }
    
export default function Home(props){
    const [errorMsg,setErrorMsg]=useState('');
    const [errorMsgPhoto,setErrorMsgPhoto]=useState('');
    const [userPhotoUploaded, setUserPhotoUploaded]=useState(false);
    const [userInfoUploaded, setUserInfoUploaded]=useState(false);
    const [user, setUser]=useState(useAuth().user);
    const FileUploadRef=useRef();
    const router= useRouter();
    const uploadedHandler=()=>{
        FileUploadRef.current.style.backgroundColor='rgb(86, 184, 86)';
        FileUploadRef.current.innerText='Image is uploaded';

        }
    const changeImageHandler=(event)=>{
        event.preventDefault();
        const sendForm =new FormData();
          sendForm.append('photo' ,event.currentTarget.elements[0].files[0]);
          console.log(event.currentTarget.elements[0].value, event.currentTarget.elements[0].files[0]);
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/updateUserPhoto`,{
            method: 'POST',    
            body: sendForm
        }).then((res)=>{
            console.log(res);
            res.json().then(dat=>{
            if(res.status===200){
                setUserPhotoUploaded(true);
             setTimeout(()=>{
                 
                 router.reload();
             },1500);
                
            }else{
                setErrorMsgPhoto(dat.message);
            }
        });
        })

    }
    const submitHandler=(event)=>{
        event.preventDefault();
        const isErrorOccured=false;
        const sendData={};
        let errorMessage='';
       
        let data=   [...event.currentTarget.elements]
        .filter((ele) => ele.type !== "submit")
        .map((ele) => {
            return  ele.value;
        }); 
        if(!(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-.\s])){1,}(['’,\-\.]){0,1}){2,}(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1}){2,}((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]'’,\-\.\s])){2,})?)*)$/.test(data[0]))){
            sendData.name=data[0];
            errorMessage=`${errorMessage}  Please enter your full name`;
            isErrorOccured=true;
        }
        if(!validateEmail(data[1])){
           
            errorMessage=`${errorMessage}  Please enter valid email address`;
            isErrorOccured=true;
        }
        if(!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data[2].replace(/\D/g, '').slice(1))){
            
            errorMessage=`${errorMessage}  Please provide valid us phone number`;
            isErrorOccured=true;
        }
        if(isErrorOccured) {setErrorMsg(errorMessage); return;}
        sendData.name=data[0];
        sendData.email=data[1];
        sendData.phoneNumber=data[2];
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/changeUserInfo`,{
            method: 'PATCH',
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(sendData)
        }).then(res=>{
            res.json().then(dat=>{
            if(res.status===200){
                setUserInfoUploaded(true);
               setTimeout(()=>{

                router.reload();
               },1500);
            }else{
                setErrorMsg(dat.message);
            } 
        })
    });
        
    }
    return (<React.Fragment><h1>User information</h1><div className={styles.pageWrapper}>
        {!userInfoUploaded ? <form className={styles.mainForm} onSubmit={submitHandler}>
        <h1>Update user info</h1>
           <label> Full Name: </label>
           <input type='text' defaultValue={user.name} />
            <label>Email</label>
           <input type='text'  defaultValue={user.email}/>
           <label>Phone Number</label>
           <PhoneInput containerStyle={{ width: "100%" }} value={user.phoneNumber? user.phoneNumber.toString(): ''} country={'us'} /> 
            <p className='danger'>{errorMsg}</p>
           <div className={styles.buttonSection}>
           
          <button type='submit' className='blueButton' > Change </button>
          </div>
        </form> : 
            <div className={styles.successfullyChanged}><h1>Successfully Changed</h1></div>
            }
       {!userPhotoUploaded ? <form className={styles.mainForm} onSubmit={changeImageHandler}>
            <h1>Upload user photo</h1>
            <input type='file' id='file' style={{display:'none'}}  onChange={uploadedHandler} accept="image/png, image/gif, image/jpeg"/>
            <label htmlFor='file'className={styles.uploadingInput} ref={FileUploadRef}>Upload photo</label>
            <p className='danger'>{errorMsgPhoto}</p>
            <div className={styles.buttonSection}>
         
           <button type='submit' className='blueButton' > Set up photo </button>
           </div>
        </form> : 
        <div className={styles.successfullyChanged}><h1>Successfully Uploaded</h1></div>}
    </div></React.Fragment>)
}   