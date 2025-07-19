'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_DATA_IMPORTS = gql`
  query GetDataImports {
    dataImports {
      import_id
      file_name
      file_type
      status
      imported_by
      imported_at
    }
  }
`;

const ADD_DATA_IMPORT = gql`
  mutation AddDataImport(
    $file_name: String!
    $file_type: String
    $status: String
    $imported_by: ID
  ) {
    addDataImport(
      file_name: $file_name
      file_type: $file_type
      status: $status
      imported_by: $imported_by
    ) {
      import_id
    }
  }
`;

const GET_DATA_EXPORTS = gql`
  query GetDataExports {
    dataExports {
      export_id
      file_name
      file_type
      status
      exported_by
      exported_at
    }
  }
`;

const ADD_DATA_EXPORT = gql`
  mutation AddDataExport(
    $file_name: String!
    $file_type: String
    $status: String
    $exported_by: ID
  ) {
    addDataExport(
      file_name: $file_name
      file_type: $file_type
      status: $status
      exported_by: $exported_by
    ) {
      export_id
    }
  }
`;

function DataImportForm() {
  const [addDataImport, { loading, error }] = useMutation(ADD_DATA_IMPORT, {
    refetchQueries: [{ query: GET_DATA_IMPORTS }],
  });
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [status, setStatus] = useState('');
  const [importedBy, setImportedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDataImport({
      variables: {
        file_name: fileName,
        file_type: fileType,
        status,
        imported_by: importedBy,
      },
    });
    setFileName('');
    setFileType('');
    setStatus('');
    setImportedBy('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="File Type"
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Imported By (User ID)"
        value={importedBy}
        onChange={(e) => setImportedBy(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Data Import'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function DataImportList() {
  const { loading, error, data } = useQuery(GET_DATA_IMPORTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.dataImports.map((dataImport: any) => (
        <div key={dataImport.import_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{dataImport.file_name}</h3>
          <p>Type: {dataImport.file_type}</p>
          <p>Status: {dataImport.status}</p>
          <p>Imported By: {dataImport.imported_by}</p>
          <p>Imported At: {dataImport.imported_at}</p>
        </div>
      ))}
    </div>
  );
}

function DataExportForm() {
  const [addDataExport, { loading, error }] = useMutation(ADD_DATA_EXPORT, {
    refetchQueries: [{ query: GET_DATA_EXPORTS }],
  });
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [status, setStatus] = useState('');
  const [exportedBy, setExportedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDataExport({
      variables: {
        file_name: fileName,
        file_type: fileType,
        status,
        exported_by: exportedBy,
      },
    });
    setFileName('');
    setFileType('');
    setStatus('');
    setExportedBy('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="File Type"
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Exported By (User ID)"
        value={exportedBy}
        onChange={(e) => setExportedBy(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Data Export'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function DataExportList() {
  const { loading, error, data } = useQuery(GET_DATA_EXPORTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.dataExports.map((dataExport: any) => (
        <div key={dataExport.export_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{dataExport.file_name}</h3>
          <p>Type: {dataExport.file_type}</p>
          <p>Status: {dataExport.status}</p>
          <p>Exported By: {dataExport.exported_by}</p>
          <p>Exported At: {dataExport.exported_at}</p>
        </div>
      ))}
    </div>
  );
}

export default function DataManagementPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Data Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Data Imports</h2>
          <DataImportForm />
          <DataImportList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Data Exports</h2>
          <DataExportForm />
          <DataExportList />
        </div>
      </div>
    </div>
  );
}
