import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

export const AuthModalContext = createContext();


export default function AuthContextProvider(props){

    const [authMethod,setAuthMethod] = useState(0);
    const [signInStage,setSignInStage] = useState(0);
    const [signUpStage,setSignUpStage] = useState(0);
    const [signInData,setSignInData] = useState({
        phoneNumber: ""
    })
    const [signUpData,setSignUpData] = useState({
        email: "",
        password: "",
        firstName: "",
        phoneNumber: ""
    })

    return (
        <AuthModalContext.Provider value={{AuthMethod: [authMethod,setAuthMethod], SignInStage: [signInStage,setSignInStage], SignUpStage: [signUpStage,setSignUpStage],SignInData: [signInData,setSignInData], SignUpData: [signUpData,setSignUpData]}}>
            {props.children}
        </AuthModalContext.Provider>
    )
}