import {useState,useEffect} from 'react'


import Operations from '../../Components/Home/Truck/Operations'
import TruckTable from '../../Components/Home/Truck/TruckTable'

import { currentUser } from '../../Services/AuthServices'
import {getAllTrucks} from '../../Services/TruckServices'
import styles from '../../styles/Truck.module.scss'



export default function Truck() {

    const [user,setUser] = useState(currentUser.value);
    const [trucks,setTrucks] = useState('loading');
    const props = {trucks}

    let getTrucks = async () => {
        try{
            let allTrucks = await getAllTrucks();
            if(allTrucks){
                setTrucks(allTrucks);
            }
        }
        catch(err){
        }
    }

    useEffect(async () => {
        getTrucks()
    },[])

    return (
        <>
        {(user!==null && user!=="loading") && 
            <div className={`w-100 h-100 px-lg-3 px-md-2 px-1 `}>
                <Operations {...props}/>
                <TruckTable {...props}/>
            </div>
        }
        </>
    )
}
