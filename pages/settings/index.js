import { FiLogOut } from 'react-icons/fi';
import {Button} from '@material-ui/core'

import SettingsCard from '../../Components/Home/settings/SettingsCard'
import styles from '../../styles/Settings.module.scss'

export default function Settings() {
    return (
        <div className="w-100 p-3">
            <div className="custom_container p-4">
                <div className="d-flex flex-wrap justify-content-between mb-5">
                    <SettingsCard bg="#0B1B32">
                        
                    </SettingsCard>

                    <SettingsCard bg="#FFA98C">
                        
                    </SettingsCard>

                    <SettingsCard bg="#251F47">
                        
                    </SettingsCard>
                </div>

                <div className='d-flex justify-content-between'>
                    <Button startIcon={<FiLogOut />} style={{fontWeight: 'bold'}}>
                        Logout
                    </Button>
                    <div className="d-flex flex-column" style={{fontSize: '.8rem'}}>
                        <div style={{color:'#8F91A2'}}>100% Safe and Secure</div>
                        <div>Version 0.1</div>
                    </div>

                </div>
            </div>
        </div>
    )
}
