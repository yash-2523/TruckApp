import { FiLogOut } from 'react-icons/fi';
import { Button } from '@material-ui/core'
import { useContext, useState } from 'react'

import SettingsCard from '../../Components/Home/settings/SettingsCard'
import styles from '../../styles/Settings.module.scss'
import { SignOut } from '../../Services/AuthServices'
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { currentUser, getUser } from '../../Services/AuthServices';



export default function Settings() {

    const { setGlobalLoading } = useContext(GlobalLoadingContext)
    const [user, setUser] = useState(currentUser.value);

    let handleLogout = async () => {
        setGlobalLoading(true);
        let signOutResponse = await SignOut();
        setGlobalLoading(false);

        if (!signOutResponse) {
            toast.error("Unable to Logout")
        }
    }
    return (
        <div className="w-100 p-3">
            <div className="custom_container p-4">
                <div className="d-flex flex-wrap justify-content-between mb-5">
                    <SettingsCard href='/dashboard/profile' bg="#0B1B32">
                        <div className="d-flex w-100 h-100 justify-content-between align-items-center">
                            <div className={`d-flex justify-content-center align-items-center ${styles.dp}`}>{currentUser.value?.name?.split(' ').map(word => word.charAt(0).toUpperCase())}</div>
                            <div className="d-flex flex-column flex-grow-1 mx-3" style={{ color: '#fff' }}>
                                <div style={{ fontWeight: 600 }}>{currentUser.value?.name}</div>
                                <div style={{ fontSize: '.7rem' }}>{currentUser.value?.phone}</div>
                            </div>
                        </div>
                    </SettingsCard>

                    <SettingsCard href='' bg="#251F47">
                        <div className="d-flex w-100 h-100 justify-content-between align-items-center">
                            <div className="report_text" style={{ width: '44%' }}>
                                <div style={{ color: '#fff' }}>Daily Profit and Loss</div>
                                <div style={{ fontWeight: 'bold', color: '#5D38C4' }}>Activity Report</div>
                            </div>
                            <img style={{ width: '55%' }} src="./settings/report.svg" alt="" />
                        </div>
                    </SettingsCard>
                </div>

                <div className='d-flex justify-content-between'>
                    <Button startIcon={<FiLogOut />} onClick={handleLogout} style={{ fontWeight: 'bold' }}>
                        Logout
                    </Button>
                    <div className="d-flex flex-column" style={{ fontSize: '.8rem', textAlign: 'right' }}>
                        <div style={{ color: '#8F91A2' }}><img className="mx-1" src='./settings/safe.svg' />100% Safe and Secure</div>
                        <div>Version 0.1</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
