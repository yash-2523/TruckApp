import styles from '../../../styles/Settings.module.scss'
import { MdChevronRight } from 'react-icons/md'
import Link from 'next/link'

const SettingsCard = ({children,bg,href}) => {
    return ( 
        <Link href={href?href:''}>
            <a className={`d-flex justify-content-between align-items-stretch ${styles.settings_card}`} style={{background: bg}}>
                <div className={` ${styles.content}`}>
                    {children}
                </div>
                <div className={`d-flex justify-content-center align-items-center ${styles.right_div}`}><MdChevronRight className={styles.right}/></div>
            </a>
        </Link>

     );
}
 
export default SettingsCard;