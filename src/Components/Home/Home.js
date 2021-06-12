import React, { useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import './style.scss'
import { useStyles } from './MaterialStyles';

import { useTheme } from '@material-ui/core/styles';
import SideNavBar from './SideNavBar';
import NavBar from './NavBar';
import { Route, Switch } from 'react-router';
import Trip from './Trip/Trip';
import { BrowserRouter } from 'react-router-dom';
import TripContextProvider from '../../Context/TripContext';
import { cur, currentUser } from '../../Services/AuthServices';

function Home(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  

  const container = window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    if(currentUser.value === null){
      window.location = "/"
    }
  },[])

  return (
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
          <div className="w-100 h-100 mt-lg-5 mt-md-5 mt-4 pt-lg-3 pt-md-3 pt-4 main-container">
              <Switch>
                
                <Route path="/trip"><TripContextProvider><Trip /></TripContextProvider></Route>
                <Route path="/truck"><div>truck</div></Route>
                <Route path="/settings"><div>Settings</div></Route>
                <Route path="/"><div>/</div></Route>
              </Switch> 
          </div>
        </main>
      </div>
  );
}

export default Home;