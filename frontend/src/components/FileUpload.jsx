import React, { useState, useContext } from 'react';
import { DataContext } from './DataContext';

const FileUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const { setTableRows, setPassengerData } = useContext(DataContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/json'];
      const validExtensions = ['.csv', '.json'];
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();
      const isValid = validTypes.includes(fileType) || validExtensions.some(ext => fileName.endsWith(ext));
      if (!isValid) {
        setError('Only CSV or JSON files are allowed.');
        setFile(null);
        setStatus('');
        return;
      }
      setFile(selectedFile);
      setStatus('');
      setError('');
    }
  };

  const fetchPassengerData = async () => {
    try {
      const response = await fetch('/api/passenger_data');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTableRows(
          data.map(row => [
            row.timestamp,
            row.airline,
            row.destination,
            row.passengers,
            row.revenue,
            { trend: Math.random() > 0.5 ? 'up' : 'down', value: `${(Math.random() * 20).toFixed(1)}%` },
            row.gender || 'N/A',
            row.age_group || 'N/A',
          ])
        );
        setPassengerData({
          labels: data.map(row => row.timestamp.split('T')[0]),
          values: data.map(row => row.passengers),
          total: data.reduce((sum, row) => sum + (row.passengers || 0), 0),
        });
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setWarning('');
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setStatus(`File uploaded: ${data.filename}`);
        setFile(null);
        if (data.warning) {
          setWarning(data.warning);
        }
        await fetchPassengerData();
        if (onDataProcessed && data.data) {
          onDataProcessed(data.data);
        }
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch (err) {
      setError('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload a File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv,.json" onChange={handleFileChange} className="mb-2" />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <div aria-live="polite" className="min-h-[24px] mt-2">
        {status && <div className="text-green-600 text-sm" role="status">{status}</div>}
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        {warning && <div className="text-yellow-600 text-sm" role="alert">{warning}</div>}
      </div>
    </div>
  );
};

export default FileUpload; 