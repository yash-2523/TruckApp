import React, { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import { getTrips } from '../../../../Services/TripDataServices';

export default function useTrip() {

    const [tripData,setTripData] = useState([]);
    const [status,setStatus] = useState("all");
    const [token,setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const datas = [];

    for(let i=0;i<100;i++){
        datas.push({
            startDate: `05-20-202${i+1}`,
            partyName: "Rajkappor",
            truckNo: "GM-34-BG-657H",
            route: ["Gurugram","Noida"],
            status: "started",
            balance: "7,250"
        })
    }   
    
    useEffect(async () => {
        setLoading(true);
        try{
            let data = await getTrips("",status);
            if(data){
                setTripData(data.trips);
                setToken(data.token);
            }
            setLoading(false);
        
        }catch(err){
            setLoading(false);
        }

        return () => {
            setToken("")
        }
    },[])

    let HandleOperation = (search,months,status) => {
        // Fetch data from backend as per the filters
        // Use axios for more optimization
        // Then setTripData(data recieved);
    }

    let LoadMoreTrips = async () => {
        setLoading(true);
        try{
            let data = await getTrips(token,status);
            if(data){
                setTripData([...tripData,...data.trips]);
                setToken(data.token);
            }
            setLoading(false);
        
        }catch(err){
            setLoading(false);
        }
    }

    let RefreshTrips = async () => {
        setLoading(true);
        setTripData([])
        setToken("");
        try{
            let data = await getTrips("",status);
            if(data){
                setTripData(data.trips);
                setToken(data.token);
            }
            setLoading(false);
        
        }catch(err){
            setLoading(false);
        }
    }
    
    return ({
        tripData,HandleOperation, token,loading, LoadMoreTrips, RefreshTrips
    })
}
