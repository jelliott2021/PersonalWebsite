import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, MenuProps, Typography, Modal, Menu, Drawer, Button } from 'antd';
import { FaConnectdevelop } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { PiCaretRight } from 'react-icons/pi';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import useHeader from '../../hooks/useHeader';

const { Title } = Typography;
const { confirm } = Modal;

const Header = () => {
  const { handleLogout } = useHeader();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [selectedKey, setSelectedKey] = useState('/home');

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const showLogoutConfirm = () => {
    confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleLogout();
      },
    });
  };

  type MenuItem = Required<MenuProps>['items'][number];

  const menuItems = (): MenuItem[] => [
    { key: '/home', label: 'About Me' },
    { key: '/experience', label: 'Education & Experience' },
    { key: '/skills', label: 'Skills' },
    { key: '/projects', label: 'Projects' },
  ];

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  const profileItems: MenuProps['items'] = [
    {
      key: 'title',
      label: 'My Account',
      disabled: true,
      className: 'dropdown-item-disabled',
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: (
        <div onClick={() => navigate(`/profile/${user._id}`)} className="dropdown-item">
          <span className="dropdown-align">
            <FaCircleUser className="dropdown-icon" />
            <span>Profile</span>
          </span>
          <PiCaretRight className="dropdown-arrow" />
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={showLogoutConfirm} className="dropdown-item">
          <span className="dropdown-align">
            <IoLogOutOutline className="dropdown-icon" />
            <span>Logout</span>
          </span>
          <PiCaretRight className="dropdown-arrow" />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth <= 768;
      setIsSmallScreen(smallScreen);
      if (!smallScreen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="custom-header">
      <div onClick={() => navigate('/home')} className="logo-container">
        <Title
          level={2}
          className="logo-text">
          <FaConnectdevelop /> John Edward Elliott
        </Title>
      </div>

      {isSmallScreen ? (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            className="menu-toggle-btn"
          />
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setIsDrawerOpen(false)}
            open={isDrawerOpen}
            className="menu-drawer">
            <Menu
              mode="vertical"
              theme="dark"
              items={menuItems()}
              onClick={handleMenuClick}
              selectedKeys={[selectedKey]}
            />
          </Drawer>
        </>
      ) : (
        <Menu
          mode="horizontal"
          theme="dark"
          items={menuItems()}
          onClick={handleMenuClick}
          selectedKeys={[selectedKey]}
          className="desktop-menu"
        />
      )}

      <div className="header-actions">
        <Dropdown
          menu={{ items: profileItems }}
          trigger={['click']}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}>
          <Avatar
            size={36}
            shape="circle"
            src={user.picture}
            icon={!user.picture && <FaCircleUser size={'10x'} color="#1e1e2f" />}
            alt={`${user.username} profile`}
            className="profile-avatar"
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
