import React from 'react';
import './index.css';

const UnderConstructionPage: React.FC = () => (
  <div className='construction-container'>
    <div className='lights-effect'></div>
    <div className='content'>
      <h1>🚧 Under Construction 🚧</h1>
      <p>Pardon our appearance while being improved</p>
      <div className='loader'></div>
    </div>
  </div>
);

export default UnderConstructionPage;
