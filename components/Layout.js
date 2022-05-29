import React,{useEffect,useState} from 'react';
import Topbar from './Topbar';

export default function Layout(props){
  
    return (
        <React.Fragment>
            
            <Topbar user={props.userInfo}/>
            <div className='bodyWrapper'>

            {props.children}
            </div>
        </React.Fragment>
    );
}
