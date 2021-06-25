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

    useEffect(async () => {
        try{
            let getSummaryResponse = await getSummary(token,searchQuery);
            if(getSummaryResponse){
                setCustomerData(getSummaryResponse.summary);
                setToken(getSummaryResponse.token);
            }
            else{
                setCustomerData([]);
                setToken("");
            }
        }catch(err){
            setCustomerData([]);
            setToken("")
        }
    },[])

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

    let HandleSearch = async (query) => {
        setSearchQuery(query)
        setCustomerData("loading");
        setToken("")
        try{
            let getSummaryResponse = await getSummary("",query);
            if(getSummaryResponse){
                setCustomerData(getSummaryResponse.summary);
                setToken(getSummaryResponse.token);
            }
            else{
                setCustomerData([]);
                setToken("");
            }
        }catch(err){
            setCustomerData([]);
            setToken("")
        }
    }

    let RefreshCustomerData = async () => {
        setCustomerData("loading");
        setToken("");
        try{
            let getSummaryResponse = await getSummary("",searchQuery);
            if(getSummaryResponse){
                setCustomerData(getSummaryResponse.summary);
                setToken(getSummaryResponse.token);
            }
            else{
                setCustomerData([]);
                setToken("");
            }
        }catch(err){
            setCustomerData([]);
            setToken("")
        }
    }

    let LoadMoreCustomers = async () => {
        setLoading(true);
        try{
            let getSummaryResponse = await getSummary(token);
            if(getSummaryResponse){
                setCustomerData(prev => [...prev,...getSummaryResponse.summary]);
                setToken(getSummaryResponse.token);
            }
        }catch(err){}
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
