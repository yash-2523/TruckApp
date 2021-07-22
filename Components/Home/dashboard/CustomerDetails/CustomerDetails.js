import { SentimentDissatisfiedOutlined, LocalShippingOutlined } from '@material-ui/icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { getTrips } from '../../../../Services/TripDataServices'
import balanceInfoStyles from '../../../../styles/CustomerBalanceInfo.module.scss'
import INRIcon from '../../svg/InrIcon.svg'
import TotalBalanceIcon from './svg/TotalBalance.svg'
import { Button, Fab } from '@material-ui/core'
import { VscFilePdf } from "react-icons/vsc";
import tripStyles from '../../../../styles/TripsData.module.scss'
import Link from 'next/link'
import moment from 'moment'
import TripPdfModal from './TripPdfModal'

export default function CustomerDetails() {

    const router = useRouter();
    const customerId = router.query.id;
    const [customerTrips, setCustomerTrips] = useState("loading")
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const customerData = JSON.parse(window.sessionStorage.getItem('customer')) || null
    const [tripPdfModalOpen, setTripPdfModalOpen] = useState(false)

    useEffect(() => {
        getTripContainerScaling();

        window.addEventListener('resize', getTripContainerScaling);

        return () => {
            window.removeEventListener('resize', getTripContainerScaling)
        }
    }, [])

    useEffect(async () => {
        if (customerData === null || customerData === undefined) {
            router.push('/dashboard');
            return;
        }
        try {
            let customerTripResponse = await getTrips(token, "all", "", "", customerId, true);
            if (customerTripResponse) {
                setCustomerTrips(customerTripResponse.trips);
                setToken(customerTripResponse.token)
            } else {
                setCustomerTrips([]);
                setToken("")
            }
        } catch (err) {
            setCustomerTrips([]);
            setToken("")
        }

        return () => {
            window.sessionStorage.removeItem('customer')
        }
    }, [])

    let LoadMoreTrips = async () => {
        setLoading(true);
        try {
            let customerTripResponse = await getTrips(token, "all", "", "", customerId);
            if (customerTripResponse) {
                setCustomerTrips(prev => [...prev, ...customerTripResponse.trips]);
                setToken(customerTripResponse.token)
            } else {
                setToken("")
            }
            setLoading(false);
        } catch (err) {
            setCustomerTrips([]);
            setToken("")
            setLoading(false)
        }
    }

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }

    let getTripContainerScaling = () => {
        let TotalBalanceContainer = document.querySelector('#total-balance');
        let tableRows = document.querySelectorAll("tr");
        let table = document.querySelector("#table");
        let mainContainer = document.querySelector("#main-container")
        if (tableRows !== undefined && table !== null && tableRows.length > 0) {
            if (mainContainer.offsetWidth < tableRows[0].offsetWidth) {
                for (let i = 0; i < tableRows.length; i++) {
                    table.style.borderSpacing = "0rem 0rem"
                    tableRows[i].style.transform = `scale(${(mainContainer.offsetWidth / tableRows[i].offsetWidth) - 0.03})`
                    tableRows[i].style.transformOrigin = "0% 0%";

                }
            }
            else {
                for (let i = 0; i < tableRows.length; i++) {
                    tableRows[i].style.transform = `scale(1)`
                    tableRows[i].style.transformOrigin = "0% 0%"
                    table.style.borderSpacing = "0rem 0.8rem"
                }
            }

        }

        if (TotalBalanceContainer !== null && TotalBalanceContainer !== undefined) {
            if (window.innerWidth < "370") {
                TotalBalanceContainer.style.transform = `scale(${window.innerWidth / 370})`;
                TotalBalanceContainer.style.transformOrigin = "0% center"
            } else {
                TotalBalanceContainer.style.transform = `scale(1)`;
                TotalBalanceContainer.style.transformOrigin = "0% 0%"
            }
        }


    }

    return (
        <>
            {customerTrips === "loading" ? <div className="mt-5 text-center"><PulseLoader margin={2} size={15} color="#36D7B7" /></div>
                :
                <div id="customer-details">
                    <div className="d-flex">
                        <span id="total-balance" className={`d-flex justify-content-center align-items-center px-5 py-1 position-relative rounded-3 ${balanceInfoStyles['balance-info']}`}>
                            <i className={`position-absolute ${balanceInfoStyles['balance-info-icon']}`}><TotalBalanceIcon /></i>
                            <span className={`d-flex justify-content-between flex-column align-items-center mx-2`}>
                                <span><INRIcon className="mb-1" /> {`${customerData.balance}/-`}</span>
                                <p>Total Balance</p>
                            </span>
                        </span>
                        <button onClick={() => setTripPdfModalOpen(true)} className={`ms-2 ${balanceInfoStyles.card_button}`} style={{ background: '#FFF1E0', border: '1px solid #FFAF4E', color: '#FFAF4E' }}>
                            <VscFilePdf size={28} />
                            <p>PDF</p>
                        </button>
                    </div>



                    {customerTrips.length === 0 ? <h4 className={`text-center mt-5 no-data-found`}>No Data Found <SentimentDissatisfiedOutlined /></h4>
                        :

                        <table className={`w-100 rounded-3 position-relative mt-4 ${tripStyles['table']} px-lg-2 px-md-2 px-1 mx-auto`} id="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "1%" }}></th>
                                    <th>Start Date</th>
                                    <th>Party Name</th>
                                    <th>Truck No</th>
                                    <th>Route</th>
                                    <th>Status</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerTrips.length && customerTrips.map(data =>
                                    <Link href={`/trip/${data.trip_id}`} key={data.trip_id}>
                                        <tr style={{ cursor: "pointer" }} >
                                            <td style={{ width: "1%" }}><Fab className={tripStyles[data.status]} ><LocalShippingOutlined className={tripStyles[data.status]} /></Fab></td>
                                            <td>{getDate(data.trip_start_date)}</td>
                                            <td>{data?.customer_name || ""}</td>
                                            <td>{data.truck_id === "" ? <p className="text-danger">NA</p> : data.truck_id}</td>
                                            <td className="d-flex justify-content-center align-items-center">
                                                <div className="d-flex py-1 flex-column justify-content-between align-items-start m-auto">
                                                    <div className="d-flex align-items-center justify-content-start">
                                                        <span className={tripStyles['dot']} style={{ backgroundColor: "rgba(45, 188, 83, 1)" }}></span>
                                                        <span className="mx-1">{data.origin_city}</span>
                                                    </div>
                                                    <span className={tripStyles["vertical-line"]}></span>
                                                    <div className="d-flex align-items-center justify-content-start">
                                                        <span className={tripStyles["dot"]} style={{ backgroundColor: "rgba(231, 104, 50, 1)" }}></span>
                                                        <span className="mx-1">{data.destination_city}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className={tripStyles[data.status]} style={{ background: "transparent" }}><li>{data.status.replace('_', ' ')}</li></span></td>
                                            <td><INRIcon className="inr-icon" /> {data.to_receive}</td>
                                        </tr>
                                    </Link>
                                )}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        {loading ? <PulseLoader size={15} margin={2} color="#36D7B7" /> : (token !== "" && token !== "[]") && <Button onClick={LoadMoreTrips}>Load More</Button>}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    }

                </div>
            }

            <TripPdfModal open={tripPdfModalOpen} onClose={() => setTripPdfModalOpen(false)} customerName={customerData.name} />
        </>
    )
}
