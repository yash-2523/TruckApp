import styles from '../../../styles/Settings.module.scss'

const SettingsCard = ({children,bg}) => {
    return ( 
        <div className={`${styles.settings_card}`} style={{background: bg}}>
            {
                children
            }
        </div>
     );
}
 
export default SettingsCard;