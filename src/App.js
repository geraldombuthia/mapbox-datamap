import "./App.css";
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Card } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, GeolocateControl, NavigationControl } from "react-map-gl";

import CSVReader from "./Components/CSVReader";

const TOKEN = process.env.REACT_APP_TOKEN;

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  fill: "#00AB55",
  stroke: "none",
};
Pin.propTypes = {
  size: PropTypes.number,
};

function Pin(props) {
  const { size = 20 } = props;

  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  );
}
function round5(value) {
  return (Math.round(value * 1e5) / 1e5).toFixed(5);
}
const eventNames = ["onDragStart", "onDrag", "onDragEnd"];

ControlPanel.propTypes = {
  events: PropTypes.object,
};

function ControlPanel(props) {
  return (
    <div className="control-panel">
      <h3>Draggable Marker</h3>
      <div>
        {eventNames.map((eventName) => {
          const { events = {} } = props;
          const lngLat = events[eventName];
          return (
            <div key={eventName}>
              <strong>{eventName}:</strong>{" "}
              {lngLat ? (
                `${round5(lngLat.lng)}, ${round5(lngLat.lat)}`
              ) : (
                <em>null</em>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function App() {
  const [marker, setMarker] = useState({
    latitude: -1.2833,
    longitude: 36.8166,
  });
  const [events, logEvents] = useState({});

  const [data, setData] = useState([]);

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const handleDataUpdate = (data) => {
    setData(data);
  };

  console.log(events);
  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
  }, []);
  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: 600,
        }}
      >
        <Map
          initialViewState={{
            longitude: 36.8166,
            latitude: -1.2833,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={TOKEN}
        >
          {data.slice(1).map((item, index) => (
            <Tooltip
              title={
                <div>
                  <div>Time: {item.time}</div>
                  <div>CO (ppm): {item["co"]}</div>
                  <div>CO2 (ppm): {item["co2"]}</div>
                  <div>VOC (ppm): {item["voc"]}</div>
                  <div>LPG (ppm): {item["lpg"]}</div>
                  <div>PM2.5 (ug/m3): {item["pm25"]}</div>
                  <div>PM10.0 (ug/m3): {item["pm10"]}</div>
                  <div>Humidity (%): {item["humidity"]}</div>
                  <div>Temp (C): {item["temp"]}</div>
                </div>
              }
              placement="top"
            >
              {console.log(item.temperature || 0)}
              <Marker
                key={index}
                longitude={parseFloat(item.longitude) || 0}
                latitude={parseFloat(item.latitude) || 0}
                anchor="bottom"
              >
                <Pin size={20} sx={{ color: "#00AB55" }} />
              </Marker>
            </Tooltip>
          ))}

          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin size={20} sx={{ color: "#00AB55" }} />
          </Marker>
          <GeolocateControl position="bottom-right" />
          <NavigationControl position="bottom-right" />
        </Map>
      </Card>
      <Card>
        <CSVReader onDataUpdate={handleDataUpdate} />
        {data.slice(1).map((item, index) => (
          <pre key={index}>
            {index}, {item.longitude}
          </pre>
          // <Marker
          //   key={index}
          //   longitude={item.longitude}
          //   latitude={item.latitude}
          //   anchor="bottom"
          // >
          //   <Pin size={20} sx={{ color: "#00AB55" }} />
          // </Marker>
        ))}
      </Card>
    </>
  );
}

export default App;
