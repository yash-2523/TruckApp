import { Button, InputAdornment, InputLabel, TextField } from '@material-ui/core';
import { ArrowRightAltOutlined, Cancel } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { currentUser } from '../../../../../Services/AuthServices';
import { CreateTransactionAdvance } from '../../../../../Services/TripDataServices';
import styles from '../../../../../styles/TripsData.module.scss';
import ImageUploader from '../../../../ImageUploader';
import INRIcon from '../../../svg/InrIcon.svg';



export default function AddPaymentRecieveModal(props) {


    
    const [addPaymentReceivedDetails,setAddPaymentReceivedDetails] = useState({
        paymentAmount: props.settleAmount===false ? "" : props.settleAmount,
        paymentDate: "",
        paymentNote: "",
        paymentMode: "",
        imageSrc: false
    })
    const {setGlobalLoading} = useContext(GlobalLoadingContext)

    useEffect(() => {
        ChangeScaling()
        window.addEventListener('resize',ChangeScaling)

        return () => {
            window.removeEventListener('resize', ChangeScaling)
        }
    },[])

    let ChangeScaling = () => {
        const mainContainer = document.querySelector('#payment-receive-container');
        const mainContainerImages = document.querySelectorAll('#payment-receive-container > div > img')

        let horizontalScaling, verticalScaling;

        if(window.innerWidth > "830"){
            horizontalScaling = 1;
        }else if(window.innerWidth > "500"){
            horizontalScaling = window.innerWidth / parseInt(800)
        }else{
            horizontalScaling = window.innerWidth / parseInt(500)
        }

        if(window.innerHeight > "630"){
            verticalScaling = 1;
        }else{
            verticalScaling = window.innerHeight / parseInt(600)
        }

        mainContainer.style.transform = `scale(${Math.min(verticalScaling,horizontalScaling)})`;
    }

    let RemoveImageSrc = () => {
        setAddPaymentReceivedDetails({...addPaymentReceivedDetails,imageSrc: false})
    }

    let HandleSubmit = async (e) => {
        e.preventDefault();
        let user = currentUser.value;
        if(user===null || user==="loading"){
            return;
        }
        if(addPaymentReceivedDetails.paymentMode === ""){
            toast.error("All the fields are required");
            return;
        }
        setGlobalLoading(true);
        try{
            let CreateTransactionResponse = await CreateTransactionAdvance(props.tripDetails,user.role,addPaymentReceivedDetails);
            if(CreateTransactionResponse && CreateTransactionResponse.success){
                props.UpdateTripDetails();
                props.ClosePaymentReceiveModal()
                toast.success("Transaction Created");
            }
            else{
                toast.error("Transaction Failed");
            }
            setGlobalLoading(false)
        }catch(err){
            setGlobalLoading(false);
            toast.error("Transaction Failed");
        }
    }

    return (

        <div className={styles["payment-receive-modal"]}> 
             <div className={`${styles['main-container']} shadow`} id="payment-receive-container">
                
                <div className={`col-6 d-lg-block d-md-block d-sm-none d-none py-4 ${styles['payment-receive-intro']}`}>
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <img className="text-center" src="/AddPaymentReceived.png"></img>
                    </div>
                        <h3 className="my-4 mx-4">Payment Information</h3>
                        <p className="mb-4 mx-lg-4 mx-md-3 mx-1">The TruckApp is a trucking logistics marketplacethat seeks to bring trust, transparency and efficiency to transport. Apart from workingcapital loans to transporters and fleet-ownerswe offer load factoring, insurance, lease,rental, and more.</p>
                </div>
                <div className={`col-lg-6 col-md-6 col-10 py-4 ${styles['payment-receive-form']} mx-auto`}>
                <h3 className="mx-2 mb-2">Add Payment Received</h3>
                     <form onSubmit={(e) => HandleSubmit(e)} className="w-100">
                         <TextField 
                            label="Payment Amount"
                            variant="outlined"
                            error={addPaymentReceivedDetails.paymentAmount === ""}
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-4"
                            InputProps= {{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <INRIcon />
                                    </InputAdornment>
                                )
                            }}
                            value={addPaymentReceivedDetails.paymentAmount}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentAmount: e.target.value})}
                            type="number"
                            required
                        />
                        <DatePicker 
                            label="Payment Date"
                            variant="outlined"
                            error={addPaymentReceivedDetails.paymentDate === ""}
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-4"
                            value={addPaymentReceivedDetails.paymentDate==="" ? null : addPaymentReceivedDetails.paymentDate}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentDate: e})}
                            required
                            format="DD-MM-YYYY"
                            helperText=""
                            autoOk
                        />
                        <TextField 
                            label="Payment Mode"
                            variant="outlined"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-4"
                            select
                            error={addPaymentReceivedDetails.paymentMode === ""}
                            SelectProps={{
                                native: true
                            }}
                            value={addPaymentReceivedDetails.paymentMode}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentMode: e.target.value})}
                            focused
                            required
                        >
                            <option value=""></option>
                            <option value="cash">Cash</option>
                            <option value="upi">Upi</option>
                            <option value="bank">Bank</option>
                            <option value="others">Others</option>
                        </TextField>
                        
                        <InputLabel htmlFor="note" className="mx-5 mt-4" >Note</InputLabel>
                        
                        <TextField
                            multiline
                            variant="outlined"
                            id="note"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-2 border-1"
                            value={addPaymentReceivedDetails.paymentNote}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentNote: e.target.value})}
                            rows={5}
                        />
                        <div className={`w-100 d-flex justify-content-evenly flex-wrap align-items-end ${styles['payment-receive-form-action']}`}>
                            <div className="d-flex flex-column align-items-center mt-4">
                                
                                <span className="my-3">Upload Image</span>
                                    <ImageUploader
                                        handleImageSelect={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,imageSrc: URL.createObjectURL(e.target.files[0])})}
                                        imageSrc={addPaymentReceivedDetails.imageSrc}
                                        RemoveImageSrc={RemoveImageSrc}
                                    />
                            </div>
                            <Button endIcon={<ArrowRightAltOutlined />} type="submit" variant="contained" color="primary">Save</Button>
                        </div>
                    </form>

                </div>
                <Cancel onClick={props.ClosePaymentReceiveModal} className={`position-absolute ${styles['close-btn']}`} />
             </div>

        </div>

    )
}
