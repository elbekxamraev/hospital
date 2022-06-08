import React, {useEffect, useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import  styles from './TopBar.module.css';
import PatientSideBarItems from './PatientSideBarItems';
import DispatcherSideBarItems from './DispatcherSideBarItems';
import { useAuth } from './context/AuthContext';
import AdminSideBars from './AdminSideBars';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export default function Topbar(props){
  const sideBarRef=useRef();
  const userListRef=useRef();
  const router= useRouter();
  const {logout} = useAuth();
  const logoutHandler=()=>{
    fetch(`${publicRuntimeConfig.sah}/api/v1/user/logout`).then((res)=>{
      setTimeout(()=>{
        logout();
      },500);
    });


  }
const handleUserList=()=>{
  if(userListRef.current.style.display==='none'){
    userListRef.current.style.display='block';
  }
  else{
    userListRef.current.style.display='none';
  }
}
const TransferToLoginPage=()=>{
  router.push('/login');
}
const TranferToSignUpPage=()=>{
  router.push('/signup');
}
 const sideBarHandler=()=>{
   if(sideBarRef.current.className.split(' ')[1]===styles.unfolded){
    sideBarRef.current.className= sideBarRef.current.className.split(' ')[0]+" " + styles.folded;
   }else{
    sideBarRef.current.className= sideBarRef.current.className.split(' ')[0]+" "+styles.unfolded;
   }
      
 }


    return (
        <nav className={styles["main-nav"]}>
          {props.user && <button className={styles.arrowBttnOut} onClick={sideBarHandler}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/></svg>
                  </button>}
      {props.user &&  <nav className={`${styles.sideNav} ${styles.folded}`} ref={sideBarRef}>
      
            <ul className={styles.SideNavbarList}>
            <li>
                    <button className={styles.arrowBttn} onClick={sideBarHandler}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/></svg>
                  </button>
                </li>
                <li>
              <Link  href={'/dashboard'} passHref={true}><a className={styles.navLink}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"> <path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"/></svg>
                   
                        <span>Dashboard</span>
                        </a></Link>
                
                </li>
                { props.user.role==='patient'? <PatientSideBarItems/> : props.user.role==='dispatcher' ? <DispatcherSideBarItems/> : props.user.role==='admin'? <AdminSideBars/>: ''}
                {props.user.role!=='patient'? 
                 <li>
                 <Link  href={'/patient-lookup'} passHref={true}><a className={styles.navLink}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
                      
                           <span>Patient Look Up</span>
                           </a></Link>
                   
                   </li> : ''}
                
            </ul>
        </nav>
    }
     <div className={styles["main-navWrapper"]}>
    <div className={styles["main-nav-start"]}>
     <Link className={styles.logo} href="/"><a> 
     <Image src="/../public/logo.png" alt="logo" width={"50px"} height={"50px"}/>
     </a></Link>

    </div>
    
    <div className={styles["main-nav-end"]}>
    {props.user ?
    <div className={styles["nav-user-wrapper"]}>
      
    <p className={styles["nav-user-name"]}>{`Hi, ${props.user.name}`}</p>
    <button href="##" className={`${styles["nav-user-btn"]} ${styles["dropdown-btn"]}`} onClick={handleUserList} title="My profile" type="button">
            <Image src={ props.user.image ? `${publicRuntimeConfig.sah}/img/users/${props.user.image}`: `${publicRuntimeConfig.sah}/user.png`} onError={() => setSrc('/user.png')}
              alt="user " width={"100%"} height={"100%"}/>
   </button>
    <ul className={` ${styles["users-item-dropdown"]} ${styles["nav-user-dropdown dropdown"]}`} ref={userListRef}>
          <li><Link href="/user" ><a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"  aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Profile</span></a></Link></li>
          <li><button className={"danger"}  onClick={logoutHandler} style={{zIndex:'3'}}><a>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"  aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Log out</span>
            </a></button></li>
        </ul>
      </div>
   : 
   

      <div className={styles["nav-user-wrapper"]}>
      <button onClick={TransferToLoginPage} className={styles['nav-link-button']}> 
        Login
      </button>
      <button onClick={TranferToSignUpPage} className={styles['nav-link-button']} style={{backgroundColor: '#2f49d1'}}>
        SignUp
      </button>
    </div>
    }
      </div>
    </div>
</nav>
    );
}
