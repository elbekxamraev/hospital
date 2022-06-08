import Head from 'next/head';
import Layout from '../components/Layout'
import '../styles/globals.css'
import React ,{useEffect,useState} from 'react';
import { AuthProvider } from '../components/context/AuthContext';
import { ProtectRoute } from '../components/ProtectRoute';
function MyApp({ Component, pageProps }) {

  return (
    
      <AuthProvider>
        <ProtectRoute> 
        <Head>
        <title>Hospital</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  <Layout  >
     <Component {...pageProps} />
    </Layout>
    </ProtectRoute> 
     </AuthProvider>
    );
}

export default MyApp;