import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useState } from 'react';
import {currentUser} from '../Services/AuthServices'
import GlobalLoader from '../Components/GlobalLoader';
import React from 'react';
import HomeStatic from '../Components/HomeStatic/HomeStatic';
import { useRouter } from 'next/router';

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
