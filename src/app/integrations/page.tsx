'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_INTEGRATIONS = gql`
  query GetIntegrations {
    integrations {
      integration_id
      integration_name
      api_key
      status
    }
  }
`;

const ADD_INTEGRATION = gql`
  mutation AddIntegration(
    $integration_name: String!
    $api_key: String
    $status: String
  ) {
    addIntegration(
      integration_name: $integration_name
      api_key: $api_key
      status: $status
    ) {
      integration_id
    }
  }
`;

function IntegrationForm() {
  const [addIntegration, { loading, error }] = useMutation(ADD_INTEGRATION, {
    refetchQueries: [{ query: GET_INTEGRATIONS }],
  });
  const [integrationName, setIntegrationName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIntegration({
      variables: {
        integration_name: integrationName,
        api_key: apiKey,
        status: status,
      },
    });
    setIntegrationName('');
    setApiKey('');
    setStatus('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Integration Name"
        value={integrationName}
        onChange={(e) => setIntegrationName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Integration'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function IntegrationList() {
  const { loading, error, data } = useQuery(GET_INTEGRATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.integrations.map((integration: any) => (
        <div key={integration.integration_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{integration.integration_name}</h3>
          <p>API Key: {integration.api_key}</p>
          <p>Status: {integration.status}</p>
        </div>
      ))}
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Add Integration</h2>
          <IntegrationForm />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Integration List</h2>
          <IntegrationList />
        </div>
      </div>
    </div>
  );
}
