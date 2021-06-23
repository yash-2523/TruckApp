import { SentimentDissatisfiedOutlined } from '@material-ui/icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { getTrips } from '../../../../Services/TripDataServices'
import balanceInfoStyles from '../../../../styles/CustomerBalanceInfo.module.scss'
import INRIcon from '../../svg/InrIcon.svg'
import TotalBalanceIcon from './svg/TotalBalance.svg'
import Trip from './Trip'
import { Button } from '@material-ui/core'
import styles from '../../../../styles/CustomerDetails.module.scss'

export default function CustomerDetails() {

    const router = useRouter();
    const customerId = router.query.id;
    const [customerTrips,setCustomerTrips] = useState("loading")
    const [token,setToken] = useState("");
    const [loading,setLoading] = useState(false);
    const balance = window.sessionStorage.getItem('balance') || null

    useEffect(() => {
        getTripContainerScaling();

        window.addEventListener('resize',getTripContainerScaling);

        return () => {
            window.removeEventListener('resize',getTripContainerScaling)
        }
    },[]) 

    useEffect(async () => {
        if(balance === null || balance===undefined){
            router.push('/dashboard');
            return;
        }
        try{
            let customerTripResponse = await getTrips(token,"all","","",customerId);
            if(customerTripResponse){
                setCustomerTrips(customerTripResponse.trips);
                setToken(customerTripResponse.token)
            }else{
                setCustomerTrips([]);
                setToken("")
            }
        }catch(err){
            setCustomerTrips([]);
            setToken("")
        }

        return () => {
            window.sessionStorage.removeItem('balance')
        }
    },[])
    
    let LoadMoreTrips = async () => {
        setLoading(true);
        try{
            let customerTripResponse = await getTrips(token,"all","","",customerId);
            if(customerTripResponse){
                setCustomerTrips(prev => [...prev,...customerTripResponse.trips]);
                setToken(customerTripResponse.token)
            }else{
                setToken("")
            }
            setLoading(false);
        }catch(err){
            setCustomerTrips([]);
            setToken("")
            setLoading(false)
        }
    }

    

    let getTripContainerScaling = () => {
        let tripDetailsContainer = document.querySelectorAll('.trip-details-container');
        
        let TotalBalanceContainer = document.querySelector('#total-balance');
        if(tripDetailsContainer!==null && tripDetailsContainer!==undefined && tripDetailsContainer.length!==0){
            if(tripDetailsContainer[0].offsetWidth < "600"){
                for(let i=0;i<tripDetailsContainer.length;i++){
                    tripDetailsContainer[i].firstChild.style.transform = `scale(${Math.min(1,parseFloat(tripDetailsContainer[0].offsetWidth / 600))})`;
                    tripDetailsContainer[i].firstChild.style.transformOrigin = `0% center`;
                    tripDetailsContainer[i].lastChild.style.transform = `scale(${Math.min(1,parseFloat(tripDetailsContainer[0].offsetWidth / 300))})`;
                    tripDetailsContainer[i].lastChild.style.transformOrigin = `0% 0%`;
                }
                
            }else{
                for(let i=0;i<tripDetailsContainer.length;i++){
                    for(let j=0;j<tripDetailsContainer[i].children.length;j++){
                        tripDetailsContainer[i].children[j].style.transform = `scale(1)`;
                        tripDetailsContainer[i].children[j].style.transformOrigin = `0% center`;
                    }
                }
            }
        }

        if(TotalBalanceContainer!==null && TotalBalanceContainer!==undefined){
            if(window.innerWidth < "370"){
                TotalBalanceContainer.style.transform = `scale(${window.innerWidth / 370})`;
                TotalBalanceContainer.style.transformOrigin = "0% center"
            }else{
                TotalBalanceContainer.style.transform = `scale(1)`;
                TotalBalanceContainer.style.transformOrigin = "0% 0%"
            }
        }

        
    }

    return (
        <>
        {customerTrips==="loading" ? <div className="mt-5 text-center"><PulseLoader margin={2} size={15} color="#36D7B7" /></div>
            :
            <div id="customer-details">
                <span id="total-balance" className={`d-flex justify-content-center align-items-center px-5 py-1 position-relative rounded-3 ${balanceInfoStyles['balance-info']}`}>
                    <i className={`position-absolute ${balanceInfoStyles['balance-info-icon']}`}><TotalBalanceIcon /></i>
                    <span className={`d-flex justify-content-between flex-column align-items-center mx-2`}>
                        <span><INRIcon className="mb-1" /> {`${balance}/-`}</span>
                        <p>Total Balance</p>
                    </span>
                </span>

                {customerTrips.length === 0 ? <h4 className={`text-center mt-5 ${styles['no-trip-found']}`}>No Data Found <SentimentDissatisfiedOutlined /></h4>
                    :

                    <div className={`d-flex flex-column mt-4 ${styles['all-trips-container']}`}>
                        {customerTrips.map(trip => 
                            <Trip key={trip.trip_id} trip={trip} />
                        )}
                        <div className="text-center">
                            {loading ? <PulseLoader margin={2} size={15} color="#36D7B7" /> : ((token!=="" && token!=="[]") && <Button onClick={LoadMoreTrips}>Load More</Button>)}
                        </div>
                    </div>
                }
                
            </div>
        }
        </>
    )
}
