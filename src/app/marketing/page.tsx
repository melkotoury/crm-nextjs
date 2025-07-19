'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  campaign_id: string;
  campaign_name: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  status?: string;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [formData, setFormData] = useState({
    campaign_name: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'Planned',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            campaigns {
              campaign_id
              campaign_name
              start_date
              end_date
              budget
              status
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.campaigns) {
      setCampaigns(result.data.campaigns);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddCampaign($campaign_name: String!, $start_date: String, $end_date: String, $budget: Float, $status: String) {
            addCampaign(campaign_name: $campaign_name, start_date: $start_date, end_date: $end_date, budget: $budget, status: $status) {
              campaign_id
              campaign_name
              status
            }
          }
        `,
        variables: {
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null,
        },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addCampaign) {
      setCampaigns((prevCampaigns) => [...prevCampaigns, result.data.addCampaign]);
      setFormData({
        campaign_name: '',
        start_date: '',
        end_date: '',
        budget: '',
        status: 'Planned',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing Automation - Campaigns</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Campaign</h2>
        <form onSubmit={handleAddCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="campaign_name"
            placeholder="Campaign Name"
            value={formData.campaign_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="start_date"
            placeholder="Start Date"
            value={formData.start_date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="end_date"
            placeholder="End Date"
            value={formData.end_date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
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
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Campaign
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Campaigns</h2>
        {campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign.campaign_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{campaign.campaign_name}</p>
                {campaign.start_date && <p className="text-sm text-gray-600">Start Date: {campaign.start_date}</p>}
                {campaign.end_date && <p className="text-sm text-gray-600">End Date: {campaign.end_date}</p>}
                {campaign.budget && <p className="text-sm text-gray-600">Budget: ${campaign.budget}</p>}
                <p className="text-sm text-gray-600">Status: {campaign.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}