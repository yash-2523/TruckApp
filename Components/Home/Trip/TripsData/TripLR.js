import { Step, Stepper, StepLabel, FormControlLabel, RadioGroup, Radio, TextField, Avatar, InputLabel } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Button,Fab,Icon } from '@material-ui/core';
import { LocalShippingOutlined, CachedOutlined, AddOutlined, RemoveOutlined, Cancel } from '@material-ui/icons'
import TripsDataStyles from '../../../../styles/TripsData.module.scss';
import styles from '../../../../styles/TripLR.module.scss'
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import moment from "moment";
import { getTripDetails } from "../../../../Services/TripDataServices";
import INRIcon from '../../svg/InrIcon.svg';
import {currentUser} from '../../../../Services/AuthServices'
import { MenuItem } from "@material-ui/core";

export default function TripLR(){

    const LRSteps = [
        {
            label: "Trip Details",
            content: <TripDetailsForm />
        },
        {
            label: "Company Details",
            content: <CompanyDetailsForm />
        },
        {
            label: "Consignor Details",
            content: <ConsignorFieldsForm />
        },
        {
            label: "Consignee Details",
            content: <ConsigneeDetailsForm />
        },
        {
            label: "Insurance signature",
            content: <InsuranceSignatureForm />
        },
        {
            label: "Material Details",
            content: <GoodDetailsForm />
        },
    ]
    const [tripDetails,setTripDetails] = useState(false);
    const [activeStep,setActiveStep] = useState(0);
    const [user,setUser] = useState(currentUser.value)
    const router = useRouter();
    const tripId = router.query.id;

    useEffect(() => {
        let AuthObservable = currentUser.subscribe(data => {
            setUser(data)
        })
        return () => {
            AuthObservable.unsubscribe();
        }
    },[])

    useEffect(async () => {
        if(!tripId){
            router.push({pathname:'/trip'});
        }else{
            try{
                let TripDetailsResponse = await getTripDetails(tripId);
                
                if(TripDetailsResponse){
                    setTripDetails(TripDetailsResponse);
                    getStepperDisplay()
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
    },[])

    useEffect(() => {
        window.addEventListener('resize',getStepperDisplay)

        return () => {
            window.removeEventListener('resize',getStepperDisplay)
        }
    },[])

    let getStepperDisplay = () => {
        const Stepper = document.getElementById('stepper');
        let mainContainer = document.querySelector("#main-container")
        if(!Stepper){
            return
        }
        if(490 > mainContainer.offsetWidth){
            Stepper.style.display = "none"
        }else{
            Stepper.style.display = "flex"
        }
    }

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }

    function TripDetailsForm(){


        useEffect(() => {
            getTableRowScaling();

            window.addEventListener('resize',getTableRowScaling)

            return () => {
                window.removeEventListener('resize',getTableRowScaling)
            }
        },[])

        let getTableRowScaling = () => {
            const TripDetailsForm = document.getElementById('trip-details-form');
            const TableRow = document.querySelector('tr');
            if(TableRow.offsetWidth > TripDetailsForm.offsetWidth){
                TableRow.style.transform = `scale(${TripDetailsForm.offsetWidth / TableRow.offsetWidth})`;
                TableRow.style.transformOrigin = "0% center"
            }else{
                TableRow.style.transform = `scale(1)`;
                TableRow.style.transformOrigin = "0% center"
            }
        }

        return (
            <div className="w-100" id="trip-details-form">
                <div className={`mb-lg-3 mb-md-2 mb-0 ${styles['form-index']}`}>
                    <div>1</div> Trip Details
                </div>
                <table className={`w-100 ${TripsDataStyles['table']}`}>
                    <tbody>
                        <tr>
                            <td style={{width: "1%"}}><Fab className={TripsDataStyles[tripDetails.status]} ><LocalShippingOutlined className={TripsDataStyles[tripDetails.status]} /></Fab></td>
                            <td>{getDate(tripDetails.trip_start_date)}</td>
                            <td>{tripDetails.customer_name}</td>
                            <td>{tripDetails.truck_number === "" ? <p className="text-danger">NA</p> : tripDetails.truck_number}</td>
                            <td className="d-flex justify-content-center align-items-center">

                                <div className="d-flex py-1 flex-column justify-content-between align-items-start m-auto">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className={TripsDataStyles["dot"]} style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                        <span className="mx-1">{tripDetails.origin_city}</span>
                                    </div>
                                    <span className={TripsDataStyles["vertical-line"]}></span>
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className={TripsDataStyles["dot"]} style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                        <span className="mx-1">{tripDetails.destination_city}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span className={TripsDataStyles[tripDetails.status]} style={{background: "transparent"}}><li>{tripDetails.status.replace('_',' ')}</li></span></td>
                            <td><Icon className="mx-1"><INRIcon className="mt-1 inr-icon" /></Icon>  {tripDetails.freight_amount}</td>
                        </tr>
                    </tbody>
                </table>    
            
                <div className={`mt-lg-3 mt-md-2 mt-0 mb-2 ${styles['form-index']}`}>
                    <div>2</div> Frieght  Paid by
                </div>
                
                <RadioGroup row className="ms-4" value="Consignee" name="freight-amount-payer">
                    <FormControlLabel value="Consignor" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Consignor" />
                    <FormControlLabel value="Consignee" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Consignee" />
                    <FormControlLabel value="Agent" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Agent" />
                </RadioGroup>

                <InputLabel className="mt-4 mb-2">GST Percentage</InputLabel>
                <TextField
                    select
                    variant="outlined"
                    SelectProps={{
                        native: true
                    }}
                    className="col-lg-4 col-md-5 col-10"
                >
                     <option value="">
                        Select GST
                    </option>
                    <option value="0%">0%</option>
                    <option value="5%">5%</option>
                    <option value="12%">12%</option>
                    <option value="18%">18</option>
                </TextField>
                
                <div className="w-100 mt-4 d-flex justify-content-end align-items-center">
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div>
            </div>
        )
        
    }

    function CompanyDetailsForm(){
        return (
            <>
                <div className="d-flex justify-content-center align-items-center">
                    <Avatar className={`${styles.dp} my-3`}>{user && user.name?.split(' ').map(word => word.charAt(0).toUpperCase())}</Avatar>
                </div>
                <div className={`mt-5 pt-4 d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-center ${styles['company-details-form-fields']}`}>
                    <TextField 
                        label="Company Name"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="GST Number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Phone"
                        type="number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="PAN"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Email"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="City"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Address"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Pincode"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="State"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    
                </div>
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div>

            </>
        )
    }

    function ConsignorFieldsForm(){

        const [showExtraAddressField,setShowExtraAddressField] = useState(false);

        return (
            <div className={`${styles['cosignor-form-container']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> LR Details
                </div>
                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['lr-details-form-fields']}`}>
                    <TextField 
                        label="LR Number"
                        type="number"
                        required
                        helperText={<span style={{cursor: "pointer"}} className="text-danger"><CachedOutlined /> Reload LRN</span>}
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Date"
                        type="date"
                        variant="outlined"
                        focused
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        value={moment().format('DD-MM-YYYY')}
                    />
                </div>
            
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>2</div> Consignor Details
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['cosignor-details-form-fields']}`}>

                    <TextField 
                        label="Consignor Name"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                    <TextField 
                        label="GST Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                    <TextField 
                        label="E-way Bill Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                </div>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>3</div> Consignor Address
                </div>

                <div className={`ms-3 mt-3`}>
                    <TextField 
                        label="Address"
                        required
                        multiline
                        rows={3}
                        className="col-10"
                        variant="outlined"
                    />
                    <Button className={`mt-3 ${styles['add-street-address-2']}`} onClick={() => setShowExtraAddressField(!showExtraAddressField)} >{!showExtraAddressField ? <AddOutlined /> : <RemoveOutlined />} Street Address 2 (optional)</Button>

                    {showExtraAddressField && 
                         <TextField 
                         label="Address"
                         required
                         multiline
                         rows={3}
                         className="mt-3 col-10"
                         variant="outlined"
                        />
                    }

                    <div className="mt-3 d-flex align-items-start flex-wrap">
                        <TextField 
                            label="Pin Code"
                            variant="outlined"
                            type="number"
                            className="me-3 mb-2"
                        />
                        <TextField 
                            label="State"
                            variant="outlined"
                        />
                    </div>
                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div>    

            </div>

        )
        
    }

    function ConsigneeDetailsForm() {
        
        const [showExtraAddressField,setShowExtraAddressField] = useState(false);

        return (
            <div className={`${styles['cosignee-form-container']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> LR Details
                </div>
                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['lr-details-form-fields']}`}>
                    <TextField 
                        label="LR Number"
                        type="number"
                        required
                        helperText={<span style={{cursor: "pointer"}} className="text-danger"><CachedOutlined /> Reload LRN</span>}
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Date"
                        type="date"
                        variant="outlined"
                        focused
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        value={moment().format('DD-MM-YYYY')}
                    />
                </div>
            
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>2</div> Consignee Details
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['cosignee-details-form-fields']}`}>

                    <TextField 
                        label="Consignee Name"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                    <TextField 
                        label="GST Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                    <TextField 
                        label="E-way Bill Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                    />
                </div>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>3</div> Consignee Address
                </div>

                <div className={`ms-3 mt-3`}>
                    <TextField 
                        label="Address"
                        required
                        multiline
                        rows={3}
                        className="col-10"
                        variant="outlined"
                    />
                    <Button className={`mt-3 ${styles['add-street-address-2']}`} onClick={() => setShowExtraAddressField(!showExtraAddressField)} >{!showExtraAddressField ? <AddOutlined /> : <RemoveOutlined />} Street Address 2 (optional)</Button>

                    {showExtraAddressField && 
                         <TextField 
                         label="Address"
                         required
                         multiline
                         rows={3}
                         className="mt-3 col-10"
                         variant="outlined"
                        />
                    }

                    <div className="mt-3 d-flex align-items-start flex-wrap">
                        <TextField 
                            label="Pin Code"
                            variant="outlined"
                            type="number"
                            className="me-3 mb-2"
                        />
                        <TextField 
                            label="State"
                            variant="outlined"
                        />
                    </div>
                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div>    

            </div>
        )
    }

    function InsuranceSignatureForm(){

        const [imageSrc,setImageSrc] = useState(false);

        return (
            <div className={`${styles['insurance-signature-form']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> Add Insurance
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-start justify-content-start align-items-center ${styles['add-insurance-form-fields']}`}>
                    <TextField 
                        label="Insurance Provider"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Insurance Policy No."
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="Date"
                        focused
                        type="date"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />

                    <div class={`col-lg-5 col-md-6 col-10 d-flex flex-column justify-cotent-between ${styles['risk-types']}`}>
                        Risk Type
                        <div className={`d-flex align-items-center flex-wrap`}>
                            <Button variant={true ? "contained" : "outlined"} className={true ? `${styles['active']}` : ""}>High</Button>
                            <Button variant={false ? "contained" : "outlined"} className={false ? `${styles['active']}` : ""}>Low</Button>
                            <Button variant={false ? "contained" : "outlined"} className={false ? `${styles['active']}` : ""}>Insured Value</Button>
                        </div>
                    </div>
                </div>  

                <div className={`w-100 mt-5 d-flex flex-wrap justify-content-lg-between justify-content-md-start justify-content-evenly align-items-start ${styles['insurance-details-form-fields']}`}>
                    <div className="col-lg-5 col-md-8 col-11">
                        <div className={`mb-3 ${styles['form-index']}`}>
                            <div>2</div> Add Insurance
                        </div>

                        <div className={`ms-3`}>
                            <TextField 
                                label="E-waybill No."
                                className={`col-12 mb-3`}
                                variant="outlined"
                            />
                            <TextField 
                                label="Invoice Value"
                                className={`col-12 mb-3`}
                                variant="outlined"
                            />
                            <TextField 
                                label="Good Invoice No."
                                className={`col-12 mb-3`}
                                variant="outlined"
                            />
                        </div>

                    </div>
                    <div className="col-lg-5 col-md-8 col-11">
                        <div className={`mb-3 ${styles['form-index']}`}>
                            <div>3</div> Add Signature
                        </div>

                        <div className="ms-3">
                            <div className={`col-12 d-flex flex-column justify-content-center align-items-center ${styles['image-upload-container']}`}>

                                {imageSrc===false ? 
                                    <>
                                        <span className={`mb-4`}>Upload a signature or scan</span>
                                        <Button variant="contained" onClick={() => document.getElementById('signature-input').click()}>Select Image</Button>
                                        <input type="file" id="signature-input" onChange={(e) => setImageSrc(URL.createObjectURL(e.target.files[0]))} />
                                    </>

                                 :   
                                    <>
                                        <span className="position-relative">
                                            <img src={imageSrc}></img>
                                            <Cancel className="position-absolute" onClick={() => setImageSrc(false)} style={{color:"grey"}}/>
                                        </span>
                                    </>
                            
                                }
                                
                                
                            </div>

                            <p className={`mt-4 ${styles['upload-image-info-text']}`}>By signing this document with an electronic signature. I agree that such signature will be as valid as handwritten signature to the extent allowed by local law</p>

                            <div className="mt-4 d-flex justify-content-around align-items-center">
                                <Button variant="contained" color="default">Cancel</Button>
                                <Button variant="contained">Accept & Sign</Button>
                            </div>
                        </div>
                    </div>
                </div>              

                <div className="mt-5 d-flex justify-content-center align-items-center">
                    <span className={`${styles['insurance-signature-info-text']} p-3`}>These information ware added during opening account .please check if it is correct and continue final resistration.</span>
                </div>

                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div> 

            </div>
        )
    }

    function GoodDetailsForm(){
        return (
            <div className={`${styles['good-details-form']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> Add Good Types
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['good-details-form-fields']}`}>

                    <TextField 
                        label="Packaging Type"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                    />
                    <TextField 
                        label="Material Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                    />
                    <TextField 
                        label="Container Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                    />
                    <TextField 
                        label="HSN Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                    />

                    <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                        Actual Weight
                        <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Weight"
                                className="col-8"
                                variant="outlined"
                            />
                            <TextField 
                                select
                                SelectProps={{
                                    native: true
                                }}
                                className="col-3"
                                variant="outlined"
                            >
                                <option value="kg">Kg</option>

                            </TextField>

                        </div>
                    </div>
                    <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                        Actual Rate
                        <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Rate"
                                className="col-8"
                                variant="outlined"
                            />
                            <TextField 
                                select
                                SelectProps={{
                                    native: true
                                }}
                                className="col-3"
                                variant="outlined"
                            >
                                <option value="kg">Kg</option>

                            </TextField>

                        </div>
                    </div>

                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => setActiveStep(prev => prev + 1)}>Save & Next</Button>
                </div> 

            </div>
        )
    }

    return (
        <>
            {tripDetails===false ? <div className="w-100 mt-5 py-3 text-center p-0"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
                :
            <div className="w-100 mt-4 mb-2 px-lg-3 px-md-2 px-1">
                <Stepper alternativeLabel activeStep={activeStep} id="stepper">
                    {LRSteps.map(step => 
                        <Step>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    )}
                </Stepper>

                <h4 className={`mt-4 mx-lg-3 mx-md-2 mx-1 mb-2 ${styles['active-form-label']}`}>{LRSteps[activeStep].label}</h4>                        
                <div className={`w-100 border-3 px-lg-3 px-md-2 px-1 py-3 ${styles['active-form-container']}`}>
                    {LRSteps[activeStep].content}
                </div>
            </div> }   
        </>
        
    )
}