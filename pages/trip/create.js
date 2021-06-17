import { useEffect, useState } from "react";
import CreateTrip from "../../Components/Home/Trip/CreateTrip/CreateTrip";
import { currentUser } from "../../Services/AuthServices";


export default function Create(){

    const [user,setUser] = useState(currentUser.value);
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
            {!(user===null || user==="loading") && <CreateTrip />}
        </>
    )
}