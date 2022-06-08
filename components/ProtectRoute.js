import LoadingScreen from './LoadingScreen';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/router';
export const ProtectRoute = ({ children }) => {
    const { loading ,isAuthenticated} = useAuth();
    if (loading){
      return <LoadingScreen />; 
    }
    return children;
  };