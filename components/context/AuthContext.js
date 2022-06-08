
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import getConfig from 'next/config';
const {  publicRuntimeConfig } = getConfig();



const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const router= useRouter();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUserFromCookies() {
           
                console.log('before fetching');
                const res = await fetch(`${publicRuntimeConfig.sah}/api/v1/user/isLoggedIn`);
                 const userData= (await res.json()).user;
                if (userData) {
                 
                    setUser(userData);
                }
            setLoading(false);
        }
        loadUserFromCookies()
    }, []);

    const login =  (user) => {
        setUser(user);
        router.push('/dashboard');
    }

    const logout = () => {
        fetch(`${publicRuntimeConfig.sah}/api/v1/user/logout`);
        setUser(null);
        router.push('/login');
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout }}>

            {children}
        </AuthContext.Provider>
    )
}



export const useAuth = () => useContext(AuthContext)