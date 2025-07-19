'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_DEALS = gql`
  query GetDeals {
    deals {
      deal_id
      deal_name
      stage
      amount
      close_date
      contact_id
      user_id
    }
  }
`;

const ADD_DEAL = gql`
  mutation AddDeal(
    $deal_name: String!
    $stage: String!
    $amount: Float
    $close_date: String
    $contact_id: ID
    $user_id: ID
  ) {
    addDeal(
      deal_name: $deal_name
      stage: $stage
      amount: $amount
      close_date: $close_date
      contact_id: $contact_id
      user_id: $user_id
    ) {
      deal_id
    }
  }
`;

function DealForm() {
  const [addDeal, { loading, error }] = useMutation(ADD_DEAL, {
    refetchQueries: [{ query: GET_DEALS }],
  });
  const [dealName, setDealName] = useState('');
  const [stage, setStage] = useState('');
  const [amount, setAmount] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [contactId, setContactId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      variables: {
        deal_name: dealName,
        stage: stage,
        amount: parseFloat(amount),
        close_date: closeDate,
        contact_id: contactId,
        user_id: userId,
      },
    });
    setDealName('');
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
        placeholder="Deal Name"
        value={dealName}
        onChange={(e) => setDealName(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Deal'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function DealList() {
  const { loading, error, data } = useQuery(GET_DEALS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.deals.map((deal: any) => (
        <div key={deal.deal_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{deal.deal_name}</h3>
          <p>Stage: {deal.stage}</p>
          <p>Amount: {deal.amount}</p>
          <p>Close Date: {deal.close_date}</p>
          <p>Contact ID: {deal.contact_id}</p>
          <p>User ID: {deal.user_id}</p>
        </div>
      ))}
    </div>
  );
}

export default function DealsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Deals</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Add Deal</h2>
          <DealForm />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Deal List</h2>
          <DealList />
        </div>
      </div>
    </div>
  );
}
