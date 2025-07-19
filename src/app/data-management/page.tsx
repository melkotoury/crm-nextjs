'use client';

import { useState, useEffect } from 'react';

interface DataImport {
  import_id: string;
  file_name: string;
  file_type?: string;
  status?: string;
  imported_by?: string;
  imported_at?: string;
}

interface DataExport {
  export_id: string;
  file_name: string;
  file_type?: string;
  status?: string;
  exported_by?: string;
  exported_at?: string;
}

export default function DataManagementPage() {
  const [dataImports, setDataImports] = useState<DataImport[]>([]);
  const [dataExports, setDataExports] = useState<DataExport[]>([]);

  const [importFormData, setImportFormData] = useState({
    file_name: '',
    file_type: '',
    status: 'Pending',
    imported_by: '',
  });

  const [exportFormData, setExportFormData] = useState({
    file_name: '',
    file_type: '',
    status: 'Pending',
    exported_by: '',
  });

  useEffect(() => {
    fetchDataImports();
    fetchDataExports();
  }, []);

  const fetchDataImports = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            dataImports {
              import_id
              file_name
              file_type
              status
              imported_by
              imported_at
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.dataImports) {
      setDataImports(result.data.dataImports);
    }
  };

  const fetchDataExports = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            dataExports {
              export_id
              file_name
              file_type
              status
              exported_by
              exported_at
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.dataExports) {
      setDataExports(result.data.dataExports);
    }
  };

  const handleImportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setImportFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExportFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddDataImport($file_name: String!, $file_type: String, $status: String, $imported_by: ID) {
            addDataImport(file_name: $file_name, file_type: $file_type, status: $status, imported_by: $imported_by) {
              import_id
              file_name
              status
            }
          }
        `,
        variables: importFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addDataImport) {
      setDataImports((prevImports) => [...prevImports, result.data.addDataImport]);
      setImportFormData({
        file_name: '',
        file_type: '',
        status: 'Pending',
        imported_by: '',
      });
    }
  };

  const handleAddExport = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddDataExport($file_name: String!, $file_type: String, $status: String, $exported_by: ID) {
            addDataExport(file_name: $file_name, file_type: $file_type, status: $status, exported_by: $exported_by) {
              export_id
              file_name
              status
            }
          }
        `,
        variables: exportFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addDataExport) {
      setDataExports((prevExports) => [...prevExports, result.data.addDataExport]);
      setExportFormData({
        file_name: '',
        file_type: '',
        status: 'Pending',
        exported_by: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Data Import Record</h2>
        <form onSubmit={handleAddImport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="file_name"
            placeholder="File Name"
            value={importFormData.file_name}
            onChange={handleImportInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="file_type"
            placeholder="File Type (e.g., CSV, JSON)"
            value={importFormData.file_type}
            onChange={handleImportInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={importFormData.status}
            onChange={handleImportInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            type="text"
            name="imported_by"
            placeholder="Imported By User ID (Optional)"
            value={importFormData.imported_by}
            onChange={handleImportInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Import Record
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Data Import Records</h2>
        {dataImports.length === 0 ? (
          <p>No import records found.</p>
        ) : (
          <ul className="space-y-2">
            {dataImports.map((record) => (
              <li key={record.import_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{record.file_name} (Status: {record.status})</p>
                {record.file_type && <p className="text-sm text-gray-600">Type: {record.file_type}</p>}
                {record.imported_by && <p className="text-sm text-gray-600">Imported By: {record.imported_by}</p>}
                {record.imported_at && <p className="text-sm text-gray-600">At: {record.imported_at}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Data Export Record</h2>
        <form onSubmit={handleAddExport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="file_name"
            placeholder="File Name"
            value={exportFormData.file_name}
            onChange={handleExportInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="file_type"
            placeholder="File Type (e.g., CSV, JSON)"
            value={exportFormData.file_type}
            onChange={handleExportInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={exportFormData.status}
            onChange={handleExportInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            type="text"
            name="exported_by"
            placeholder="Exported By User ID (Optional)"
            value={exportFormData.exported_by}
            onChange={handleExportInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Export Record
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Data Export Records</h2>
        {dataExports.length === 0 ? (
          <p>No export records found.</p>
        ) : (
          <ul className="space-y-2">
            {dataExports.map((record) => (
              <li key={record.export_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{record.file_name} (Status: {record.status})</p>
                {record.file_type && <p className="text-sm text-gray-600">Type: {record.file_type}</p>}
                {record.exported_by && <p className="text-sm text-gray-600">Exported By: {record.exported_by}</p>}
                {record.exported_at && <p className="text-sm text-gray-600">At: {record.exported_at}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}