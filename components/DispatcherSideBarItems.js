import React from 'react';
import Link from 'next/link';
import styles from './TopBar.module.css';
export default function DispacherSideBarItems(){
    return (<React.Fragment>
          <li>
                  <Link  href={'/dashboard/createAppointment/_'} passHref={true}><a className={styles.navLink}  ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 144V384l-96 96H144C117.5 480 96 458.5 96 432v-288C96 117.5 117.5 96 144 96h288C458.5 96 480 117.5 480 144zM384 264C384 259.6 380.4 256 376 256H320V200C320 195.6 316.4 192 312 192h-48C259.6 192 256 195.6 256 200V256H200C195.6 256 192 259.6 192 264v48C192 316.4 195.6 320 200 320H256v56c0 4.375 3.625 8 8 8h48c4.375 0 8-3.625 8-8V320h56C380.4 320 384 316.4 384 312V264zM0 360v-240C0 53.83 53.83 0 120 0h240C373.3 0 384 10.75 384 24S373.3 48 360 48h-240C80.3 48 48 80.3 48 120v240C48 373.3 37.25 384 24 384S0 373.3 0 360z"/></svg>
                   
                        <span>Create Appointment</span>
                        </a></Link>
          
                  </li>
    </React.Fragment>);
}