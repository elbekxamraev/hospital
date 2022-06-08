import React,{useEffect,useState} from 'react';
import Topbar from './Topbar';
import { useAuth } from './context/AuthContext';
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
