import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';
import AlchemixLogo from '../../../assets/images/Alchemix_logo.png'

const MainNavigation = props => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation_drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation_menu-btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <div className='main_navi_left'>
          <img src={AlchemixLogo} className="main-navigation_logo" alt="Alchemix logo" />
          <h1 className="main-navigation_title">
            <Link to="/">Alchemix</Link>
          </h1>
        </div>
        <nav className="main-navigation_header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
