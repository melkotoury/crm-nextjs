'use client';

import { useState, useEffect } from 'react';

interface Territory {
  territory_id: string;
  territory_name: string;
  region?: string;
  manager_user_id?: string;
}

interface TeamPerformance {
  performance_id: string;
  user_id?: string;
  metric_name: string;
  metric_value?: number;
  record_date?: string;
}

export default function TerritoryTeamPage() {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);

  const [territoryFormData, setTerritoryFormData] = useState({
    territory_name: '',
    region: '',
    manager_user_id: '',
  });

  const [teamPerformanceFormData, setTeamPerformanceFormData] = useState({
    user_id: '',
    metric_name: '',
    metric_value: '',
    record_date: '',
  });

  useEffect(() => {
    fetchTerritories();
    fetchTeamPerformance();
  }, []);

  const fetchTerritories = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            territories {
              territory_id
              territory_name
              region
              manager_user_id
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.territories) {
      setTerritories(result.data.territories);
    }
  };

  const fetchTeamPerformance = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            teamPerformance {
              performance_id
              user_id
              metric_name
              metric_value
              record_date
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.teamPerformance) {
      setTeamPerformance(result.data.teamPerformance);
    }
  };

  const handleTerritoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTerritoryFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTeamPerformanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamPerformanceFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddTerritory = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddTerritory($territory_name: String!, $region: String, $manager_user_id: ID) {
            addTerritory(territory_name: $territory_name, region: $region, manager_user_id: $manager_user_id) {
              territory_id
              territory_name
            }
          }
        `,
        variables: territoryFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addTerritory) {
      setTerritories((prevTerritories) => [...prevTerritories, result.data.addTerritory]);
      setTerritoryFormData({
        territory_name: '',
        region: '',
        manager_user_id: '',
      });
    }
  };

  const handleAddTeamPerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddTeamPerformance($user_id: ID, $metric_name: String!, $metric_value: Float, $record_date: String) {
            addTeamPerformance(user_id: $user_id, metric_name: $metric_name, metric_value: $metric_value, record_date: $record_date) {
              performance_id
              metric_name
              metric_value
            }
          }
        `,
        variables: {
          ...teamPerformanceFormData,
          metric_value: teamPerformanceFormData.metric_value ? parseFloat(teamPerformanceFormData.metric_value) : null,
        },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addTeamPerformance) {
      setTeamPerformance((prevPerformance) => [...prevPerformance, result.data.addTeamPerformance]);
      setTeamPerformanceFormData({
        user_id: '',
        metric_name: '',
        metric_value: '',
        record_date: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Territory & Team Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Territory</h2>
        <form onSubmit={handleAddTerritory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="territory_name"
            placeholder="Territory Name"
            value={territoryFormData.territory_name}
            onChange={handleTerritoryInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="region"
            placeholder="Region"
            value={territoryFormData.region}
            onChange={handleTerritoryInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="manager_user_id"
            placeholder="Manager User ID (Optional)"
            value={territoryFormData.manager_user_id}
            onChange={handleTerritoryInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Territory
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Territories</h2>
        {territories.length === 0 ? (
          <p>No territories found.</p>
        ) : (
          <ul className="space-y-2">
            {territories.map((territory) => (
              <li key={territory.territory_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{territory.territory_name}</p>
                {territory.region && <p className="text-sm text-gray-600">Region: {territory.region}</p>}
                {territory.manager_user_id && <p className="text-sm text-gray-600">Manager ID: {territory.manager_user_id}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Team Performance Record</h2>
        <form onSubmit={handleAddTeamPerformance} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="user_id"
            placeholder="User ID (Optional)"
            value={teamPerformanceFormData.user_id}
            onChange={handleTeamPerformanceInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="metric_name"
            placeholder="Metric Name"
            value={teamPerformanceFormData.metric_name}
            onChange={handleTeamPerformanceInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="metric_value"
            placeholder="Metric Value"
            value={teamPerformanceFormData.metric_value}
            onChange={handleTeamPerformanceInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="record_date"
            placeholder="Record Date"
            value={teamPerformanceFormData.record_date}
            onChange={handleTeamPerformanceInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Performance Record
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Team Performance Records</h2>
        {teamPerformance.length === 0 ? (
          <p>No performance records found.</p>
        ) : (
          <ul className="space-y-2">
            {teamPerformance.map((record) => (
              <li key={record.performance_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{record.metric_name}: {record.metric_value}</p>
                {record.user_id && <p className="text-sm text-gray-600">User ID: {record.user_id}</p>}
                {record.record_date && <p className="text-sm text-gray-600">Date: {record.record_date}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}