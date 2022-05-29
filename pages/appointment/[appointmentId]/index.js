import React, { useEffect } from 'react';
import { useRouter} from 'next/router';

export default function Home(props){
    const router= useRouter();
    console.log("router" ,router.query.appointmentId);

    return(<div><h1> Router</h1>{router.query.appointmentId} </div> );
}
