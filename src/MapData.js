import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import philippineData from './ph.json'; // GeoJSON data for the Philippines
import "leaflet/dist/leaflet.css";
import "./MapData.css";

const MapData = () => {
    const [geoJsonData, setGeoJsonData] = useState(null);

    // Function to normalize strings for comparison
    const normalizeString = (str) => str.toUpperCase().trim();

    // Fetch and process data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from Firestore
                const dengueCollection = collection(db, "dengueData");
                const dengueSnapshot = await getDocs(dengueCollection);
                const dengueData = dengueSnapshot.docs.map((doc) => ({
                    region: normalizeString(doc.data().Region || ""),
                    cases: Number(doc.data().cases || 0)
                }));

                // Aggregate cases by region
                const aggregatedData = dengueData.reduce((acc, { region, cases }) => {
                    acc[region] = (acc[region] || 0) + cases;
                    return acc;
                }, {});

                // Update GeoJSON with aggregated cases
                const updatedGeoJson = {
                    ...philippineData,
                    features: philippineData.features.map((feature) => {
                        const regionName = normalizeString(feature.properties.name);
                        const cases = aggregatedData[regionName] || 0;
                        return {
                            ...feature,
                            properties: {
                                ...feature.properties,
                                cases // Add cases to GeoJSON properties
                            }
                        };
                    })
                };

                setGeoJsonData(updatedGeoJson);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Function to determine color based on cases
    const getColor = (cases) => {
        return cases > 100000 ? '#800026' :
               cases > 90000  ? '#BD0026' :
               cases > 80000  ? '#E31A1C' :
               cases > 70000  ? '#FF4D1A' :
               cases > 60000 ? '#FF6F3C' :
               cases > 50000  ? '#FF924A' :
               cases > 40000 ? '#FFB566' :
               cases > 30000 ? '#FFDA80' :
               cases > 20000 ? '#FFF200' :
               cases > 1000  ? '#FFEB00' :
                                '#FFE500';
    };

    // Style function for GeoJSON features
    const styleFeature = (feature) => {
        const cases = feature.properties.cases || 0;
        return {
            fillColor: getColor(cases),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    // Tooltip binding for each region
    const onEachFeature = (feature, layer) => {
        const cases = feature.properties.cases || 0;
        layer.bindTooltip(
            `<strong>${feature.properties.name}</strong><br>Cases: ${cases}`,
            { direction: "top", className: "custom-tooltip", permanent: false }
        );
    };

    return (
        <div className="map-container">
            <h1>Philippines Dengue Cases Choropleth Map</h1>
            <MapContainer 
                center={[12.8797, 121.7740]} // Coordinates for the Philippines
                zoom={6} // Initial zoom level
                className="leaflet-container"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
                />
                {geoJsonData && (
                    <GeoJSON 
                        data={geoJsonData} // Pass updated GeoJSON data
                        style={styleFeature} // Style regions based on cases
                        onEachFeature={onEachFeature} // Add tooltips
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapData;
