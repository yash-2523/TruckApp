import { Button, InputAdornment, InputLabel, TextField } from '@material-ui/core';
import { ArrowRightAltOutlined, Cancel } from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../../Context/GlobalLoadingContext';
import { currentUser } from '../../../../../Services/AuthServices';
import { CreateTransactionExpense, getExpense } from '../../../../../Services/TripDataServices';
import styles from '../../../../../styles/TripsData.module.scss';
import ImageUploader from '../../../../ImageUploader';
import INRIcon from '../../../svg/InrIcon.svg';

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
        const mainContainer = document.querySelector('#payment-made-container');
        const mainContainerImages = document.querySelectorAll('#payment-made-container > div > img')

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
        setAddPaymentMadeDetails({...addPaymentMadeDetails,imageSrc: false})
    }

    let HandleSubmit = async (e) => {
        e.preventDefault();
        let user = currentUser.value;
        if(user===null || user==="loading"){
            return;
        }
        if(addPaymentMadeDetails.expenseType === "" || addPaymentMadeDetails.expenseMode === ""){
            toast.error("All the fields are required");
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

        <div className={styles["payment-made-modal"]}> 
             <div className={`${styles['main-container']} shadow`} id="payment-made-container">
                
                <div className={`col-6 d-lg-block d-md-block d-sm-none d-none py-4 ${styles['payment-made-intro']}`}>
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <img className="text-center" src="/AddPaymentMade.png"></img>
                    </div>
                        <h3 className="my-4 mx-4">Payment Information</h3>
                        <p className="mb-4 mx-lg-4 mx-md-3 mx-1">The TruckApp is a trucking logistics marketplacethat seeks to bring trust, transparency and efficiency to transport. Apart from workingcapital loans to transporters and fleet-ownerswe offer load factoring, insurance, lease,rental, and more.</p>
                </div>
                <div className={`col-lg-6 col-md-6 col-10 py-4 ${styles['payment-made-form']} mx-auto`}>
                <h3 className="mx-2 mb-2">Add Payment Made</h3>
                     <form onSubmit={(e) => HandleSubmit(e)} className="w-100">

                         <TextField 
                            select
                            variant="outlined"
                            label = "Reason"
                            required
                            error={addPaymentMadeDetails.expenseType === ""}
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            SelectProps={{
                                native: true
                            }}
                            focused
                            value={addPaymentMadeDetails.expenseType}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseType: e.target.value})}
                         >
                             <option value=""></option>
                            {expenseTypes.map(expense => 
                                <option key={expense} value={expense}>{expense}</option>
                            )} 
                         </TextField>   
                         <TextField 
                            label="Expense Amount"
                            variant="outlined"
                            error={addPaymentMadeDetails.expenseAmount === ""}
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
                            variant="outlined"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            type="date"
                            error={addPaymentMadeDetails.expenseDate === ""}
                            focused
                            required
                            value={addPaymentMadeDetails.expenseDate}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseDate: e.target.value})}
                        />
                        <TextField 
                            label="Expense Mode"
                            variant="outlined"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-3"
                            select
                            error={addPaymentMadeDetails.expenseMode === ""}
                            SelectProps={{
                                native: true
                            }}
                            value={addPaymentMadeDetails.expenseMode}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseMode: e.target.value})}
                            focused
                            required
                        >
                            <option value=""></option>
                            <option value="cash">Cash</option>
                            <option value="upi">Upi</option>
                            <option value="bank">Bank</option>
                            <option value="others">Others</option>
                        </TextField>
                        
                        <InputLabel htmlFor="note" className="mx-5 mt-3" >Note</InputLabel>
                        
                        <TextField
                            multiline
                            variant="outlined"
                            id="note"
                            className="mx-5 col-lg-6 col-md-6 col-8 mt-2 border-1"
                            rows={5}
                            value={addPaymentMadeDetails.expenseNote}
                            onChange={(e) => setAddPaymentMadeDetails({...addPaymentMadeDetails,expenseNote: e.target.value})}
                        />
                        <div className={`w-100 d-flex justify-content-evenly flex-wrap align-items-end ${styles['payment-made-form-action']}`}>
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
                <Cancel onClick={props.ClosePaymentMadeModal} className={`position-absolute ${styles['close-btn']}`} />
             </div>

        </div>

    )
}
