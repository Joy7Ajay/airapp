import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const MapChart = ({ title, markers = [] }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center min-h-[300px]">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <ComposableMap projectionConfig={{ scale: 120 }} width={600} height={300}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => (
            <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
          ))
        }
      </Geographies>
      {markers.map(({ name, coordinates, passengerCount }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={10} fill="#1a73e8" />
          <text textAnchor="middle" y={-15} style={{ fontSize: '12px' }}>{name} ({passengerCount})</text>
        </Marker>
      ))}
    </ComposableMap>
  </div>
);

export default MapChart; 