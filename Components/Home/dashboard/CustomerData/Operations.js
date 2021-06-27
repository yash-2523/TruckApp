import { InputAdornment, TextField } from '@material-ui/core'
import { SearchOutlined } from '@material-ui/icons'
import homestyles from '../../../../styles/Home.module.scss'
import INRIcon from '../../svg/InrIcon.svg'
import ToReceiveIcon from './svg/ToReceive.svg';
import ToPayIcon from './svg/ToPay.svg';
import styles from '../../../../styles/CustomerBalanceInfo.module.scss'

export default function Operations(props) {
    return (
        <div className={`w-100 mt-5 d-flex justify-content-between align-items-center flex-lg-row flex-md-row flex-column ${homestyles['operations']}`}>
            <div className={`d-flex align-items-center justify-content-evenly flex-wrap ${styles['balance-info-container']}`}>
                 <span className={`d-flex justify-content-center align-items-center px-5 py-1 position-relative rounded-3 ${styles['balance-info']}`}>
                    <i className={`position-absolute ${styles['balance-info-icon']}`}><ToReceiveIcon /></i>
                    <span className={`d-flex justify-content-between flex-column align-items-center mx-2`}>
                        <span><INRIcon className="mb-1" /> {`${props.balance?.to_receive || ""}/-`}</span>
                        <p>To Receive</p>
                    </span>
                 </span>   
                 <span className={`d-flex justify-content-center align-items-center px-5 py-1 position-relative rounded-3 ${styles['balance-info']}`}>
                    <i className={`position-absolute ${styles['balance-info-icon']}`}><ToPayIcon /></i>
                    <span className={`d-flex justify-content-between flex-column align-items-center mx-2`}>
                        <span><INRIcon className="mb-1" /> {`${props.balance?.to_pay || ""}/-`}</span>
                        <p>To Pay</p>
                    </span>
                 </span>   
            </div>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">
                <TextField 
                    placeholder="Search Customer"
                    type="search"
                    variant="outlined"
                    style={{backgroundColor: "white"}}
                    InputProps = {{
                        startAdornment: (
                            <InputAdornment>
                                <SearchOutlined />
                            </InputAdornment>
                        )
                    }}
                    onChange={(e) => props.HandleSearch(e.target.value)}
                />
            </div>
        </div>
    )
}
