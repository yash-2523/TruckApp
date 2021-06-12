import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export const AuthModalContext = createContext();


export default function AuthContextProvider(props){
    const [signInStage,setSignInStage] = useState(0);
    const [signInData,setSignInData] = useState({
        phoneNumber: ""
    })

    return (
        <AuthModalContext.Provider value={{SignInStage: [signInStage,setSignInStage], SignInData: [signInData,setSignInData]}}>
            {props.children}
        </AuthModalContext.Provider>
    )
}