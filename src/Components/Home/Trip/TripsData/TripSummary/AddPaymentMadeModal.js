import { Button, InputAdornment, InputLabel, TextField } from '@material-ui/core'
import { ArrowRightAltOutlined, Cancel,  } from '@material-ui/icons';
import {ReactComponent as INRIcon} from '../svg/Inr.svg'
import React, { useContext, useEffect, useState } from 'react'
import '../style.scss'
import ImageUploader from '../../../../../ImageUploader';
import { CreateTransactionExpense, getExpense } from '../../../../../Services/TripDataServices'
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { currentUser } from '../../../../../Services/AuthServices';
import { toast } from 'react-toastify';

export default function AddPaymentMadeModal(props) {


    const [addPaymentMadeDetails,setAddPaymentMadeDetails] = useState({
        expenseType: "",
        expenseAmount: "",
        expenseDate: "",
        expenseNote: "",
        expenseMode: "cash",
        imageSrc: false
    })

    const [expenseTypes,setExpenseTypes] = useState([]);
    const {setGlobalLoading} = useContext(GlobalLoadingContext)

    useEffect(() => {
        ChangeScaling()
        window.addEventListener('resize',ChangeScaling)

        return () => {
            window.removeEventListener('resize', ChangeScaling)
        }
    },[])

    useEffect(async () => {
        try{
            let allExpenseTypes = await getExpense();
            if(allExpenseTypes){
                setExpenseTypes(allExpenseTypes);
            }
        }catch(err){

        }
    },[])

    let ChangeScaling = () => {
        const mainContainer = document.querySelector('.payment-made-modal > .main-container');
        const mainContainerImages = document.querySelectorAll('.payment-made-modal > .main-container > div > img')
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
        setAddPaymentMadeDetails({...addPaymentMadeDetails,imageSrc: false})
    }

    let HandleSubmit = async (e) => {
        e.preventDefault();
        let user = currentUser.value;
        if(user===null || user==="loading"){
            return;
        }
        setGlobalLoading(true);
        try{
            let CreateTransactionResponse = await CreateTransactionExpense(props.tripDetails,user.role,addPaymentMadeDetails);
            if(CreateTransactionResponse && CreateTransactionResponse.success){
                props.UpdateTripDetails();
                props.ClosePaymentMadeModal()
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

        <div className="payment-made-modal"> 
             <div className="main-container shadow">
                
                <div className="col-6 d-lg-block d-md-block d-sm-none d-none py-4 payment-made-intro">
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <img className="text-center" src="assets/AddPaymentMade.png"></img>
                    </div>
                        <h3 className="my-4 mx-4">Payment Information</h3>
                        <p className="mb-4 mx-lg-4 mx-md-3 mx-1">The TruckApp is a trucking logistics marketplacethat seeks to bring trust, transparency and efficiency to transport. Apart from workingcapital loans to transporters and fleet-ownerswe offer load factoring, insurance, lease,rental, and more.</p>
                </div>
                <div className="col-lg-6 col-md-6 col-10 py-4 payment-made-form px-lg-2 px-md-2 px-5">
                <h3>Add Payment Made</h3>
                     <form onSubmit={(e) => HandleSubmit(e)} className="w-100">

                         <TextField 
                            select
                            label = "Reason"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            SelectProps={{
                                native: true
                            }}
                            focused
                            value={addPaymentMadeDetails.expenseType}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseType: e.target.value})}
                         >
                            {expenseTypes.map(expense => 
                                <option value={expense}>{expense}</option>
                            )} 
                         </TextField>   
                         <TextField 
                            label="Expense Amount"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            InputProps= {{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <INRIcon />
                                    </InputAdornment>
                                )
                            }}
                            value={addPaymentMadeDetails.expenseAmount}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseAmount: e.target.value})}
                            type="number"
                            required
                        />
                        <TextField 
                            label="Expense Date"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            type="date"
                            focused
                            required
                            value={addPaymentMadeDetails.expenseDate}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseDate: e.target.value})}
                        />
                        <TextField 
                            label="Expense Mode"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            select
                            SelectProps={{
                                native: true
                            }}
                            value={addPaymentMadeDetails.expenseMode}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseMode: e.target.value})}
                            focused
                            required
                        >

                            <option value="cash">Cash</option>
                            <option value="upi">Upi</option>
                            <option value="bank">Bank</option>
                            <option value="others">Others</option>
                        </TextField>
                        
                        <InputLabel htmlFor="note" className="mx-5 mt-3" >Note</InputLabel>
                        
                        <textarea
                            label="Note"
                            id="note"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-2 border-1"
                            rows={5}
                            value={addPaymentMadeDetails.expenseNote}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseNote: e.target.value})}
                        />
                        <div className="w-100 d-flex justify-content-evenly flex-wrap align-items-end payment-made-form-action">
                            <div className="d-flex flex-column align-items-center mt-3">
                                <span className="my-2">Upload Image</span>
                                <ImageUploader
                                    handleImageSelect={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,imageSrc: URL.createObjectURL(e.target.files[0])})}
                                    imageSrc={addPaymentMadeDetails.imageSrc}
                                    RemoveImageSrc={RemoveImageSrc}
                                />
                                
                            </div>
                            <Button endIcon={<ArrowRightAltOutlined />} type="submit" variant="contained" color="primary">Save</Button>
                        </div>
                    </form>

                </div>
                <Cancel onClick={props.ClosePaymentMadeModal} className="position-absolute close-btn" />
             </div>

        </div>

    )
}