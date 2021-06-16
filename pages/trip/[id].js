import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TripSummary from "../../Components/Home/Trip/TripsData/TripSummary/TripSummary";
import { currentUser } from "../../Services/AuthServices";

export default function TripSumary(){

    const [user,setUser] = useState(currentUser.value);
    const router = useRouter();
    useEffect(() => {
        let AuthObservable = currentUser.subscribe((data) => {
        setUser(data);
        })
        return () => {
        AuthObservable.unsubscribe()
        }
    },[])

    return (
        <>
            {!(user===null || user==="loading") && <TripSummary />}
        </>
    )
}