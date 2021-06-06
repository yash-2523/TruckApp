import { Button, TextField } from '@material-ui/core'
import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthModalContext } from '../../Context/AuthModalContext';

export default function SignInEmail() {

    const { AuthMethod , SignInStage , SignUpStage } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;

    return (
        <div className="mt-4 px-3 py-5">
            <form className="d-flex flex-column">
                <TextField 
                    type="email"
                    label="Email-Id"
                    variant="outlined"
                    className="my-3 p-0"
                    
                ></TextField>
                <TextField 
                    type="password"
                    label="Password"
                    variant="outlined"
                    className="my-3"
                ></TextField>

                <Button variant="contained" color="primary" className="my-3 mx-auto" type="submit">Sign In</Button>
            </form>   

            <p className="text-center text-secondary">Or</p>

            <Link to="#"><p className="text-center text-primary" onClick={() => setSignInStage(1)}>Sign In with Otp</p></Link> 
        </div>
    )
}
