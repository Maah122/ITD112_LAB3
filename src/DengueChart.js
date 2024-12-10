// src/Chart.js
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

// Customized Label component for the LineChart
class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props;

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  }
}

// Customized Axis Tick component for the LineChart
class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  }
}

const Chart = ({ data }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "50px" }}>
      {/* Bar Chart */}
      <div style={{ width: "100%", height: 500 }}>
        <h3>Dengue Cases and Deaths (Bar Chart)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="10%"  
              barGap={2}            
              barSize={40}         
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#8884d8" name="Cases" />
              <Bar dataKey="deaths" fill="#82ca9d" name="Deaths" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div style={{ width: "100%", height: 500 }}>
        <h3>Dengue Cases and Deaths (Line Chart)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" height={60} tick={<CustomizedAxisTick />} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cases" 
              stroke="#8884d8" 
              label={<CustomizedLabel />} 
              activeDot={{ r: 8 }} 
              name="Cases"
            />
            <Line 
              type="monotone" 
              dataKey="deaths" 
              stroke="#82ca9d" 
              name="Deaths"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
