import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [tableRows, setTableRows] = useState([]);
  const [passengerData, setPassengerData] = useState({ labels: [], values: [], total: 0 });

  return (
    <DataContext.Provider value={{ tableRows, setTableRows, passengerData, setPassengerData }}>
      {children}
    </DataContext.Provider>
  );
}; 