import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import React from 'react'
import { useContext } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { AuthModalContext } from '../../Context/AuthModalContext';

export default function SignUpPage1() {

    const [phoneNo,setPhoneNo] = useState("");
    const { AuthMethod , SignInStage , SignUpStage, SignUpData } = useContext(AuthModalContext);
    const [signUpStage,setSignUpStage] = SignUpStage;
    const firstNameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef=  useRef("")
    const [termsAndConditions,setTermsAndConditon] = useState(false);
    const [signUpData,setSignUpData] = SignUpData;

    function handleOnChange(value, data, event, formattedValue) {
        setPhoneNo(formattedValue);
    }

    let HandleSubmit = (e) => {
        e.preventDefault();

        // Validate Credentials

        setSignUpData({
            email: emailRef.current.value,
            password: passwordRef.current.value,
            firstName: firstNameRef.current.value,
            phoneNumber: phoneNo
        })
        setSignUpStage(1);
    }
    return (
        <div className="mt-4 px-3 py-5">
            <form onSubmit={(e) => HandleSubmit(e)} className="d-flex flex-column">
                <TextField 
                    type="text"
                    label="Full Name"
                    required
                    variant="outlined"
                    className="my-3 p-0"
                    inputRef={firstNameRef}
                ></TextField>
                <PhoneInput 
                  isValid={(value, country) => {
                    if (value.match(/12345/)) {
                      return 'Invalid value: '+value+', '+country.name;
                    } else if (value.match(/1234/)) {
                      return false;
                    } else {
                      return true;
                    }
                  }}
                  
                  onChange={(value,data,event,formattedValue) => handleOnChange(value,data,event,formattedValue)}  
                  inputStyle={{width: '100%'}}
                />

                <TextField 
                    type="email"
                    label="Emai-Id"
                    required
                    variant="outlined"
                    className="my-3 p-0"
                    inputRef={emailRef}
                ></TextField>
                <TextField 
                    type="password"
                    label="Password"
                    required
                    variant="outlined"
                    className="my-3 p-0"
                    inputRef={passwordRef}
                ></TextField>
                <TextField 
                    type="password"
                    label="Confirm Password"
                    required
                    variant="outlined"
                    className="my-3 p-0"
                    inputRef={confirmPasswordRef}
                ></TextField>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={termsAndConditions}
                        onChange={(e) => setTermsAndConditon(e.target.checked)}
                        name="term-and-condition"
                        color="primary"
                        required
                    />
                    }
                    label="I agree to Terms & Condition"
                />
                <Button variant="contained" color="primary" className="my-3 mx-auto" type="submit">Save And Continue</Button>
            </form>  
        </div>
    )
}
