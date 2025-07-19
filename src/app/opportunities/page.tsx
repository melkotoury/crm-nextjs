'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_OPPORTUNITIES = gql`
  query GetOpportunities {
    opportunities {
      opportunity_id
      opportunity_name
      stage
      amount
      close_date
      contact_id
      user_id
    }
  }
`;

const ADD_OPPORTUNITY = gql`
  mutation AddOpportunity(
    $opportunity_name: String!
    $stage: String!
    $amount: Float
    $close_date: String
    $contact_id: ID
    $user_id: ID
  ) {
    addOpportunity(
      opportunity_name: $opportunity_name
      stage: $stage
      amount: $amount
      close_date: $close_date
      contact_id: $contact_id
      user_id: $user_id
    ) {
      opportunity_id
    }
  }
`;

function OpportunityForm() {
  const [addOpportunity, { loading, error }] = useMutation(ADD_OPPORTUNITY, {
    refetchQueries: [{ query: GET_OPPORTUNITIES }],
  });
  const [opportunityName, setOpportunityName] = useState('');
  const [stage, setStage] = useState('');
  const [amount, setAmount] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [contactId, setContactId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOpportunity({
      variables: {
        opportunity_name: opportunityName,
        stage: stage,
        amount: parseFloat(amount),
        close_date: closeDate,
        contact_id: contactId,
        user_id: userId,
      },
    });
    setOpportunityName('');
    setStage('');
    setAmount('');
    setCloseDate('');
    setContactId('');
    setUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Opportunity Name"
        value={opportunityName}
        onChange={(e) => setOpportunityName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Stage"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Close Date"
        value={closeDate}
        onChange={(e) => setCloseDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Contact ID"
        value={contactId}
        onChange={(e) => setContactId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Opportunity'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function OpportunityList() {
  const { loading, error, data } = useQuery(GET_OPPORTUNITIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.opportunities.map((opportunity: any) => (
        <div key={opportunity.opportunity_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{opportunity.opportunity_name}</h3>
          <p>Stage: {opportunity.stage}</p>
          <p>Amount: {opportunity.amount}</p>
          <p>Close Date: {opportunity.close_date}</p>
          <p>Contact ID: {opportunity.contact_id}</p>
          <p>User ID: {opportunity.user_id}</p>
        </div>
      ))}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Add Opportunity</h2>
          <OpportunityForm />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Opportunity List</h2>
          <OpportunityList />
        </div>
      </div>
    </div>
  );
}
