import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GlobalLoader from '../Components/GlobalLoader';
import HomeStatic from '../Components/HomeStatic/HomeStatic';
import { currentUser } from '../Services/AuthServices';

export default function Index() {

  const [user,setUser] = useState("loading");
  const router = useRouter();
  useEffect(() => {
    let AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
    })
    return () => {
      AuthObservable.unsubscribe()
    }
  },[])
  return (
    <>
      {user==="loading" && <GlobalLoader />}

      {user!=="loading" && 
        (user===null ? <HomeStatic /> : <></>)
      }

    </>
  )
}
