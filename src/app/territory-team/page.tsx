'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TERRITORIES = gql`
  query GetTerritories {
    territories {
      territory_id
      territory_name
      region
      manager_user_id
    }
  }
`;

const ADD_TERRITORY = gql`
  mutation AddTerritory(
    $territory_name: String!
    $region: String
    $manager_user_id: ID
  ) {
    addTerritory(
      territory_name: $territory_name
      region: $region
      manager_user_id: $manager_user_id
    ) {
      territory_id
    }
  }
`;

const GET_TEAM_PERFORMANCE = gql`
  query GetTeamPerformance {
    teamPerformance {
      performance_id
      user_id
      metric_name
      metric_value
      record_date
    }
  }
`;

const ADD_TEAM_PERFORMANCE = gql`
  mutation AddTeamPerformance(
    $user_id: ID
    $metric_name: String!
    $metric_value: Float
    $record_date: String
  ) {
    addTeamPerformance(
      user_id: $user_id
      metric_name: $metric_name
      metric_value: $metric_value
      record_date: $record_date
    ) {
      performance_id
    }
  }
`;

function TerritoryForm() {
  const [addTerritory, { loading, error }] = useMutation(ADD_TERRITORY, {
    refetchQueries: [{ query: GET_TERRITORIES }],
  });
  const [territoryName, setTerritoryName] = useState('');
  const [region, setRegion] = useState('');
  const [managerUserId, setManagerUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTerritory({
      variables: {
        territory_name: territoryName,
        region,
        manager_user_id: managerUserId,
      },
    });
    setTerritoryName('');
    setRegion('');
    setManagerUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Territory Name"
        value={territoryName}
        onChange={(e) => setTerritoryName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Manager User ID"
        value={managerUserId}
        onChange={(e) => setManagerUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Territory'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function TerritoryList() {
  const { loading, error, data } = useQuery(GET_TERRITORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.territories.map((territory: any) => (
        <div key={territory.territory_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{territory.territory_name}</h3>
          <p>Region: {territory.region}</p>
          <p>Manager: {territory.manager_user_id}</p>
        </div>
      ))}
    </div>
  );
}

function TeamPerformanceForm() {
  const [addTeamPerformance, { loading, error }] = useMutation(ADD_TEAM_PERFORMANCE, {
    refetchQueries: [{ query: GET_TEAM_PERFORMANCE }],
  });
  const [userId, setUserId] = useState('');
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [recordDate, setRecordDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeamPerformance({
      variables: {
        user_id: userId,
        metric_name: metricName,
        metric_value: parseFloat(metricValue),
        record_date: recordDate,
      },
    });
    setUserId('');
    setMetricName('');
    setMetricValue('');
    setRecordDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Metric Name"
        value={metricName}
        onChange={(e) => setMetricName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Metric Value"
        value={metricValue}
        onChange={(e) => setMetricValue(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Record Date"
        value={recordDate}
        onChange={(e) => setRecordDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Team Performance'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function TeamPerformanceList() {
  const { loading, error, data } = useQuery(GET_TEAM_PERFORMANCE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.teamPerformance.map((performance: any) => (
        <div key={performance.performance_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">User ID: {performance.user_id}</h3>
          <p>Metric: {performance.metric_name}</p>
          <p>Value: {performance.metric_value}</p>
          <p>Date: {performance.record_date}</p>
        </div>
      ))}
    </div>
  );
}

export default function TerritoryTeamPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Territory & Team Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Territories</h2>
          <TerritoryForm />
          <TerritoryList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Team Performance</h2>
          <TeamPerformanceForm />
          <TeamPerformanceList />
        </div>
      </div>
    </div>
  );
}
