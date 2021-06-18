import { Button, TextField } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import styles from '../../../../styles/TripsData.module.scss'

export default function Operations(props) {

    const fromDateRef = useRef("")
    const [filters,setFilters] = useState("0");
    const toDateRef = useRef("")
    const statusRef = useRef("all");
    const {HandleOperation} = props.Operations;
    const router = useRouter();

    let HandleFilters = (e) => {
        setFilters(e.target.value)
        switch(e.target.value){
            case "0":
                fromDateRef.current.value = "";
                toDateRef.current.value = "";
                break;
            case "1":
                fromDateRef.current.value = "";
                toDateRef.current.value = "";
                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                break;
            case "2":
                fromDateRef.current.value = moment().format('YYYY-MM-DD')
                toDateRef.current.value = moment().format('YYYY-MM-DD')
                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                break;
            case "3":
                fromDateRef.current.value = moment().add(-1,'days').format('YYYY-MM-DD')
                toDateRef.current.value = moment().format('YYYY-MM-DD')
                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                break;
            case "4":
                fromDateRef.current.value = moment().add(-7,'days').format('YYYY-MM-DD')
                toDateRef.current.value = moment().format('YYYY-MM-DD')
                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                break;
            case "5":
                fromDateRef.current.value = moment().add(-30,'days').format('YYYY-MM-DD')
                toDateRef.current.value = moment().format('YYYY-MM-DD')
                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                break;
        }
    }
    
    return (
        <div className={`w-100 mt-4 d-flex justify-content-between align-items-center flex-lg-row flex-md-row flex-column ${styles['operations']}`}>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">
                 <TextField 
                    label = "From date"
                    type="date"
                    inputRef={fromDateRef}
                    onChange = {() => toDateRef.current.value = ""}
                    inputProps = {{
                        disabled: filters !== "0"
                    }}
                    
                    focused
                 />  
                 <TextField 
                    label = "To date"
                    type="date"
                    inputRef={toDateRef}
                    inputProps = {{
                        disabled: filters !== "0"
                    }}
                    onChange = {() => {
                        if(filters==="0"){
                            if(fromDateRef.current.value !== ""){
                                HandleOperation(fromDateRef.current.value,toDateRef.current.value,statusRef.current.value)
                            }
                        }
                    }}
                    focused
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
                    onChange={(e) => HandleOperation(fromDateRef.current.value,toDateRef.current.value,e.target.value)}
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
