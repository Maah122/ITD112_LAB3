import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Plot from "react-plotly.js";
import "./styles.css";

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          location: data.loc, // mapping loc to location
          cases: Number(data.cases), // converting cases from string to number
          deaths: Number(data.deaths), // converting deaths from string to number
          date: data.date,
          regions: data.Region, // mapping Region to regions
        };
      });
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "dengueData", id));
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "dengueData", editingId), {
        ...editForm,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
      });
      setDengueData(
        dengueData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const uniqueRegions = [...new Set(dengueData.map((data) => data.regions))];
  const regionsWithData = uniqueRegions.filter((region) =>
    dengueData.some((data) => data.regions === region)
  );

  const filteredData = dengueData.filter(
    (data) =>
      (data.location && data.location.toLowerCase().includes(filterText.toLowerCase())) &&
      (!filterRegion || data.regions === filterRegion)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const calculateCorrelation = (x, y) => {
    if (x.length === 0 || y.length === 0) return NaN;
    const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const meanX = mean(x);
    const meanY = mean(y);
    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denominator = Math.sqrt(
      x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) *
      y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
    );
    return denominator ? numerator / denominator : NaN;
  };

  const correlationMatrix = regionsWithData.map((region1) =>
    regionsWithData.map((region2) => {
      const cases1 = dengueData.filter((data) => data.regions === region1).map((data) => data.cases);
      const cases2 = dengueData.filter((data) => data.regions === region2).map((data) => data.cases);
      return calculateCorrelation(cases1, cases2);
    })
  );

  // Defining the heatmapData based on the correlation matrix
  const heatmapData = {
    z: correlationMatrix.map((row) => row.map((value) => (isNaN(value) ? 0 : value))),
    x: regionsWithData,
    y: regionsWithData,
    type: "heatmap",
    colorscale: "Viridis",
    zmin: -1,
    zmax: 1,
    showscale: true,
  };

  return (
    <div className="dengue-data-list">
      <h2>Dengue Data List</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by location"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          {uniqueRegions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      <div className="bar-chart-container">
        <h3>Cases and Deaths by Location</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cases" fill="#8884d8" />
            <Bar dataKey="deaths" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="data-table">
        <h3>Dengue Data Table</h3>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data) => (
              <tr key={data.id}>
                <td>{data.location}</td>
                <td>{data.cases}</td>
                <td>{data.deaths}</td>
                <td>
                  <button onClick={() => handleEdit(data)}>Edit</button>
                  <button onClick={() => handleDelete(data.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Heatmap */}
      <div className="heatmap-container">
        <h3>Correlation Heatmap</h3>
        <Plot data={[heatmapData]} layout={{ title: "Correlation Heatmap", autosize: true }} />
      </div>
    </div>
  );
};

export default DengueDataList;
