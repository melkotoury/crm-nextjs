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

  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [editingTeamPerformance, setEditingTeamPerformance] = useState<TeamPerformance | null>(null);

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

  const handleTerritorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTerritory) {
      // Update territory
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateTerritory($territory_id: ID!, $territory_name: String, $region: String, $manager_user_id: ID) {
              updateTerritory(territory_id: $territory_id, territory_name: $territory_name, region: $region, manager_user_id: $manager_user_id) {
                territory_id
                territory_name
                region
                manager_user_id
              }
            }
          `,
          variables: { territory_id: editingTerritory.territory_id, ...territoryFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateTerritory) {
        setTerritories((prevTerritories) =>
          prevTerritories.map((territory) =>
            territory.territory_id === result.data.updateTerritory.territory_id
              ? result.data.updateTerritory
              : territory
          )
        );
        setEditingTerritory(null);
        setTerritoryFormData({
          territory_name: '',
          region: '',
          manager_user_id: '',
        });
      }
    } else {
      // Add new territory
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
                region
                manager_user_id
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
    }
  };

  const handleTeamPerformanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamPerformance) {
      // Update team performance
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateTeamPerformance($performance_id: ID!, $user_id: ID, $metric_name: String, $metric_value: Float, $record_date: String) {
              updateTeamPerformance(performance_id: $performance_id, user_id: $user_id, metric_name: $metric_name, metric_value: $metric_value, record_date: $record_date) {
                performance_id
                user_id
                metric_name
                metric_value
                record_date
              }
            }
          `,
          variables: {
            performance_id: editingTeamPerformance.performance_id,
            ...teamPerformanceFormData,
            metric_value: teamPerformanceFormData.metric_value ? parseFloat(teamPerformanceFormData.metric_value) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateTeamPerformance) {
        setTeamPerformance((prevPerformance) =>
          prevPerformance.map((record) =>
            record.performance_id === result.data.updateTeamPerformance.performance_id
              ? result.data.updateTeamPerformance
              : record
          )
        );
        setEditingTeamPerformance(null);
        setTeamPerformanceFormData({
          user_id: '',
          metric_name: '',
          metric_value: '',
          record_date: '',
        });
      }
    } else {
      // Add new team performance
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
                user_id
                metric_name
                metric_value
                record_date
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
    }
  };

  const handleEditTerritoryClick = (territory: Territory) => {
    setEditingTerritory(territory);
    setTerritoryFormData({
      territory_name: territory.territory_name,
      region: territory.region || '',
      manager_user_id: territory.manager_user_id || '',
    });
  };

  const handleDeleteTerritory = async (territory_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteTerritory($territory_id: ID!) {
            deleteTerritory(territory_id: $territory_id)
          }
        `,
        variables: { territory_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteTerritory) {
      setTerritories((prevTerritories) =>
        prevTerritories.filter((territory) => territory.territory_id !== territory_id)
      );
    }
  };

  const handleEditTeamPerformanceClick = (record: TeamPerformance) => {
    setEditingTeamPerformance(record);
    setTeamPerformanceFormData({
      user_id: record.user_id || '',
      metric_name: record.metric_name,
      metric_value: record.metric_value ? String(record.metric_value) : '',
      record_date: record.record_date || '',
    });
  };

  const handleDeleteTeamPerformance = async (performance_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteTeamPerformance($performance_id: ID!) {
            deleteTeamPerformance(performance_id: $performance_id)
          }
        `,
        variables: { performance_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteTeamPerformance) {
      setTeamPerformance((prevPerformance) =>
        prevPerformance.filter((record) => record.performance_id !== performance_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Territory & Team Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingTerritory ? 'Edit Territory' : 'Add New Territory'}</h2>
        <form onSubmit={handleTerritorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingTerritory ? 'Update Territory' : 'Add Territory'}
          </button>
          {editingTerritory && (
            <button
              type="button"
              onClick={() => {
                setEditingTerritory(null);
                setTerritoryFormData({
                  territory_name: '',
                  region: '',
                  manager_user_id: '',
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Territories</h2>
        {territories.length === 0 ? (
          <p>No territories found.</p>
        ) : (
          <ul className="space-y-2">
            {territories.map((territory) => (
              <li key={territory.territory_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{territory.territory_name}</p>
                  {territory.region && <p className="text-sm text-gray-600">Region: {territory.region}</p>}
                  {territory.manager_user_id && <p className="text-sm text-gray-600">Manager ID: {territory.manager_user_id}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTerritoryClick(territory)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTerritory(territory.territory_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">{editingTeamPerformance ? 'Edit Team Performance Record' : 'Add New Team Performance Record'}</h2>
        <form onSubmit={handleTeamPerformanceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingTeamPerformance ? 'Update Performance Record' : 'Add Performance Record'}
          </button>
          {editingTeamPerformance && (
            <button
              type="button"
              onClick={() => {
                setEditingTeamPerformance(null);
                setTeamPerformanceFormData({
                  user_id: '',
                  metric_name: '',
                  metric_value: '',
                  record_date: '',
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Team Performance Records</h2>
        {teamPerformance.length === 0 ? (
          <p>No performance records found.</p>
        ) : (
          <ul className="space-y-2">
            {teamPerformance.map((record) => (
              <li key={record.performance_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{record.metric_name}: {record.metric_value}</p>
                  {record.user_id && <p className="text-sm text-gray-600">User ID: {record.user_id}</p>}
                  {record.record_date && <p className="text-sm text-gray-600">Date: {record.record_date}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTeamPerformanceClick(record)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeamPerformance(record.performance_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}