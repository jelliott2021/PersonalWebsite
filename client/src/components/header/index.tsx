import React, { useState, useEffect } from 'react';
import { MenuProps, Typography, Menu, Drawer, Button } from 'antd';
import { FaConnectdevelop } from 'react-icons/fa';
import { MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const { Title } = Typography;

const Header = () => {
  // eslint-disable-next-line no-console
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('#about-me');

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedKey('#about-me');
    } else if (location.pathname === '/projects') {
      setSelectedKey('/projects');
    }
  }, [location.pathname]);

  useEffect(() => {
    const scrollContainer = document.getElementById('right_main');
    if (!scrollContainer) return undefined;

    const handleScroll = () => {
      // Only track scroll on home page
      if (location.pathname !== '/') return;

      const sections = ['about-me', 'education-experience', 'skills'];
      const scrollPosition = scrollContainer.scrollTop + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setSelectedKey(`#${sections[i]}`);
          break;
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  type MenuItem = Required<MenuProps>['items'][number];

  const menuItems = (): MenuItem[] => [
    { key: '#about-me', label: 'About Me' },
    { key: '#education-experience', label: 'Education & Experience' },
    { key: '#skills', label: 'Skills' },
    { key: '/projects', label: 'Projects' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const scrollContainer = document.getElementById('right_main');
    
    if (element && scrollContainer) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      scrollContainer.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    setSelectedKey(e.key);
    setIsDrawerOpen(false);
    
    if (e.key.startsWith('#')) {
      const sectionId = e.key.substring(1);
      
      // If not on home page, navigate there first, then scroll
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(sectionId), 100);
      } else {
        scrollToSection(sectionId);
      }
    } else {
      // Regular navigation
      navigate(e.key);
    }
  };

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
      <div onClick={() => navigate('/')} className="logo-container">
        <Title level={2} className="logo-text">
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
    </div>
  );
};

export default Header;
