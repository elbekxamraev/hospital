import React from 'react';
import styles from './timePicker.module.css';

export default function TimePicker(props){
    return (
        <div className={styles["time-picker"]} data-time="00:00">
		<div className={styles["hour"]}>
			<div className={styles["hr-up"]}></div>
			<input type="number" className={styles["hr"]} value="00" />
			<div className={styles["hr-down"]}></div>
		</div>

		<div className={styles["separator"]}>:</div>

		<div className={styles["minute"]}>
			<div className={styles["min-up"]}></div>
			<input type="number" className={styles["min"]} value="00" />
			<div className={styles["min-down"]}></div>
		</div>
	</div>
    );
}