import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { useTheme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { currentUser } from '../../Services/AuthServices';
import styles from '../../styles/Home.module.scss';
import GlobalLoader from '../GlobalLoader';
import { useStyles } from './MaterialStyles';
import NavBar from './NavBar';
import SideNavBar from './SideNavBar';

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
  const { globalLoading } = useContext(GlobalLoadingContext)
  const [user, setUser] = useState(currentUser.value);
  useEffect(() => {
    const AuthObservable = currentUser.subscribe((data) => {
      setUser(data);
      console.log(data)
    })

    return () => {
      AuthObservable.unsubscribe();
    }
  }, [])

  if (user === null) {
    router.push({ pathname: "/" })
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
          <div className={`w-100 h-100 mt-lg-5 mt-md-5 mt-4 pt-lg-4 pt-md-4 pt-4 ${styles['main-container']}`} id="main-container">
            <Component {...pageProps} />
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;