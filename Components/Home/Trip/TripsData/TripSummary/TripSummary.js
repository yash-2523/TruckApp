import { Accordion, AccordionDetails, AccordionSummary, Button, Fab, Icon,Stepper,Step,StepLabel,withStyles,StepConnector } from '@material-ui/core';
import { CheckBoxRounded, DeleteOutlined, EditOutlined, ExpandMoreOutlined, LocalShippingOutlined, CheckBoxOutlineBlankRounded } from '@material-ui/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { deleteTrip, getBill, getTripDetails } from '../../../../../Services/TripDataServices';
import styles from '../../../../../styles/TripsData.module.scss';
import ConfirmDialog from '../../../../ConfirmDialog';
import INRIcon from '../../../svg/InrIcon.svg';
import PDFFileIcon from '../svg/PdfFile.svg';
import AddPaymentMadeModal from './AddPaymentMadeModal';
import AddPaymentRecieveModal from './AddPaymentRecieveModal';

export default function TripSummary() {
    const router = useRouter();
    const tripId = router.query.id;
    const {setGlobalLoading} = useContext(GlobalLoadingContext);
    const [tripDetails,setTripDetails] = useState(false)
    const [openPaymentReceiveModal,setOpenPaymentReceiveModal] = useState(false);
    const [openPaymentMadeModal,setOpenPaymentMadeModal] = useState(false);
    const [openConfirmDialog,setOpenConfirmDialog] = useState(false);
    const TripSteps = [
        {
            label: "Started",
            checked: true,
            helperText: "05-20-2021" 
        },
        {
            label: "Completed",
            checked: true
        },
        {
            label: "POD Received",
            checked: false
        },
        {
            label: "POD Submitted",
            checked: false
        },
        {
            label: "Setteld",
            checked: false
        },
    ]
    const [paymentsMade,setPaymentsMade] = useState({
        totalPaymentMade: parseInt(0),
        transactions: []
    })
    const [paymentsReceived,setPaymentsReceived] = useState({
        totalPaymentReceived: parseInt(0),
        transactions: [],
    })
    const [settleAmount,setSettleAmount] = useState(false);

    let CloseConfirmDialog = () => {
        setOpenConfirmDialog(false)
    }


    let ClosePaymentReceiveModal = () => {
        setSettleAmount(false);
        setOpenPaymentReceiveModal(false);
    }
    let ClosePaymentMadeModal = () => {
        setOpenPaymentMadeModal(false);
    }

    let getTableScaling = () => {
        let tableRows = document.querySelectorAll("tr");
        let table = document.querySelector("#table");
        let mainContainer = document.querySelector("#main-container")
        if(tableRows !== undefined && table!==null && tableRows.length > 0){
            if(mainContainer.offsetWidth < tableRows[0].offsetWidth){
                for(let i=0;i<tableRows.length;i++){
                    tableRows[i].style.transform = `scale(${(mainContainer.offsetWidth / tableRows[i].offsetWidth) - 0.03})`
                    tableRows[i].style.transformOrigin = "0% center"
                    table.style.borderSpacing = "0rem 0rem"
                }
            }
            else{
                for(let i=0;i<tableRows.length;i++){
                    tableRows[i].style.transform = `scale(1)`
                    tableRows[i].style.transformOrigin = "0% center"
                    table.style.borderSpacing = "0rem 0.8rem"
                }
            }
            
        }
        
    }

    useEffect(() => {
        getTableScaling();

        window.addEventListener('resize',getTableScaling)

        return () => {
            window.removeEventListener('resize',getTableScaling)
        }
    },[])

    useEffect(async () => {
        
        if(!tripId){
            router.push({pathname:'/trip'});
        }

        TripDetails()
    },[])

    const QontoConnector = withStyles({
        alternativeLabel: {
          top: 10,
          left: 'calc(-50% + 16px)',
          right: 'calc(50% + 16px)',
        },
        active: {
          '& $line': {
            borderTop: "1px solid #784af4",
            width: "100%"
          },
        },
        completed: {
          '& $line': {
            borderColor: '#784af4',
            borderStyle: 'solid',
          },
        },
        line: {
          borderTop: "1px dashed #d5d5da",
          width: "100%" 
        },
      })(StepConnector);

    let TripDetails = async () => {
        try{
            let TripDetailsResponse = await getTripDetails(tripId);
            
            if(TripDetailsResponse){
                setTripDetails(TripDetailsResponse);
                getTableScaling()
                let tempTotalPaymentMade = parseInt(0);
                let tempPaymentMadeTransactions = [];

                let tempTotalPaymentRecieved = parseInt(0);
                let tempPaymentRecievedTransactions = [];

                TripDetailsResponse.transactions.map(transaction => {
                    if(parseInt(transaction.amount) < parseInt(0)){
                        tempTotalPaymentMade += parseInt(Math.abs(parseInt(transaction.amount)));
                        tempPaymentMadeTransactions.push(
                            <>
                                <span className="text-start">{getDate(transaction.date)}</span>
                                <span className="text-center">{transaction.reason}</span>
                                <span className="text-end"><INRIcon className="inr-icon" /> {Math.abs(parseInt(transaction.amount))}</span>
                            </>
                        )
                    }
                    else{
                        tempTotalPaymentRecieved += parseInt(Math.abs(parseInt(transaction.amount)));
                        tempPaymentRecievedTransactions.push(
                            <>
                                <span className="text-start">{getDate(transaction.date)}</span>
                                <span className="text-center">{transaction.reason}</span>
                                <span className="text-end"><INRIcon className="inr-icon" /> {Math.abs(parseInt(transaction.amount))}</span>
                            </>
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
                router.push({pathname:'/trip'});
            }
        }catch(err){
            toast.error("Unable to get Trip");
            router.push({pathname:'/trip'});
        }
    }

    let HandleDeleteTip = async () => {
        if(!tripId){
            router.push({pathname:'/trip'});
        }
        CloseConfirmDialog();
        setGlobalLoading(true);
        try{
            let deleteTripResponse = await deleteTrip(tripId);
            if(deleteTripResponse && deleteTripResponse.success){
                router.push({pathname:'/trip'});
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
    }

    function StepIcon(props){
        return (
            <>
                {props.checked ? <CheckBoxRounded style={{color: "rgba(71, 73, 160, 1)"}} /> : <CheckBoxOutlineBlankRounded style={{color: "rgba(185, 185, 185, 1)"}} />}
            </>
        )
    }

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }

    let HandleEditTrip = async () => {
        if(!tripId){
            router.push({pathname:'/trip'});
        }
        router.push({pathname: `/trip/create/`,query: {id: tripId}})
    }

    let HandleGetBill = async () => {
        setGlobalLoading(true);
        try{
            let getBillResponse = await getBill(tripId);
            setGlobalLoading(false)
            if(getBillResponse && getBillResponse.success){
                window.open(getBillResponse.link,'_blank')
                setGlobalLoading(false)
            }else{
                setGlobalLoading(false)
                toast.error("Unable to get Bill");
            }
        }catch(err){
            setGlobalLoading(false)
            toast.error("Unable to get Bill");
        }
    }

    return (
        <>
            
            {tripDetails===false ? <div className="w-100 mt-5 py-3 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
                :
             <> 
                <div className={`d-flex mb-3 mt-lg-1 mt-md-1 mt-4 px-lg-3 px-md-3 px-2 justify-content-end align-items-center`}>
                    <Button className={`mx-1 ${styles['edit-button']}`} onClick={HandleEditTrip} variant="contained" endIcon={<EditOutlined />}>Edit</Button>
                    <Button className={`mx-1 ${styles['delete-button']}`} onClick={() => setOpenConfirmDialog(true)} variant="contained" endIcon={<DeleteOutlined />}>Delete</Button>
                </div>  
                <div className="w-100 px-lg-3 px-md-2 px-lg-1 px-md-1 px-1 mx-auto pb-3">
                    <table className={`w-100 rounded-3 position-relative mt-4 ${styles['table']} ${styles['trip-summary-table']} px-lg-2 px-md-2 px-1`} id="table">
                        <thead>
                            <tr>
                                <th style={{width: "1%"}}></th>
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
                                <td style={{width: "1%"}}><Fab className={styles[tripDetails.status]} ><LocalShippingOutlined className={styles[tripDetails.status]} /></Fab></td>
                                <td>{getDate(tripDetails.trip_start_date)}</td>
                                <td>{tripDetails.customer_name}</td>
                                <td>{tripDetails.truck_number}</td>
                                <td className="d-flex justify-content-center align-items-center">

                                    <div className="d-flex py-1 flex-column justify-content-between align-items-start m-auto">
                                        <div className="d-flex align-items-center justify-content-start">
                                            <span className={styles["dot"]} style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                            <span className="mx-1">{tripDetails.origin_city}</span>
                                        </div>
                                        <span className={styles["vertical-line"]}></span>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <span className={styles["dot"]} style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                            <span className="mx-1">{tripDetails.destination_city}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className={styles[tripDetails.status]} style={{background: "transparent"}}><li>{tripDetails.status.replace('_',' ')}</li></span></td>
                                <td><Icon className="mx-1"><INRIcon className="mt-1 inr-icon" /></Icon>  {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived))}</td>
                            </tr>
                        </tbody>

                        <tfoot>

                            <tr>
                                <td colSpan="7" className="text-start">
                                    <Stepper alternativeLabel className={`px-0 pt-lg-3 pt-md-3 pt-0 w-100`} connector={<QontoConnector />}>
                                        {TripSteps.map(tripState => 
                                            <Step active={tripState.checked}>
                                                <StepLabel icon={<StepIcon checked={tripState.checked} />}>{tripState.label} <p className={styles['stepper-helper-text']}>{tripState.helperText && tripState.helperText}</p></StepLabel>
                                            </Step>
                                        )}
                                    </Stepper>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="7" className="text-end">
                                    {tripDetails.status!=="settled" && <Button color="default" className={`mx-2`} size="small" style={{padding: '0.2rem'}} onClick={() => {
                                        setSettleAmount(parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived)));
                                        setOpenPaymentReceiveModal(true);
                                    }} variant="outlined">Mark Settled</Button>}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div className={`mt-lg-3 mt-md-2 mt-1 py-4 px-2 rounded-3 d-flex align-items-center flex-wrap ${styles['payment-methods-container']}`}>
                        <Button variant="outlined" className="mr-3" onClick={() => setOpenPaymentMadeModal(true)}>Add Payment Made</Button>
                        <Button variant="outlined" onClick={() => setOpenPaymentReceiveModal(true)}>Add Payment Received</Button>
                    </div>

                    <div className={`mt-lg-3 mt-md-2 mt-3 py-4 rounded-3 d-flex align-items-center flex-column ${styles['trip-revenue-details']} px-lg-5 px-md-4 px-2`}>
                        <div className="w-100 d-flex justify-content-between align-items-center px-5">
                            <b>Revenue</b>
                            <span className="text-primary"><INRIcon className="inr-icon" /> {tripDetails.freight_amount}</span>
                        </div>
                        
                        {(parseInt(paymentsMade.totalPaymentMade) > 0) && <Accordion className={`w-100 mt-3 mx-0 ${styles['total-charges']} shadow-none`}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreOutlined />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className="w-100 m-0"
                            >
                                <div className="w-100 d-flex justify-content-between align-items-center"><h6><b>Payments Made</b></h6> <span><INRIcon className="inr-icon" /> {paymentsMade.totalPaymentMade}</span></div>
                            </AccordionSummary>
                            <AccordionDetails className={styles["transaction-details"]}>{paymentsMade.transactions}</AccordionDetails>
                        </Accordion>}
                        {(parseInt(paymentsReceived.totalPaymentReceived) > 0) && <Accordion className={`w-100 mx-0 ${styles['total-charges']} shadow-none`}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreOutlined />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className="w-100 m-0"
                            >
                                <div className="w-100 d-flex justify-content-between align-items-center"><h6><b>Payments Received</b></h6> <span><INRIcon className="inr-icon" /> {paymentsReceived.totalPaymentReceived}</span></div>
                            </AccordionSummary>
                            <AccordionDetails className={styles["transaction-details"]}>{paymentsReceived.transactions}</AccordionDetails>
                        </Accordion>}
                        <div className={`w-100 px-1 my-3 ${styles['dashed-border']}`}></div>
                        <div className={`w-100 mt-2 d-flex justify-content-between align-items-center ${styles['revenue-profit']} px-5`}>
                            <b>Profit</b>
                            <span><INRIcon className="inr-icon" /> {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsMade.totalPaymentMade))}</span>
                        </div>
                    </div>
                
                    <div className={`mt-lg-3 mt-md-2 mt-3 py-4 rounded-3 d-flex align-items-center flex-column ${styles['trip-bill-details']} px-lg-5 px-md-4 px-2`}>
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <p className="col-4 text-start">Freight Amount</p>
                            <span className="col-4 text-end"><INRIcon className="inr-icon" /> {tripDetails.freight_amount}</span>
                        </div>
                        <div className={`w-100 px-1 my-3 ${styles['dashed-border']}`}></div>
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <p className="col-4 text-start">Balance</p>
                            <span className={`col-4 text-end text-primary ${styles['primary']}`}><INRIcon className={`inr-icon`} /> {parseInt(parseInt(tripDetails.freight_amount) - parseInt(paymentsReceived.totalPaymentReceived))}</span>
                        </div>

                        <Button className="mt-5 w-50 px-lg-0 px-md-0 px-2 py-lg-3 py-md-3 px-1" startIcon={<PDFFileIcon />} color="primary" variant="contained" onClick={HandleGetBill}>View Bill</Button>
                    </div>
                
                    {openPaymentReceiveModal && <AddPaymentRecieveModal settleAmount={settleAmount} UpdateTripDetails={TripDetails} tripDetails={{...tripDetails,trip_id: tripId}} ClosePaymentReceiveModal={ClosePaymentReceiveModal} />}
                    {openPaymentMadeModal && <AddPaymentMadeModal UpdateTripDetails={TripDetails} tripDetails={{...tripDetails,trip_id: tripId}} ClosePaymentMadeModal={ClosePaymentMadeModal} />}
                    <ConfirmDialog open={openConfirmDialog} close={CloseConfirmDialog} action={HandleDeleteTip} />
                </div> 
             </>}
            
        </>
    )
}
