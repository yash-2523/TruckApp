import '../styles/globals.scss'
import GlobalLoadingContextProvider, { GlobalLoadingContext } from '../Context/GlobalLoadingContext'
import { ConfirmProvider } from 'material-ui-confirm';
import Amplify from 'aws-amplify'
import config from '../Components/aws-exports.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect, useState } from 'react';
import { currentUser, getUser } from '../Services/AuthServices';
import HeadTags from '../Components/HeadTags';
import Home from '../Components/Home/Home';
import { useRouter } from 'next/router';
import GlobalLoader from '../Components/GlobalLoader';
import ConfirmDialog from '../Components/ConfirmDialog';

function MyApp({ Component, pageProps }) {
  Amplify.configure(config);
  
  toast.configure({
    position:toast.POSITION.TOP_RIGHT,
    autoClose:5000,
    hideProgressBar:false,
    newestOnTop:false,
    closeOnClick:true,
    rtl:false,
    pauseOnFocusLoss:false,
    draggable:false,
    pauseOnHover:false,
  });

  const [user,setUser] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    getUser()
    let AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
    })
    return () => {
      AuthObservable.unsubscribe()
    }
  },[])
  if(user===null && router.pathname!=="/"){
    router.push({pathname: "/"})
  }
  if(user!==null && user!=="loading" && router.pathname==="/"){
    router.push({pathname: "/dashboard"})
  }
  return (
    <GlobalLoadingContextProvider>
      <ConfirmProvider>
        <>
          <HeadTags />
          <ConfirmDialog />
          {user==="loading" && <GlobalLoader />}
          {(user==="loading" || user===null) ?
            
            <Component {...pageProps} />
          : 
            <Home Component={Component} pageProps={pageProps} />
          
          } 
        </>
      </ConfirmProvider>
    </GlobalLoadingContextProvider>
  )
}

export default MyApp


