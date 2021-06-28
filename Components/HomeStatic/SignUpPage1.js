import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { CreateUser } from '../../Services/AuthServices';

export default function SignUpPage1(props) {

    const styles = props.styles 
    const {  SignInData } = useContext(AuthModalContext);
    const [fullName,setFullName] = useState("");
    const [email,setEmail] = useState("");
    const [role,setRole] = useState("")
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
        if(role===""){
            toast.error("All Fields are neccessary")
            return
        }
        
        setGlobalLoading(true)

        let createUserResponse = await CreateUser(fullName, signInData.phoneNumber,roleMapping[role],email || "");

        if(!createUserResponse){
            toast.error("Something Went Wrong, Please Try Again !")
        }

        setGlobalLoading(false);

        
    }
    return (
        <div className="mt-4 px-4 py-5">
            <form onSubmit={(e) => HandleSubmit(e)} className="d-flex flex-column align-items-center">
                <TextField 
                    type="text"
                    variant="outlined"
                    label="Full Name"
                    required
                    error={fullName === ""}
                    className="my-3 p-0 w-100"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                ></TextField>

                <TextField 
                    type="email"
                    variant="outlined"
                    label="Emai-Id"
                    className="my-3 p-0 w-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></TextField>

                <TextField 
                    label="Select Role"
                    variant="outlined"
                    inputProps = {{list: "roles"}}
                    name="roles"
                    className="my-3 p-0 w-100"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    error={role === ""}
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
                    
                    label={<p className={`${styles['request-otp-text']}`}>I agree to <a className="text-primary">Terms & Condition</a></p>}
                />
                
                <Button variant="contained" color="primary" className={`my-3 w-100 mx-auto ${styles['primary-button']}`} type="submit">Sign Up</Button>
            </form>  
        </div>
    )
}
