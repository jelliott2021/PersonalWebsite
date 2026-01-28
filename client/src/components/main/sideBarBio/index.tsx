import React, { useState } from 'react';
import { Button } from 'antd';
import { GoSidebarCollapse } from 'react-icons/go';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import './index.css';

const SideBarBio = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sideBarNav ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <div className='profileSection'>
          <img
            src='/linkedin.jpg'
            alt='Profile'
            className='profilePicture'
          />
          <h2 className='profileName'>John Elliott</h2>
          <h4 className='profileTitle'>Software Engineer</h4>

          <p className='profileInfo'>B.S. in Computer Science</p>
          <p className='profileInfo'>Northeastern University</p>
          <p className='profileInfo'>Boston, MA</p>

          <br />

          <p className='profileInfo'>elliott.joh@northeastern.edu</p>
          <p className='profileInfo'>617-615-7955</p>

          <div className='socialLinks'>
            <a href='https://github.com/jelliott2021' target='_blank' rel='noopener noreferrer'>
              <FiGithub size={20} />
            </a>
            <a
              href='https://www.linkedin.com/in/jelliott2002'
              target='_blank'
              rel='noopener noreferrer'>
              <FiLinkedin size={20} />
            </a>
            <a href='mailto:elliott.joh@northeastern.edu' target='_blank' rel='noopener noreferrer'>
              <FiMail size={20} />
            </a>
          </div>

          <a href='/John-Elliott-Resume.pdf' download className='downloadCV'>
            Download Resume
          </a>
        </div>
      )}
      <div className='toggleButton'>
        <Button onClick={toggleCollapsed}>
          <GoSidebarCollapse
            style={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default SideBarBio;
