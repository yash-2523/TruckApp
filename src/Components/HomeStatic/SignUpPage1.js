import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import React from 'react'
import { useContext } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2'
import { AuthModalContext } from '../../Context/AuthModalContext';
import {toast} from 'react-toastify';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { CreateUser } from '../../Services/AuthServices';

export default function SignUpPage1() {

    const { SignInStage, SignInData } = useContext(AuthModalContext);
    const fullNameRef = useRef("");
    const emailRef = useRef("");
    const roleRef = useRef("")
    const [termsAndConditions,setTermsAndConditon] = useState(false);
    const [signInData,setSignInData] = SignInData;
    const { setGlobalLoading } = useContext(GlobalLoadingContext)

    const roleMapping = {
        "Transporter": "party",
        "Broker": "broker",
        "FleetOwner": "fleet_owner"
    }

    let HandleSubmit = async (e) => {
        e.preventDefault();
        if(roleRef.current.value===""){
            toast.error("All Fields are neccessary")
            return
        }
        
        setGlobalLoading(true)

        let createUserResponse = await CreateUser(fullNameRef.current.value, signInData.phoneNumber,roleMapping[roleRef.current.value],emailRef.current.value || "");

        if(!createUserResponse){
            toast.error("Something Went Wrong, Please Try Again !")
        }

        setGlobalLoading(false);

        
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
                    inputRef={fullNameRef}
                ></TextField>

                <TextField 
                    type="email"
                    label="Emai-Id"
                    variant="outlined"
                    className="my-3 p-0"
                    inputRef={emailRef}
                    required
                ></TextField>

                <TextField 
                    label="Select Role"
                    inputProps = {{list: "roles"}}
                    name="roles"
                    inputRef = {roleRef}
                    required
                    autoComplete={"off"}
                />

                <datalist id="roles">
                    <option value="Transporter"></option>
                    <option value="FleetOwner"></option>
                    <option value="Broker"></option>
                </datalist>
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
                <Button variant="contained" color="primary" className="my-3 mx-auto" type="submit">Sign Up</Button>
            </form>  
        </div>
    )
}
