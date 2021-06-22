import { useEffect, useState } from "react";
import { currentUser } from "../../../Services/AuthServices";
import CustomerDetails from "../../../Components/Home/dashboard/CustomerDetails/CustomerDetails";

export default function Customer(){
    const [user,setUser] = useState(currentUser.value)
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
            {(user!==null && user!=="loading") && 
                <div className="w-100 h-100 px-lg-3 px-md-2 py-4 px-1">
                    <CustomerDetails />
                </div>
            }
        </>
    )
}