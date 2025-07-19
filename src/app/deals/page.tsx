'use client';

import { useState, useEffect } from 'react';

interface Deal {
  deal_id: string;
  deal_name: string;
  stage: string;
  amount?: number;
  close_date?: string;
  contact_id?: string;
  user_id?: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [formData, setFormData] = useState({
    deal_name: '',
    stage: 'Prospecting',
    amount: '',
    close_date: '',
    contact_id: '',
    user_id: '',
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
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
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deals) {
      setDeals(result.data.deals);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddDeal($deal_name: String!, $stage: String!, $amount: Float, $close_date: String, $contact_id: ID, $user_id: ID) {
            addDeal(deal_name: $deal_name, stage: $stage, amount: $amount, close_date: $close_date, contact_id: $contact_id, user_id: $user_id) {
              deal_id
              deal_name
              stage
              amount
            }
          }
        `,
        variables: {
          ...formData,
          amount: formData.amount ? parseFloat(formData.amount) : null,
        },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addDeal) {
      setDeals((prevDeals) => [...prevDeals, result.data.addDeal]);
      setFormData({
        deal_name: '',
        stage: 'Prospecting',
        amount: '',
        close_date: '',
        contact_id: '',
        user_id: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deal Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Deal</h2>
        <form onSubmit={handleAddDeal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="deal_name"
            placeholder="Deal Name"
            value={formData.deal_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <select
            name="stage"
            value={formData.stage}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Prospecting">Prospecting</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="close_date"
            placeholder="Close Date"
            value={formData.close_date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="contact_id"
            placeholder="Contact ID (Optional)"
            value={formData.contact_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="user_id"
            placeholder="User ID (Optional)"
            value={formData.user_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Deal
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Deals</h2>
        {deals.length === 0 ? (
          <p>No deals found.</p>
        ) : (
          <ul className="space-y-2">
            {deals.map((deal) => (
              <li key={deal.deal_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{deal.deal_name}</p>
                <p className="text-sm text-gray-600">Stage: {deal.stage}</p>
                {deal.amount && <p className="text-sm text-gray-600">Amount: ${deal.amount}</p>}
                {deal.close_date && <p className="text-sm text-gray-600">Close Date: {deal.close_date}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}