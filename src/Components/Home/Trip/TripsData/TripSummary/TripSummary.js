import { Accordion, AccordionDetails, AccordionSummary, Button, Fab, Icon, IconButton, Tooltip } from '@material-ui/core';
import { DeleteOutlined, EditOutlined, ExpandMoreOutlined, KeyboardBackspaceOutlined, LocalShippingOutlined } from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { TripContext } from '../../../../../Context/TripContext'
import { deleteTrip, getTripDetails } from '../../../../../Services/TripDataServices';
import '../style.scss'
import { ReactComponent as INRIcon} from '../svg/Inr.svg'
import { ReactComponent as PDFFileIcon} from '../svg/PdfFile.svg'
import AddPaymentMadeModal from './AddPaymentMadeModal';
import AddPaymentRecieveModal from './AddPaymentRecieveModal';

export default function TripSummary() {

    const { TripId, TripPage, EditTrip } = useContext(TripContext);
    const [tripId,setTripId] = TripId;
    const [tripPage, setTripPage] = TripPage;
    const [editTrip, setEditTrip] = EditTrip;
    const {setGlobalLoading} = useContext(GlobalLoadingContext);
    const [tripDetails,setTripDetails] = useState(false)
    const confirm = useConfirm();
    const [openPaymentReceiveModal,setOpenPaymentReceiveModal] = useState(false);
    const [openPaymentMadeModal,setOpenPaymentMadeModal] = useState(false);
    const [paymentsMade,setPaymentsMade] = useState({
        totalPaymentMade: parseInt(0),
        transactions: []
    })
    const [paymentsReceived,setPaymentsReceived] = useState({
        totalPaymentReceived: parseInt(0),
        transactions: [],
    })
    const [settleAmount,setSettleAmount] = useState(false);

    let ClosePaymentReceiveModal = () => {
        setSettleAmount(false);
        setOpenPaymentReceiveModal(false);
    }
    let ClosePaymentMadeModal = () => {
        setOpenPaymentMadeModal(false);
    }

    useEffect(async () => {
        
        if(!tripId){
            setTripPage(0);
        }

        TripDetails()

        return () => {
            setTripId(false);
        }
    },[])

    let TripDetails = async () => {
        try{
            let TripDetailsResponse = await getTripDetails(tripId);
            console.log(TripDetailsResponse)
            
            if(TripDetailsResponse){
                setTripDetails(TripDetailsResponse);

                let tempTotalPaymentMade = parseInt(0);
                let tempPaymentMadeTransactions = [];

                let tempTotalPaymentRecieved = parseInt(0);
                let tempPaymentRecievedTransactions = [];

                TripDetailsResponse.transactions.map(transaction => {
                    if(parseInt(transaction.amount) < parseInt(0)){
                        tempTotalPaymentMade += parseInt(Math.abs(parseInt(transaction.amount)));
                        tempPaymentMadeTransactions.push(
                            <div className="w-100 d-flex justify-content-between align-items-center">
                                <span>{getDate(transaction.date)}</span>
                                <span>{transaction.reason}</span>
                                <span><INRIcon /> {Math.abs(parseInt(transaction.amount))}</span>
                            </div>
                        )
                    }
                    else{
                        tempTotalPaymentRecieved += parseInt(Math.abs(parseInt(transaction.amount)));
                        tempPaymentRecievedTransactions.push(
                            <div className="w-100 d-flex justify-content-between align-items-center">
                                <span>{getDate(transaction.date)}</span>
                                <span>{transaction.reason}</span>
                                <span><INRIcon /> {Math.abs(parseInt(transaction.amount))}</span>
                            </div>
                        )
                    }
                })

                setPaymentsMade({
                    totalPaymentMade: tempTotalPaymentMade,
                    transactions: tempPaymentMadeTransactions
                })

                setPaymentsReceived({
                    totalPaymentReceived: tempTotalPaymentRecieved,
                    transactions: tempPaymentRecievedTransactions
                })
                
            }
            else{
                toast.error("Unable to get Trip");
                setTripId(false);
                setTripPage(0);
            }
        }catch(err){
            console.log(err)
            toast.error("Unable to get Trip");
            setTripId(false);
            setTripPage(0);
        }
    }

    let HandleDeleteTip = async () => {
        if(!tripId){
            setTripPage(0);
        }
        confirm({description: "This will permanently delete the Trip"}).then(async () => {
            setGlobalLoading(true);
            try{
                let deleteTripResponse = await deleteTrip(tripId);
                if(deleteTripResponse && deleteTripResponse.success){
                    setTripId(false);
                    setTripPage(0);
                    toast.success("Trip Deleted");
                }
                else{
                    toast.success("Unable To Delete");
                }
                setGlobalLoading(false);
            }catch(err){
                toast.success("Unable To Delete");
                setGlobalLoading(false);
            }
        }).catch(() => {

        })
        
    }

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds)).format('DD-MM-YYYY')
    }

    let HandleEditTrip = async () => {
        if(!tripId){
            setTripPage(0);
        }
        await setEditTrip(tripDetails);
        setTripId(false);
        setTripPage(1);
    }

    return (
        <>
            <Button className="mt-4" startIcon={<KeyboardBackspaceOutlined />} onClick={() => setTripPage(0)}>Trips</Button>
            {tripDetails===false ? <div className="w-100 mt-5 py-3 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
                :
             <div className="px-lg-3 px-md-2 px-1 pb-3">
                <table className="w-100 rounded-3 position-relative mt-4 table px-2">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Start Date</th>
                            <th>Party Name</th>
                            <th>Truck No</th>
                            <th>Route</th>
                            <th>Status</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr> 
                            <td><Fab className={tripDetails.status} ><LocalShippingOutlined className={tripDetails.status} /></Fab></td>
                            <td>{getDate(tripDetails.trip_start_date)}</td>
                            <td>{tripDetails.customer_name}</td>
                            <td>{tripDetails.truck_number}</td>
                            <td><p>{tripDetails.origin_city}</p><p>{tripDetails.destination_city}</p></td>
                            <td><span className={tripDetails.status}>{tripDetails.status}</span></td>
                            <td><Icon className="mx-1"><INRIcon className="mt-1" /></Icon>  {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived))}</td>
                        </tr>
                    </tbody>

                    <tr>
                        <td colSpan="7" className="text-end">
                            <Tooltip title="Edit Trip" arrow><IconButton className="mx-1" onClick={HandleEditTrip}><EditOutlined /></IconButton></Tooltip>
                            <Tooltip title="Delete Trip" arrow><IconButton className="mx-1" onClick={HandleDeleteTip}><DeleteOutlined /></IconButton></Tooltip> 
                            {tripDetails.status!=="settled" && <Button color="default" size="small" style={{padding: '0.2rem'}} onClick={() => {
                                setSettleAmount(parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived)));
                                setOpenPaymentReceiveModal(true);
                            }} variant="outlined">Mark Settled</Button>}
                        </td>
                    </tr>
                </table>
                
                <div className="mt-lg-3 mt-md-2 mt-1 py-4 px-2 rounded-3 d-flex align-items-center flex-wrap payment-methods-container">
                    <Button variant="outlined" className="mr-3" color="primary" onClick={() => setOpenPaymentMadeModal(true)}>Add Payment Made</Button>
                    <Button variant="outlined" color="primary" onClick={() => setOpenPaymentReceiveModal(true)}>Add Payment Recieved</Button>
                </div>

                <div className="mt-lg-3 mt-md-2 mt-3 py-4 rounded-3 d-flex align-items-center flex-column trip-revenue-details px-lg-5 px-md-4 px-2">
                    <div className="w-100 d-flex justify-content-between align-items-center px-5">
                        <b>Revenue</b>
                        <span className="text-primary"><INRIcon /> {tripDetails.freight_amount}</span>
                    </div>
                    
                    <Accordion className="w-100 mt-3 mx-0 total-charges shadow-none">
                        <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className="w-100 m-0"
                        >
                            <div className="w-100 d-flex justify-content-between align-items-center"><h6><b>Payments Made</b></h6> <span><INRIcon /> {paymentsMade.totalPaymentMade}</span></div>
                        </AccordionSummary>
                        <AccordionDetails className="d-flex flex-column">{paymentsMade.transactions}</AccordionDetails>
                    </Accordion>
                    <Accordion className="w-100 mx-0 total-charges shadow-none">
                        <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        className="w-100 m-0"
                        >
                            <div className="w-100 d-flex justify-content-between align-items-center"><h6><b>Payments Received</b></h6> <span><INRIcon /> {paymentsReceived.totalPaymentReceived}</span></div>
                        </AccordionSummary>
                        <AccordionDetails className="d-flex flex-column">{paymentsReceived.transactions}</AccordionDetails>
                    </Accordion>
                    <div className="w-100 px-1 my-3 dashed-border"></div>
                    <div className="w-100 mt-2 d-flex justify-content-between align-items-center revenue-profit px-5">
                        <b>Profit</b>
                        <span className="text-success"><INRIcon /> {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsMade.totalPaymentMade))}</span>
                    </div>
                </div>
            
                <div className="mt-lg-3 mt-md-2 mt-3 py-4 rounded-3 d-flex align-items-center flex-column trip-bill-details px-lg-5 px-md-4 px-2">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <p className="col-4 text-start">Freight Amount</p>
                        <span className="col-4 text-end"><INRIcon /> {tripDetails.freight_amount}</span>
                    </div>
                    <div className="w-100 px-1 my-3 dashed-border"></div>
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <p className="col-4 text-start">Balance</p>
                        <span className="col-4 text-end text-primary primary"><INRIcon /> {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived))}</span>
                    </div>

                    <Button className="mt-5" startIcon={<PDFFileIcon />} color="primary" variant="contained">View Bill</Button>
                </div>
            
                {openPaymentReceiveModal && <AddPaymentRecieveModal settleAmount={settleAmount} UpdateTripDetails={TripDetails} tripDetails={{...tripDetails,trip_id: tripId}} ClosePaymentReceiveModal={ClosePaymentReceiveModal} />}
                {openPaymentMadeModal && <AddPaymentMadeModal UpdateTripDetails={TripDetails} tripDetails={{...tripDetails,trip_id: tripId}} ClosePaymentMadeModal={ClosePaymentMadeModal} />}
            </div> }

            
        </>
    )
}
