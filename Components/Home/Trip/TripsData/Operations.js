import { Button, TextField } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import styles from '../../../../styles/Home.module.scss'

export default function Operations(props) {

    const [fromDate,setFromDate] = useState("")
    const [filters,setFilters] = useState("0");
    const [toDate,setToDate] = useState("")
    const statusRef = useRef("all");
    const {HandleOperation} = props.Operations;
    const router = useRouter();

    console.log(fromDate,toDate)

    let HandleFilters = (e) => {
        setFilters(e.target.value)
        let TempFromDate,TempToDate;
        switch(e.target.value){
            case "0":
                TempFromDate = "";
                TempToDate = "" 
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
            case "1":
                TempFromDate = "";
                TempToDate = "" 
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
            case "2":
                TempFromDate = moment().format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD') 
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
            case "3":
                TempFromDate = moment().add(-1,'days').format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
            case "4":
                TempFromDate = moment().add(-7,'days').format('YYYY-MM-DD')
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
            case "5":
                TempFromDate = moment().add(-30,'days').format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                HandleOperation(TempFromDate,TempToDate,statusRef.current.value)
                break;
        }
    }
    
    return (
        <div className={`w-100 mt-4 d-flex justify-content-between align-items-center flex-lg-row flex-md-row flex-column ${styles['operations']}`}>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">

                 <DatePicker 
                    label="From date"
                    value={fromDate==="" ? null : fromDate}
                    onChange={(e) => {setFromDate(e);setToDate("")}}
                    disabled= {filters !== "0"}
                    format="DD-MM-YYYY"
                    autoOk
                 />
                 <DatePicker 
                    value={toDate==="" ? null : toDate}
                    label="To Date"
                    format="DD-MM-YYYY"
                    onChange={(e) => {setToDate(e);
                        if(filters==="0"){
                            if(fromDate !== ""){
                                HandleOperation(fromDate,e,statusRef.current.value)
                            }
                        }
                    }}
                    disabled={ filters !== "0"}
                    autoOk
                 />
            </div>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">
                <TextField
                    select
                    label="Filters"
                    value={filters}
                    onChange={(e) => HandleFilters(e)}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="0">Date range</option>
                    <option value="1">All</option>
                    <option value="2">Today</option>
                    <option value="3">Yesterday</option>
                    <option value="4">Last 7 days</option>
                    <option value="5">Last 30 days</option>
                </TextField>
                <TextField 
                    select
                    label = "Status"
                    SelectProps={{
                        native: true,
                    }}
                    inputRef={statusRef}
                    onChange={(e) => HandleOperation(fromDate,toDate,e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="settled">Settled</option>
                    <option value="not_settled">Not Settled</option>
                    

                </TextField>
                <Button startIcon={<Add />} variant="contained" onClick={() => router.push({pathname:'/trip/create'})} color="primary">Create Trip</Button>
            </div>
        </div>
    )
}
