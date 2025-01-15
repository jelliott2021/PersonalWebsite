import React from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarBio from '../main/sideBarBio';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => (
  <>
    <Header />
    <div id='main' className='main'>
      <SideBarBio />
      <div id='right_main' className='right_main' style={{ backgroundColor: 'whitesmoke' }}>
        <Outlet />
      </div>
    </div>
  </>
);

export default Layout;
