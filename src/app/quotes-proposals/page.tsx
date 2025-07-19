'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_QUOTES = gql`
  query GetQuotes {
    quotes {
      quote_id
      deal_id
      quote_date
      total_amount
      status
    }
  }
`;

const ADD_QUOTE = gql`
  mutation AddQuote(
    $deal_id: ID
    $quote_date: String
    $total_amount: Float
    $status: String
  ) {
    addQuote(
      deal_id: $deal_id
      quote_date: $quote_date
      total_amount: $total_amount
      status: $status
    ) {
      quote_id
    }
  }
`;

const GET_PROPOSALS = gql`
  query GetProposals {
    proposals {
      proposal_id
      deal_id
      proposal_date
      content
      status
    }
  }
`;

const ADD_PROPOSAL = gql`
  mutation AddProposal(
    $deal_id: ID
    $proposal_date: String
    $content: String
    $status: String
  ) {
    addProposal(
      deal_id: $deal_id
      proposal_date: $proposal_date
      content: $content
      status: $status
    ) {
      proposal_id
    }
  }
`;

function QuoteForm() {
  const [addQuote, { loading, error }] = useMutation(ADD_QUOTE, {
    refetchQueries: [{ query: GET_QUOTES }],
  });
  const [dealId, setDealId] = useState('');
  const [quoteDate, setQuoteDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuote({
      variables: {
        deal_id: dealId,
        quote_date: quoteDate,
        total_amount: parseFloat(totalAmount),
        status,
      },
    });
    setDealId('');
    setQuoteDate('');
    setTotalAmount('');
    setStatus('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Deal ID"
        value={dealId}
        onChange={(e) => setDealId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        placeholder="Quote Date"
        value={quoteDate}
        onChange={(e) => setQuoteDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Quote'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function QuoteList() {
  const { loading, error, data } = useQuery(GET_QUOTES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.quotes.map((quote: any) => (
        <div key={quote.quote_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">Quote ID: {quote.quote_id}</h3>
          <p>Deal ID: {quote.deal_id}</p>
          <p>Date: {quote.quote_date}</p>
          <p>Amount: {quote.total_amount}</p>
          <p>Status: {quote.status}</p>
        </div>
      ))}
    </div>
  );
}

function ProposalForm() {
  const [addProposal, { loading, error }] = useMutation(ADD_PROPOSAL, {
    refetchQueries: [{ query: GET_PROPOSALS }],
  });
  const [dealId, setDealId] = useState('');
  const [proposalDate, setProposalDate] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProposal({
      variables: {
        deal_id: dealId,
        proposal_date: proposalDate,
        content,
        status,
      },
    });
    setDealId('');
    setProposalDate('');
    setContent('');
    setStatus('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Deal ID"
        value={dealId}
        onChange={(e) => setDealId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        placeholder="Proposal Date"
        value={proposalDate}
        onChange={(e) => setProposalDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Proposal'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function ProposalList() {
  const { loading, error, data } = useQuery(GET_PROPOSALS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.proposals.map((proposal: any) => (
        <div key={proposal.proposal_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">Proposal ID: {proposal.proposal_id}</h3>
          <p>Deal ID: {proposal.deal_id}</p>
          <p>Date: {proposal.proposal_date}</p>
          <p>Content: {proposal.content}</p>
          <p>Status: {proposal.status}</p>
        </div>
      ))}
    </div>
  );
}

export default function QuotesProposalsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Quotes & Proposals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Quotes</h2>
          <QuoteForm />
          <QuoteList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Proposals</h2>
          <ProposalForm />
          <ProposalList />
        </div>
      </div>
    </div>
  );
}