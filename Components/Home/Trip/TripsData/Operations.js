import { Button, TextField } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { DatePicker } from '@material-ui/pickers'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../../../../styles/Home.module.scss'

export default function Operations(props) {
    const { t } = useTranslation()
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState("0");
    const [status, setStatus] = useState('all')
    const { HandleOperation } = props.Operations;
    const router = useRouter();

    useEffect(() => {
        HandleOperation(fromDate, toDate, status, search)
    }, [toDate, status, search])

    console.log(fromDate, toDate)

    let HandleFilters = (e) => {
        setFilters(e.target.value)
        let TempFromDate, TempToDate;
        switch (e.target.value) {
            case "0":
                TempFromDate = "";
                TempToDate = ""
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
            case "1":
                TempFromDate = "";
                TempToDate = ""
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
            case "2":
                TempFromDate = moment().format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
            case "3":
                TempFromDate = moment().add(-1, 'days').format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
            case "4":
                TempFromDate = moment().add(-7, 'days').format('YYYY-MM-DD')
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
            case "5":
                TempFromDate = moment().add(-30, 'days').format('YYYY-MM-DD');
                TempToDate = moment().format('YYYY-MM-DD')
                setFromDate(TempFromDate);
                setToDate(TempToDate);
                break;
        }
    }

    return (
        <div className={`w-100 mt-4 d-flex justify-content-between align-items-center flex-lg-row flex-md-row flex-column ${styles['operations']}`}>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">

                <DatePicker
                    label={t('From date')}
                    value={fromDate === "" ? null : fromDate}
                    onChange={(e) => { setFromDate(e); setToDate("") }}
                    disabled={filters !== "0"}
                    format="DD-MM-YYYY"
                    autoOk
                />
                <DatePicker
                    value={toDate === "" ? null : toDate}
                    label={t("To Date")}
                    format="DD-MM-YYYY"
                    onChange={(e) => setToDate(e)}
                    disabled={filters !== "0"}
                    autoOk
                />
            </div>
            <TextField label={t('Search Trips')} value={search} onChange={e => setSearch(e.target.value)} style={{ width: '30%' }} />
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">
                <TextField
                    select
                    label={t("Filters")}
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
                    label={t("Status")}
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="all">{t('All')}</option>
                    <option value="settled">{t('Settled')}</option>
                    <option value="not_settled">{t('Not Settled')}</option>


                </TextField>
                <Button startIcon={<Add />} variant="contained" onClick={() => router.push({ pathname: '/trip/create' })} color="primary">{t('Create Trip')}</Button>
            </div>
        </div>
    )
}
