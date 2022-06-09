import React,{useEffect,useState} from 'react';
import Topbar from './Topbar.js';
import { useAuth } from './context/AuthContext.js';
export default function Layout(props){
    const {user}= useAuth();
    return (
        <React.Fragment>
            
            <Topbar user={user}/>
            <div className='bodyWrapper'>

            {props.children} 
            </div>
        </React.Fragment>
    );
}
