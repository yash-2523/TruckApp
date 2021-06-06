import React, { useEffect, useState } from 'react'

export default function useTrip() {

    const [tripData,setTripData] = useState([]);
    
    useEffect(() => {
        // Fetch All the data from backend
        // Use axios for more optimization
        // Then setTripData(data recieved);
    },[])

    let HandleOperation = (search,months,status) => {
        // Fetch data from backend as per the filters
        // Use axios for more optimization
        // Then setTripData(data recieved);
    }
    
    return ({
        tripData,HandleOperation
    })
}
