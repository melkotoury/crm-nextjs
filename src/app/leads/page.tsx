'use client';

import { useState, useEffect } from 'react';

interface Lead {
  lead_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  status: string;
  source?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    status: 'New',
    source: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            leads {
              lead_id
              first_name
              last_name
              email
              company
              status
              source
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.leads) {
      setLeads(result.data.leads);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddLead($first_name: String!, $last_name: String!, $email: String!, $company: String, $status: String!, $source: String) {
            addLead(first_name: $first_name, last_name: $last_name, email: $email, company: $company, status: $status, source: $source) {
              lead_id
              first_name
              last_name
              email
            }
          }
        `,
        variables: formData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addLead) {
      setLeads((prevLeads) => [...prevLeads, result.data.addLead]);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        status: 'New',
        source: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lead Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Lead</h2>
        <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Disqualified">Disqualified</option>
          </select>
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={formData.source}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Lead
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Leads</h2>
        {leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <ul className="space-y-2">
            {leads.map((lead) => (
              <li key={lead.lead_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                <p className="text-sm text-gray-600">{lead.email}</p>
                {lead.company && <p className="text-sm text-gray-600">{lead.company}</p>}
                <p className="text-sm text-gray-600">Status: {lead.status}</p>
                {lead.source && <p className="text-sm text-gray-600">Source: {lead.source}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}