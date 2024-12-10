import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import AddDengueData from './AddDengueData'; 
import DengueDataList from './DengueDataList';
import CSVUploader from './CSVUploader';
import MapData from './MapData';

import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <h1>Dengue Data CRUD App</h1>
          <Routes>
            <Route path="/" element={<DengueDataList />} />
            <Route path="/add-data" element={<AddDengueData />} />
            <Route path="/upload-csv" element={<CSVUploader />} />
            <Route path="/mapdata" element={<MapData />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
