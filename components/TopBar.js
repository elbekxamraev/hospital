import React, {useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import  styles from './TopBar.module.css';
export default function Topbar(props){
  const sideBarRef=useRef();
 const sideBarHandler=(event)=>{
   if(sideBarRef.current.className.split(' ')[1]===styles.unfolded){
    sideBarRef.current.className= sideBarRef.current.className.split(' ')[0]+" " + styles.folded;
   }else{
    sideBarRef.current.className= sideBarRef.current.className.split(' ')[0]+" "+styles.unfolded;
   }
      
 }

  const onAppointmentHandler=()=>{
    props.onChangeContent('appointments');
  }
  const onNewAppointmentForm=()=>{
    props.onChangeContent('newAppointmentForm')
  }
  const onMedicalRecords =()=>{
    props.onChangeContent('medicalRecords')
  }
    return (
        <nav className={styles["main-nav"]}>
        <nav className={`${styles.sideNav} ${styles.folded}`} ref={sideBarRef}>
            
            <ul className={styles.SideNavbarList}>
            <li>
                    <button className={styles.arrowBttn} onClick={sideBarHandler}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6l-160 160C272.4 444.9 264.2 448 256 448s-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L338.8 288H32C14.33 288 .0016 273.7 .0016 256S14.33 224 32 224h306.8l-105.4-105.4c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160C451.1 245.9 451.1 266.1 438.6 278.6z"/></svg>
                  </button>
                </li>
                <li>
              <button onClick={onAppointmentHandler}><a className={styles.navLink}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"> <path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"/></svg>
                   
                        <span>Appointments</span>
                        </a></button>
                
                </li>
                  <li>
                  <button onClick={onNewAppointmentForm}><a className={styles.navLink}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 144V384l-96 96H144C117.5 480 96 458.5 96 432v-288C96 117.5 117.5 96 144 96h288C458.5 96 480 117.5 480 144zM384 264C384 259.6 380.4 256 376 256H320V200C320 195.6 316.4 192 312 192h-48C259.6 192 256 195.6 256 200V256H200C195.6 256 192 259.6 192 264v48C192 316.4 195.6 320 200 320H256v56c0 4.375 3.625 8 8 8h48c4.375 0 8-3.625 8-8V320h56C380.4 320 384 316.4 384 312V264zM0 360v-240C0 53.83 53.83 0 120 0h240C373.3 0 384 10.75 384 24S373.3 48 360 48h-240C80.3 48 48 80.3 48 120v240C48 373.3 37.25 384 24 384S0 373.3 0 360z"/></svg>
                   
                        <span>Add Appointment</span>
                        </a></button>
          
                  </li>
                
                <li>
                    <button onClick={onMedicalRecords}><a className={styles.navLink}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 128C352 198.7 294.7 256 223.1 256C153.3 256 95.1 198.7 95.1 128C95.1 57.31 153.3 0 223.1 0C294.7 0 352 57.31 352 128zM287.1 362C260.4 369.1 239.1 394.2 239.1 424V448C239.1 452.2 241.7 456.3 244.7 459.3L260.7 475.3C266.9 481.6 277.1 481.6 283.3 475.3C289.6 469.1 289.6 458.9 283.3 452.7L271.1 441.4V424C271.1 406.3 286.3 392 303.1 392C321.7 392 336 406.3 336 424V441.4L324.7 452.7C318.4 458.9 318.4 469.1 324.7 475.3C330.9 481.6 341.1 481.6 347.3 475.3L363.3 459.3C366.3 456.3 368 452.2 368 448V424C368 394.2 347.6 369.1 320 362V308.8C393.5 326.7 448 392.1 448 472V480C448 497.7 433.7 512 416 512H32C14.33 512 0 497.7 0 480V472C0 393 54.53 326.7 128 308.8V370.3C104.9 377.2 88 398.6 88 424C88 454.9 113.1 480 144 480C174.9 480 200 454.9 200 424C200 398.6 183.1 377.2 160 370.3V304.2C162.7 304.1 165.3 304 168 304H280C282.7 304 285.3 304.1 288 304.2L287.1 362zM167.1 424C167.1 437.3 157.3 448 143.1 448C130.7 448 119.1 437.3 119.1 424C119.1 410.7 130.7 400 143.1 400C157.3 400 167.1 410.7 167.1 424z"/></svg>
                    <span>
                        Medical Recors
                        </span>
                </a></button>
                </li>
                <li>

                </li>
                
            </ul>
        </nav>
     <div className={styles["main-navWrapper"]}>
    <div className={styles["main-nav-start"]}>
     <Link className={styles.logo} href="/"><a> 
     <Image src="/../public/logo.png" alt="logo" width={"50px"} height={"50px"}/>
     </a></Link>

    </div>
    <div className={styles["main-nav-end"]}>
    <div className={styles["nav-user-wrapper"]}>
    <p className={styles["nav-user-name"]}>{`Hi, ${props.user.name}`}</p>
    <button href="##" className={`${styles["nav-user-btn"]} ${styles["dropdown-btn"]}`} title="My profile" type="button">
            <Image src={ props.user.image ? `http://localhost:3000/img/users/${props.user.image}`: `http://localhost:3000/user.png`} onError={() => setSrc('/user.png')}
              alt="user " width={"100%"} height={"100%"}/>
   </button>
    <ul className={` ${styles["users-item-dropdown"]} ${styles["nav-user-dropdown dropdown"]}`}>
          <li><Link href="/" ><a><i data-feather="user" aria-hidden="true"></i>
              <span>Profile</span></a></Link></li>
          <li><Link href="/"><a>
              <i data-feather="settings" aria-hidden="true"></i>
              <span>Account settings</span>
              </a></Link></li>
          <li><Link className={styles["danger"]} href="/"><a>
              <i data-feather="log-out" aria-hidden="true"></i>
              <span>Log out</span>
            </a></Link></li>
        </ul>
      </div>
    </div>
  </div>
</nav>
    );
}
