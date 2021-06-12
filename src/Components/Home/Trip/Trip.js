import React, { useContext, useEffect } from 'react'
import { TripContext } from '../../../Context/TripContext'
import CreateTrip from './CreateTrip/CreateTrip'
import TripsData from './TripsData/TripsData'
import TripSummary from './TripsData/TripSummary/TripSummary';

export default function Trip() {
    const {TripPage} = useContext(TripContext);
    const [tripPage,setTripPage] = TripPage;

    const Component = [
        <TripsData />,
        <CreateTrip />,
        <TripSummary />
    ]
    useEffect(() => {
        return () => {
            setTripPage(0)
        }
    },[])
    return (
        <>
            {Component[tripPage]}
        </>
    )
}
