import styles from '../styles/Home.module.css'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {useAuth} from '../components/context/AuthContext';
export default function Home() {
  const {user}= useAuth();
  return (
    <React.Fragment>
    <div className={styles.container} style={{ marginTop: '1%',backgroundColor: 'white'}}>
      <div className={styles.introBlock}>
          <div className={styles.halfBlock}>
            <h1 style={{color: '#2a695a'}}>Health Care</h1>
            <p className={styles.perfectText}>Excepturi quam cum ex, expedita inventore adipisci reprehenderit incidunt doloribus delectus quod, placeat nulla culpa nemo, mollitia natus! Beatae illo quas nemo omnis ullam placeat, obcaecati ducimus rem id. Consectetur.</p>
          </div>
          <div className={`${styles.halfBlock} ${styles.imageFullSize}`}>
            <Image src='/slider-img.png' alt='doctors' width='500px' height='500px'  />
          </div>
      </div>
      <div className={styles.infoBarWrapper}>
        <div  className={styles.infoBarBlock}>
        <div className={styles.imageWrapper}>
          <Image src='/ultrasound.svg'alt='technology' width='50%' height='50%' />
        </div>
          <h3>ADVANCED TECHNOLOGY</h3>
        </div>
        <div className={styles.infoBarBlock}>
          <div className={styles.imageWrapper}>
        <Image src='/hospital.svg'alt='availability' width='50%' height='50%'/>
        </div>
        <h3>27/7 AVAILABILITY</h3>
        </div >
        <div className={styles.infoBarBlock}>
        <div className={styles.imageWrapper}>
        <Image src='/doctor.svg' alt='doctors' width='50%' height='50%'/>
        </div>
        <h3>BEST DOCTORS</h3>
        </div>
      </div>

      <div className={styles.aboutHospital}>
        <h2>About Out Hospital</h2>
        <div className={styles.aboutHospitalMainImage}>
        <Image src='/about-img.png' alt='doctors' width='300px' height='300px'/>
        </div>
        <div className={styles.aboutHospitalContent}>
        <p>Esse sed doloribus error ad laborum dolorem nobis? Cum, culpa? Distinctio natus excepturi fugit eveniet quasi animi ab obcaecati laudantium sit, ratione recusandae accusamus, voluptatum iste placeat. Esse, eos cumque. Culpa nesciunt quia qui possimus eveniet dolore a debitis consectetur quod. Eligendi recusandae placeat soluta</p>
          <div className={styles.buttonWrapper}>
          {!user ? <button className='blueButton'><Link href='/login'>Login</Link></button>:  <button className='blueButton'><Link href='/dashboard'>Dashboard</Link></button>}
       </div> 
       </div>
      </div>
  </div>  
  </React.Fragment>
  )
}
