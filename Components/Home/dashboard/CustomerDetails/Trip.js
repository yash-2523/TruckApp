import {  CheckCircleSharp, CheckOutlined, CloseOutlined, DateRangeOutlined, LocalShippingOutlined, PersonOutlined, RoomOutlined, TrendingFlatOutlined } from '@material-ui/icons'
import moment from 'moment'
import {Button} from '@material-ui/core';
import styles from '../../../../styles/CustomerDetails.module.scss'
import INRIcon from '../../svg/InrIcon.svg';
import { TextField, InputAdornment } from '@material-ui/core'; 
import { useRef, useState } from 'react';
import Link from 'next/link'

export default function Trip(props){
    // const paymentMehtods = [
    //     "cash","upi","others"
    // ]
    // const [openSettleContainer,setOpenSettleContainer] = useState(false);
    // const tripSettleDateRef = useRef("");
    // const remarkRef = useRef("");
    // const [paymentMethod,setPaymentMethod] = useState(paymentMehtods[0])

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }
    return (
        <Link href={`/trip/${props.trip.trip_id}`}><div className={`w-100 ${styles['trip-main-container']}`}>
            <div className={`w-100 py-2 px-lg-3 px-md-2 px-1 position-realtive d-flex justify-content-between align-items-center flex-wrap ${styles['trip-details-container']}  trip-details-container`}>
                <div className={`col-lg-8 col-12 ${styles['trip-details']}`}>
                    <span className="d-flex">
                        <div><span className={`${styles['icon']}`}><RoomOutlined /></span> {props.trip.origin_city}</div>
                        <TrendingFlatOutlined className="mx-auto" />
                    </span>
                    <div><span className={`${styles['icon']}`}><RoomOutlined /></span> {props.trip.destination_city}</div>
                    <div><span className={`${styles['icon']}`}><DateRangeOutlined /></span> {getDate(props.trip.trip_start_date)}</div>
                    <div className="align-items-center"><span className={`${styles['icon']}`}><PersonOutlined /></span> <span className="d-flex flex-column">
                            <p className={`${styles['field-title']}`}>Truck Supplier</p>{props.trip.customer_name}
                        </span>
                    </div>
                    <div><span className={`${styles['icon']}`}><LocalShippingOutlined /></span> {props.trip.truck_id}</div>
                    <div><span className={`${styles['icon']}`}><LocalShippingOutlined /></span> <p className={`${styles[props.trip.status]}`}>{props.trip.status.toString().replace('_',' ')}</p></div>
                </div>

                <div className="d-flex justify-content-end flex-reverse align-items-end align-self-end flex-grow-1">
                    {/* {props.trip.status==="not_settled" ? <Button className="align-self-end" variant="outlined" color="default" size="small">Mark Settled</Button>
                    :
                    <span></span> } */}
                    <span className={`align-self-end ${styles[props.trip.status]}`}><INRIcon /> {props.trip.freight_amount}  {(props.trip.status==="settled") && <CheckCircleSharp />}</span>
                </div>
            </div>

           {/* {openSettleContainer && <div className={`w-100 mt-4 px-lg-3 px-md-2 px-1 mb-4 ${styles['trip-settle-container']}`}>
                <h5>Mark Trip Settled</h5>
                <hr />
                <div className="d-flex justify-content-start align-items-center flex-wrap">
                    <TextField 
                        label="Enter Amount"
                        InputProps = {{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <INRIcon />
                                </InputAdornment>
                            )
                        }}
                        value={props.trip.to_receive}
                        
                        type="number"
                    
                    />

                    <TextField 
                        label="Select Date"
                        type="date"
                        focused
                        inputRef={tripSettleDateRef}
                    />
                </div>

                <h6 className="mt-5">Payment Method</h6>
                <div className={`d-flex mt-3 align-items-center flex-wrap ${styles['payment-methods']}`}>
                    <Button variant={paymentMethod === paymentMehtods[0] ? "contained" : "outlined"} className={(paymentMethod === paymentMehtods[0]) && styles['active']} onClick={() => setPaymentMethod(paymentMehtods[0])}>Cash</Button>
                    <Button variant={paymentMethod === paymentMehtods[1] ? "contained" : "outlined"} className={(paymentMethod === paymentMehtods[1]) && styles['active']} onClick={() => setPaymentMethod(paymentMehtods[1])}>UPI</Button>
                    <Button variant={paymentMethod === paymentMehtods[2] ? "contained" : "outlined"} className={(paymentMethod === paymentMehtods[2]) && styles['active']} onClick={() => setPaymentMethod(paymentMehtods[2])}>Others</Button>
                </div>

                <h6 className="mt-5">Remark</h6>

                <textarea rows="7" ref={remarkRef} className="col-12" />

                <div className="d-flex justify-content-end align-items-center">
                    <Button variant="outlined" onClick={() => setOpenSettleContainer(false)} startIcon={<CloseOutlined />}>Cancel</Button>
                    <Button variant="contained" color="primary" endIcon={<CheckOutlined />}>Save</Button>
                </div>
            </div> } */}
        
        </div></Link>
    )
}