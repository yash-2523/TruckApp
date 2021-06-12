import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Home from './Components/Home/Home';
import HomeStatic from './Components/HomeStatic/HomeStatic';
import { useContext, useEffect, useState } from 'react';
import { currentUser } from './Services/AuthServices';
import {  toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GlobalLoadingContext } from './Context/GlobalLoadingContext';
import GlobalLoader from './GlobalLoader';

function App() {
  const [user,setUser] = useState("loading");

  const {globalLoading} = useContext(GlobalLoadingContext);

  useEffect(() => {
    let AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
      console.log(data)
    })
    return () => {
      AuthObservable.unsubscribe()
    }
  })

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
  return (
    <>
      {(globalLoading || user==="loading") && <GlobalLoader />}

      {user!=="loading" &&
      <Router>
        <Switch>
          {user === null ? 
            <>
              <Route path="/" exact component={HomeStatic}></Route>
              <Route path="*" render={() => <Redirect to="/" />}></Route>
            </>
            :
            <Route path="/" component={Home}></Route>
          }
          
        </Switch>
      </Router> }
    </>
  );
}

export default App;
