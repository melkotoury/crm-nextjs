'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_LEADS = gql`
  query GetLeads {
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
`;

const ADD_LEAD = gql`
  mutation AddLead(
    $first_name: String!
    $last_name: String!
    $email: String!
    $company: String
    $status: String!
    $source: String
  ) {
    addLead(
      first_name: $first_name
      last_name: $last_name
      email: $email
      company: $company
      status: $status
      source: $source
    ) {
      lead_id
    }
  }
`;

function LeadForm() {
  const [addLead, { loading, error }] = useMutation(ADD_LEAD, {
    refetchQueries: [{ query: GET_LEADS }],
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      variables: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: company,
        status: status,
        source: source,
      },
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompany('');
    setStatus('');
    setSource('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Lead'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function LeadList() {
  const { loading, error, data } = useQuery(GET_LEADS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.leads.map((lead: any) => (
        <div key={lead.lead_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{lead.first_name} {lead.last_name}</h3>
          <p>{lead.email}</p>
          <p>{lead.company}</p>
          <p>{lead.status}</p>
          <p>{lead.source}</p>
        </div>
      ))}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leads</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Add Lead</h2>
          <LeadForm />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Lead List</h2>
          <LeadList />
        </div>
      </div>
    </div>
  );
}
