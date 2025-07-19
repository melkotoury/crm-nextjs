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
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      // Update campaign
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateCampaign($campaign_id: ID!, $campaign_name: String, $start_date: String, $end_date: String, $budget: Float, $status: String) {
              updateCampaign(campaign_id: $campaign_id, campaign_name: $campaign_name, start_date: $start_date, end_date: $end_date, budget: $budget, status: $status) {
                campaign_id
                campaign_name
                start_date
                end_date
                budget
                status
              }
            }
          `,
          variables: {
            campaign_id: editingCampaign.campaign_id,
            ...formData,
            budget: formData.budget ? parseFloat(formData.budget) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateCampaign) {
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.campaign_id === result.data.updateCampaign.campaign_id
              ? result.data.updateCampaign
              : campaign
          )
        );
        setEditingCampaign(null);
        setFormData({
          campaign_name: '',
          start_date: '',
          end_date: '',
          budget: '',
          status: 'Planned',
        });
      }
    } else {
      // Add new campaign
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
                start_date
                end_date
                budget
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
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      campaign_name: campaign.campaign_name,
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      budget: campaign.budget ? String(campaign.budget) : '',
      status: campaign.status || 'Planned',
    });
  };

  const handleDeleteCampaign = async (campaign_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteCampaign($campaign_id: ID!) {
            deleteCampaign(campaign_id: $campaign_id)
          }
        `,
        variables: { campaign_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteCampaign) {
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign.campaign_id !== campaign_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing Automation - Campaigns</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingCampaign ? 'Update Campaign' : 'Add Campaign'}
          </button>
          {editingCampaign && (
            <button
              type="button"
              onClick={() => {
                setEditingCampaign(null);
                setFormData({
                  campaign_name: '',
                  start_date: '',
                  end_date: '',
                  budget: '',
                  status: 'Planned',
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
        <h2 className="text-xl font-semibold mb-2">Existing Campaigns</h2>
        {campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign.campaign_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{campaign.campaign_name}</p>
                  {campaign.start_date && <p className="text-sm text-gray-600">Start Date: {campaign.start_date}</p>}
                  {campaign.end_date && <p className="text-sm text-gray-600">End Date: {campaign.end_date}</p>}
                  {campaign.budget && <p className="text-sm text-gray-600">Budget: ${campaign.budget}</p>}
                  <p className="text-sm text-gray-600">Status: {campaign.status}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(campaign)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.campaign_id)}
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