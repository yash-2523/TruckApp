import React, { createContext, useState } from 'react'

export const TripContext = createContext();

export default function TripContextProvider(props) {

    const [tripPage,setTripPage] = useState(0);
    const [tripId,setTripId] = useState(false);
    const [editTrip, setEditTrip] = useState(false);

    return (
        <TripContext.Provider value={{TripPage: [tripPage,setTripPage], TripId: [tripId,setTripId], EditTrip: [editTrip,setEditTrip]}}>
            {props.children}
        </TripContext.Provider>
    )
}
