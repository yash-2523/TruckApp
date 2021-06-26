import {TextField , Button, Avatar} from '@material-ui/core'
import { useState, useEffect } from 'react'

import styles from '../../styles/Profile.module.scss'
import { currentUser,getUser } from '../../Services/AuthServices';
import { updateUser } from '../../Services/ProfileServices';

const Profile = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [companyName,setCompanyName] = useState('')
    const [user,setUser] = useState(currentUser.value);
    
    const [opacity,setOpacity] = useState(0)       //user details updated successfully 

    useEffect(() => {
        const AuthObservable = currentUser.subscribe((data) => {
            setUser(data);
            setName(data.name)
            setEmail(data.email)
            setCompanyName(data.business_name)
        })
        
        return () => {
            AuthObservable.unsubscribe();
        }
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault()
        updateUser(name,email,companyName).then(x=>{
            if (x.success){
                getUser()
                setOpacity(1)
            setTimeout(() => {
                setOpacity(0)
            },5000)
            }
        })

    }



    return ( 
        <div className="w-100 p-3">
            <form onSubmit={e=>handleSubmit(e)} className="w-100 d-flex justify-content-between custom_container p-5">
                <div className={`d-flex flex-column align-items-center ${styles.col_1}`}>
                    <Avatar className={`${styles.dp}`}>{user && user.name?.split(' ').map(word => word.charAt(0).toUpperCase())}</Avatar>
                    <TextField className={`${styles.input}`} onChange={e=>{setName(e.target.value)}} variant="outlined" value={name} required  label="Name" fullWidth/>
                    <TextField className={`${styles.input}`} onChange={e=>{setEmail(e.target.value)}} variant="outlined" value={email} required  label="Email" type="email" fullWidth/>
                    <TextField className={`${styles.input}`} onChange={e=>{setCompanyName(e.target.value)}} variant="outlined" value={companyName} label="Company Name" fullWidth/>
                    <TextField className={`${styles.input}`}  label="Phone" value={`${user.phone}`} variant="outlined"  fullWidth disabled/>
                </div>
                <div className={`d-flex flex-column justify-content-end align-items-center ${styles.col_2}`}>
                    <div className={`d-flex flex-column align-items-center mb-5 ${styles.success}`} style={{opacity: opacity}}>
                        <img src="/success.png" alt="successful" />
                        <div>User Details updated successfully</div>
                    </div>
                    <Button type="submit" variant="contained" color="primary" size='large'>Update</Button>
                </div>
            </form>
        </div>

     );
}
 
export default Profile;