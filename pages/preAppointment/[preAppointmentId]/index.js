import React from 'react';
import Cookies from 'cookies';
import Image from 'next/image';

export default function Home(props){
  if(props.accessDined){
    return (<div className='white-box'>
      <h1> Access Denied</h1>
    </div>)
  }
    return(<div className='white-box'>
            <h2>Patient {props.preAppointment.patient.name}</h2>
            <div className='full-width-box'>
             <p>{`AvailableDate ${props.preAppointment.availableDate}`}</p>
             <p>{`AvailableTime: ${props.preAppointment.availableTime}`}</p>    
             </div>
        <div className='full-width-box'>
            <div>
                 <p>{`Feelings: ${props.preAppointment.feelings}`}</p> 
                 <p>{`Start Date: ${props.preAppointment.startDate}`}</p> 
                 <p>{`RepeatingTimes: ${props.preAppointment.repeatingTimes}`}</p> 
                 <p>{`TimeComments : ${props.preAppointment.timeComments}`}</p>
                 
            </div>
            <div>
               { props.preAppointment.images.map((imageHref)=>{   
             return (
               <Image key={imageHref} src={imageHref.replace('public','')}alt={"Pre appointment image"} width='100%' height='100%' />
               );
            })
            }
            </div>
            </div>
            </div>
           
         );
} 
export async function getServerSideProps(context){
    const cookies=Cookies(context.req,context.res);
    if(cookies.get('jwt')===undefined){
      return  {props: { preAppointment: {},accessDined: true}}
    }
    const response=await fetch(`http://localhost:3000/api/v1/user/getPreAppointmentInfo/${context.params.preAppointmentId}`,  {headers:{
        'Authorization': 'Bearer ' +cookies.get('jwt') ,
      }});

      if(response.statusCode===403){
        return{
          props: { preAppointment: {},accessDined: true}
      }
      }
   else{
    const data=   await response.json();
    return{
        props: { preAppointment: data.preAppointment}
    }
 
}
}