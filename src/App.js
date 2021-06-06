import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './Components/Home/Home';
import HomeStatic from './Components/HomeStatic/HomeStatic';
import { useEffect, useState } from 'react';
import { curerntUser } from './Services/AuthServices';

function App() {
  const [user,setUser] = useState(null);
  useEffect(() => {
    let AuthObservable = curerntUser.subscribe((data) => {
      setUser(data);
    })
    return () => {
      AuthObservable.unsubscribe()
    }
  })

  return (
    <Router>
      <Switch>
        <Route path="/" component={user!==null ? Home : HomeStatic}></Route>
      </Switch>
    </Router>
  );
}

export default App;
