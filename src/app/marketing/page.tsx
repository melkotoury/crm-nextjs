'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      campaign_id
      campaign_name
      start_date
      end_date
      budget
      status
    }
  }
`;

const ADD_CAMPAIGN = gql`
  mutation AddCampaign(
    $campaign_name: String!
    $start_date: String
    $end_date: String
    $budget: Float
    $status: String
  ) {
    addCampaign(
      campaign_name: $campaign_name
      start_date: $start_date
      end_date: $end_date
      budget: $budget
      status: $status
    ) {
      campaign_id
    }
  }
`;

function CampaignForm() {
  const [addCampaign, { loading, error }] = useMutation(ADD_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
  });
  const [campaignName, setCampaignName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      variables: {
        campaign_name: campaignName,
        start_date: startDate,
        end_date: endDate,
        budget: parseFloat(budget),
        status: status,
      },
    });
    setCampaignName('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setStatus('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Campaign Name"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Campaign'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function CampaignList() {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.campaigns.map((campaign: any) => (
        <div key={campaign.campaign_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{campaign.campaign_name}</h3>
          <p>Start Date: {campaign.start_date}</p>
          <p>End Date: {campaign.end_date}</p>
          <p>Budget: {campaign.budget}</p>
          <p>Status: {campaign.status}</p>
        </div>
      ))}
    </div>
  );
}

export default function MarketingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Marketing Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Add Campaign</h2>
          <CampaignForm />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Campaign List</h2>
          <CampaignList />
        </div>
      </div>
    </div>
  );
}
