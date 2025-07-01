import React from 'react';
import '../css/Loading.scss'; // Asegúrate de crear este archivo CSS
import LoadingSpinner from '.';

const Loading = () => {
  return (
    <>
    
   
        {/* <img
          src="../../assets/xd1.gif"
          alt="xd"
          style={{
            width: "300px",
            height: "200px",
          }}
        />
        <div class="loader"></div> */}
        <div className="loading-screen">

        <div style={{
            margin:"auto!important",
            
            }}>
        <div id="wrapper">
  <div id="mouse"></div>
  <div className="loader">
  </div>
  <div className="loading-bar">
    <div className="progress-bar"></div>
  </div>
  <div className="status">
    <div className="state"></div>
    <div className="percentage"></div>
  </div>
</div>
      
</div>
</div> 
    </>
  );
};

export default Loading;






