import '../styles/globals.scss'
import GlobalLoadingContextProvider from '../Context/GlobalLoadingContext'
import Amplify from 'aws-amplify'
import config from '../Components/aws-exports.js'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { currentUser, getUser } from '../Services/AuthServices';
import HeadTags from '../Components/HeadTags';
import Home from '../Components/Home/Home';
import { useRouter } from 'next/router';
import GlobalLoader from '../Components/GlobalLoader';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// pick a date util library
import MomentUtils from '@date-io/moment';

function MyApp({ Component, pageProps }) {
  Amplify.configure(config);

  toast.configure({
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
  });

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#367BF5',
        dark: 'rgba(44, 113, 235, 1)'
      }
    },
    overrides: {
      MuiStepIcon: {
        root: {
          color: "rgba(96, 98, 110, 1)"
        },
        active: {
          color: "rgba(49, 41, 104, 1) !important"
        },
        completed: {
          color: "rgba(45, 188, 83, 1) !important"
        }
      }
    }
  })

  const [user, setUser] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    getUser()
    let AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
    })
    return () => {
      AuthObservable.unsubscribe()
    }
  }, [])
  console.log(user)
  if (user === null && router.pathname !== "/") {
    router.push({ pathname: "/" })
  }
  if (user !== null && user !== "loading" && router.pathname === "/") {
    router.push({ pathname: "/dashboard" })
  }
  return (
    <GlobalLoadingContextProvider>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <>
            <HeadTags />

            {user === "loading" && <GlobalLoader />}
            {(user === "loading" || user === null) ?

              <Component {...pageProps} />
              :
              <Home Component={Component} pageProps={pageProps} />

            }
          </>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </GlobalLoadingContextProvider>
  )
}

export default MyApp


