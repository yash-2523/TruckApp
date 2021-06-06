import React, { createContext, useState } from 'react'

export const TripContext = createContext();

export default function TripContextProvider(props) {

    const [tripPage,setTripPage] = useState(0);

    return (
        <TripContext.Provider value={{TripPage: [tripPage,setTripPage]}}>
            {props.children}
        </TripContext.Provider>
    )
}
