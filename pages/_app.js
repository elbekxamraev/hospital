import Layout from '../components/Layout'
import '../styles/globals.css'
import '../styles/phoneInput.css'
import React ,{useEffect,useState} from 'react';
function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo]=useState({});
  useEffect(()=>{
      fetch(`http://localhost:3000/api/v1/user/userInfo`).then((res)=>{
          res.json().then((data)=>{
              setUserInfo(data.user);
          })
      })
  },[]);
  return (
  <Layout userInfo={userInfo}>{
  
        <Component { ...pageProps} user={userInfo} />
  
   } </Layout>);
}

export default MyApp
