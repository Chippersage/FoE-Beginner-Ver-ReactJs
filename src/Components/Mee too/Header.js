import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img 
        src={`${process.env.PUBLIC_URL}/audio/common/FoELogo_105x57.png`} 
        alt="FoE Logo" 
        className="left-logo"
      />
      <div className="header-text">
        <h1>
          <span style={{ fontSize: '1.2em', color: '#ffffff', padding: '0px' }}>
            Flow Of English Beginner
          </span>
          </h1>
        </div>
      {/* <img 
        src={`${process.env.PUBLIC_URL}/audio/common/ChipperSageLearningConcepts_178x53.png`} 
        alt="Chipper Sage Logo" 
        className="logo left-logo"
      />
      <div className="header-text">
        <h1>
          <span style={{ fontSize: '1.2em', color: '#ffffff', padding: '0px' }}>
            Flow Of English Beginner
          </span>
          <span style={{ fontSize: '0.5em', display: 'inline-block', color: '#aaaaaa', textShadow: 'none' }}>
            &copy; 2015-16, Chipper Sage Education Pvt. Ltd. All rights reserved.
          </span>
        </h1>
      </div> */}
      
    </header>
  );
};

export default Header;
