import React from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarBio from '../main/sideBarBio';
import Header from '../header';

const Layout: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
    <Header />
    <div id="main" className="main">
      <SideBarBio />
      <div id="right_main" className="right_main">
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;

