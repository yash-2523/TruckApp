import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import CustomerTable from "../../Components/Home/dashboard/CustomerData/CustomerTable";
import Operations from "../../Components/Home/dashboard/CustomerData/Operations";
import { currentUser } from "../../Services/AuthServices";
import { getBalance, getSummary } from "../../Services/CustomerDataServices";


export default function DashBoard() {

    const [user,setUser] = useState(currentUser.value);
    const [balance,setBalance] = useState("");
    const [customerData,setCustomerData] = useState("loading");
    const [token,setToken] = useState("")
    const [loading,setLoading] = useState(false);
    const [searchQuery,setSearchQuery] = useState("");
    let RefreshPromise,LoadMorePromise;

    useEffect(() => {
        
        let promise = getSummary(token,searchQuery)
        
        promise.then(getSummaryResponse => {
            setCustomerData(getSummaryResponse.summary);
            setToken(getSummaryResponse.token);
        }).catch(err => {
            setCustomerData([]);
            setToken("");
        })

        return () => {
            API.cancel(promise);
            API.cancel(RefreshPromise)
            API.cancel(LoadMorePromise)
        }
    },[searchQuery])

    useEffect(() => {
        let AuthObservable = currentUser.subscribe((data) => {
        setUser(data);
        })
        return () => {
        AuthObservable.unsubscribe()
        }
    },[])

    useEffect(async () => {
        try{
            let balanceResponse = await getBalance();
            if(balanceResponse){
                setBalance(balanceResponse)
            }
        }catch(err){}
    },[])

    let HandleSearch = (query) => {
        setSearchQuery(query)
        setCustomerData("loading");
        setToken("")
    }

    let RefreshCustomerData = async () => {
        setCustomerData("loading");
        setToken("");

        RefreshPromise = getSummary(token,searchQuery)
        
        RefreshPromise.then(getSummaryResponse => {
            setCustomerData(getSummaryResponse.summary);
            setToken(getSummaryResponse.token);
        }).catch(err => {
            setCustomerData([]);
            setToken("");
        })

    }

    let LoadMoreCustomers = () => {
        setLoading(true);
        LoadMorePromise = getSummary(token);

        LoadMorePromise.then(getSummaryResponse => {
            setCustomerData(prev => [...prev,...getSummaryResponse.summary]);
            setToken(getSummaryResponse.token);
            setLoading(false);
        }).catch(err => {
            setLoading(false)
        })
    }

    return (
        <>
        {(user!==null && user!=="loading") && 
            <div className="w-100 h-100 px-lg-3 px-md-2 py-4 px-1">
                <Operations balance={balance} HandleSearch={HandleSearch} />
                <CustomerTable operations = {{customerData,token,LoadMoreCustomers, RefreshCustomerData, loading}} />
            </div>
        }
        </>
    )
}
