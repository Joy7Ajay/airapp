import React, { useState } from 'react';

const FileUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
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
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <div aria-live="polite" className="min-h-[24px] mt-2">
        {status && <div className="text-green-600 text-sm" role="status">{status}</div>}
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
      </div>
    </div>
  );
};

export default FileUpload; 