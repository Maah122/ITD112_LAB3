// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './styles.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>MENU</h2>
      <ul>
        <li><Link to="/">Show Data Set</Link></li>
        <li><Link to="/add-data">Add Data</Link></li>
        <li><Link to="/upload-csv">Upload CSV</Link></li>
        <li><Link to="/mapdata">Philipppines Heat Map</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
