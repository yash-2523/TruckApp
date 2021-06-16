import React, { useContext, useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { useStyles } from './MaterialStyles';
import GlobalLoader from '../GlobalLoader';
import { useTheme } from '@material-ui/core/styles';
import SideNavBar from './SideNavBar';
import NavBar from './NavBar';
import { currentUser } from '../../Services/AuthServices';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import styles from '../../styles/Home.module.scss'
import {useRouter} from 'next/router';
// import { useRouter } from '../../.next/server/pages/trip';

function Home(props) {
  const { window } = props;
  const Component = props.Component;
  const pageProps = props.pageProps;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  

  const container = window !== undefined ? () => window().document.body : undefined;
  const {globalLoading } = useContext(GlobalLoadingContext)
  const [user,setUser] = useState(currentUser.value);
  useEffect(() => {
    const AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
    })

    return () => {
      AuthObservable.unsubscribe();
    }
  },[])
  
  if(user===null){
    router.push({pathname: "/"})
  }

  return (
    <>
      {globalLoading && <GlobalLoader />}
      <div className={classes.root}>
        <NavBar handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              <SideNavBar></SideNavBar>
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <SideNavBar></SideNavBar>
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={`w-100 h-100 mt-lg-5 mt-md-5 mt-4 pt-lg-3 pt-md-3 pt-4 ${styles['main-container']}`}>
            <Component {...pageProps} /> 
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;