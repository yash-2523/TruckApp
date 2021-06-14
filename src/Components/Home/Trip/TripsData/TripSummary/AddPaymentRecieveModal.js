import { Button, InputAdornment, InputLabel, TextField } from '@material-ui/core'
import { ArrowRightAltOutlined, Cancel  } from '@material-ui/icons';
import {ReactComponent as INRIcon} from '../svg/Inr.svg'
import React, { useContext, useEffect, useState } from 'react'
import '../style.scss'
import ImageUploader from '../../../../../ImageUploader';
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { currentUser } from '../../../../../Services/AuthServices';
import { CreateTransactionAdvance } from '../../../../../Services/TripDataServices'
import { toast } from 'react-toastify';
export default function AddPaymentRecieveModal(props) {


    
    const [addPaymentReceivedDetails,setAddPaymentReceivedDetails] = useState({
        paymentAmount: props.settleAmount===false ? "" : props.settleAmount,
        paymentDate: "",
        paymentNote: "",
        paymentMode: "cash",
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
        const mainContainer = document.querySelector('.payment-receive-modal > .main-container');
        const mainContainerImages = document.querySelectorAll('.payment-receive-modal > .main-container > div > img')
        if(window.innerWidth > "830"){
            mainContainer.style.transform = "scale(1)";

            for(let i=0;i<mainContainerImages.length;i++){
                if(mainContainerImages[i].tagName == "IMG"){
                    mainContainerImages[i].style.transform = "scale(1)";
                    mainContainerImages[i].style.transformOrigin = "none";
                }
            }
        }
        else if(window.innerWidth > "500"){
            mainContainer.style.transform = `scale(${window.innerWidth / parseInt(800)})`;
            for(let i=0;i<mainContainerImages.length;i++){
                if(mainContainerImages[i].tagName == "IMG"){
                    mainContainerImages[i].style.transform = `scale(${window.innerWidth / parseInt(800)})`;
                    mainContainerImages[i].style.transformOrigin = "center 0%";
                }
            }
        }
        else{
            mainContainer.style.transform = `scale(${window.innerWidth / parseInt(500)})`;
        }
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

        <div className="payment-receive-modal"> 
             <div className="main-container shadow">
                
                <div className="col-6 d-lg-block d-md-block d-sm-none d-none py-4 payment-receive-intro">
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <img className="text-center" src="assets/AddPaymentReceived.png"></img>
                    </div>
                        <h3 className="my-4 mx-4">Payment Information</h3>
                        <p className="mb-4 mx-lg-4 mx-md-3 mx-1">The TruckApp is a trucking logistics marketplacethat seeks to bring trust, transparency and efficiency to transport. Apart from workingcapital loans to transporters and fleet-ownerswe offer load factoring, insurance, lease,rental, and more.</p>
                </div>
                <div className="col-lg-6 col-md-6 col-10 py-4 payment-receive-form px-lg-2 px-md-2 px-5">
                <h3>Add Payment Received</h3>
                     <form onSubmit={(e) => HandleSubmit(e)} className="w-100">
                         <TextField 
                            label="Payment Amount"
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
                        <TextField 
                            label="Payment Date"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-4"
                            type="date"
                            value={addPaymentReceivedDetails.paymentDate}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentDate: e.target.value})}
                            focused
                            required
                        />
                        <TextField 
                            label="Payment Mode"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-4"
                            select
                            SelectProps={{
                                native: true
                            }}
                            value={addPaymentReceivedDetails.paymentMode}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentMode: e.target.value})}
                            focused
                            required
                        >

                            <option value="cash">Cash</option>
                            <option value="upi">Upi</option>
                            <option value="bank">Bank</option>
                            <option value="others">Others</option>
                        </TextField>
                        
                        <InputLabel htmlFor="note" className="mx-5 mt-4" >Note</InputLabel>
                        
                        <textarea
                            label="Note"
                            id="note"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-2 border-1"
                            value={addPaymentReceivedDetails.paymentNote}
                            onChange={(e) => setAddPaymentReceivedDetails({...addPaymentReceivedDetails,paymentNote: e.target.value})}
                            rows={5}
                        />
                        <div className="w-100 d-flex justify-content-evenly flex-wrap align-items-end payment-receive-form-action">
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
                <Cancel onClick={props.ClosePaymentReceiveModal} className="position-absolute close-btn" />
             </div>

        </div>

    )
}