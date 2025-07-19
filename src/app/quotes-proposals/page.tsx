'use client';

import { useState, useEffect } from 'react';

interface Quote {
  quote_id: string;
  deal_id?: string;
  quote_date?: string;
  total_amount?: number;
  status?: string;
}

interface Proposal {
  proposal_id: string;
  deal_id?: string;
  proposal_date?: string;
  content?: string;
  status?: string;
}

export default function QuotesProposalsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [quoteFormData, setQuoteFormData] = useState({
    deal_id: '',
    quote_date: '',
    total_amount: '',
    status: 'Draft',
  });

  const [proposalFormData, setProposalFormData] = useState({
    deal_id: '',
    proposal_date: '',
    content: '',
    status: 'Draft',
  });

  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    fetchQuotes();
    fetchProposals();
  }, []);

  const fetchQuotes = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            quotes {
              quote_id
              deal_id
              quote_date
              total_amount
              status
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.quotes) {
      setQuotes(result.data.quotes);
    }
  };

  const fetchProposals = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            proposals {
              proposal_id
              deal_id
              proposal_date
              content
              status
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.proposals) {
      setProposals(result.data.proposals);
    }
  };

  const handleQuoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProposalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProposalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuote) {
      // Update quote
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateQuote($quote_id: ID!, $deal_id: ID, $quote_date: String, $total_amount: Float, $status: String) {
              updateQuote(quote_id: $quote_id, deal_id: $deal_id, quote_date: $quote_date, total_amount: $total_amount, status: $status) {
                quote_id
                deal_id
                quote_date
                total_amount
                status
              }
            }
          `,
          variables: {
            quote_id: editingQuote.quote_id,
            ...quoteFormData,
            total_amount: quoteFormData.total_amount ? parseFloat(quoteFormData.total_amount) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateQuote) {
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.quote_id === result.data.updateQuote.quote_id
              ? result.data.updateQuote
              : quote
          )
        );
        setEditingQuote(null);
        setQuoteFormData({
          deal_id: '',
          quote_date: '',
          total_amount: '',
          status: 'Draft',
        });
      }
    } else {
      // Add new quote
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddQuote($deal_id: ID, $quote_date: String, $total_amount: Float, $status: String) {
              addQuote(deal_id: $deal_id, quote_date: $quote_date, total_amount: $total_amount, status: $status) {
                quote_id
                deal_id
                quote_date
                total_amount
                status
              }
            }
          `,
          variables: {
            ...quoteFormData,
            total_amount: quoteFormData.total_amount ? parseFloat(quoteFormData.total_amount) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addQuote) {
        setQuotes((prevQuotes) => [...prevQuotes, result.data.addQuote]);
        setQuoteFormData({
          deal_id: '',
          quote_date: '',
          total_amount: '',
          status: 'Draft',
        });
      }
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProposal) {
      // Update proposal
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateProposal($proposal_id: ID!, $deal_id: ID, $proposal_date: String, $content: String, $status: String) {
              updateProposal(proposal_id: $proposal_id, deal_id: $deal_id, proposal_date: $proposal_date, content: $content, status: $status) {
                proposal_id
                deal_id
                proposal_date
                content
                status
              }
            }
          `,
          variables: { proposal_id: editingProposal.proposal_id, ...proposalFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateProposal) {
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.proposal_id === result.data.updateProposal.proposal_id
              ? result.data.updateProposal
              : proposal
          )
        );
        setEditingProposal(null);
        setProposalFormData({
          deal_id: '',
          proposal_date: '',
          content: '',
          status: 'Draft',
        });
      }
    } else {
      // Add new proposal
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddProposal($deal_id: ID, $proposal_date: String, $content: String, $status: String) {
              addProposal(deal_id: $deal_id, proposal_date: $proposal_date, content: $content, status: $status) {
                proposal_id
                deal_id
                proposal_date
                content
                status
              }
            }
          `,
          variables: proposalFormData,
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addProposal) {
        setProposals((prevProposals) => [...prevProposals, result.data.addProposal]);
        setProposalFormData({
          deal_id: '',
          proposal_date: '',
          content: '',
          status: 'Draft',
        });
      }
    }
  };

  const handleEditQuoteClick = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteFormData({
      deal_id: quote.deal_id || '',
      quote_date: quote.quote_date || '',
      total_amount: quote.total_amount ? String(quote.total_amount) : '',
      status: quote.status || 'Draft',
    });
  };

  const handleDeleteQuote = async (quote_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteQuote($quote_id: ID!) {
            deleteQuote(quote_id: $quote_id)
          }
        `,
        variables: { quote_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteQuote) {
      setQuotes((prevQuotes) =>
        prevQuotes.filter((quote) => quote.quote_id !== quote_id)
      );
    }
  };

  const handleEditProposalClick = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setProposalFormData({
      deal_id: proposal.deal_id || '',
      proposal_date: proposal.proposal_date || '',
      content: proposal.content || '',
      status: proposal.status || 'Draft',
    });
  };

  const handleDeleteProposal = async (proposal_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteProposal($proposal_id: ID!) {
            deleteProposal(proposal_id: $proposal_id)
          }
        `,
        variables: { proposal_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteProposal) {
      setProposals((prevProposals) =>
        prevProposals.filter((proposal) => proposal.proposal_id !== proposal_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quote and Proposal Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingQuote ? 'Edit Quote' : 'Add New Quote'}</h2>
        <form onSubmit={handleQuoteSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="deal_id"
            placeholder="Deal ID (Optional)"
            value={quoteFormData.deal_id}
            onChange={handleQuoteInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="quote_date"
            placeholder="Quote Date"
            value={quoteFormData.quote_date}
            onChange={handleQuoteInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="total_amount"
            placeholder="Total Amount"
            value={quoteFormData.total_amount}
            onChange={handleQuoteInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={quoteFormData.status}
            onChange={handleQuoteInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingQuote ? 'Update Quote' : 'Add Quote'}
          </button>
          {editingQuote && (
            <button
              type="button"
              onClick={() => {
                setEditingQuote(null);
                setQuoteFormData({
                  deal_id: '',
                  quote_date: '',
                  total_amount: '',
                  status: 'Draft',
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
        <h2 className="text-xl font-semibold mb-2">Existing Quotes</h2>
        {quotes.length === 0 ? (
          <p>No quotes found.</p>
        ) : (
          <ul className="space-y-2">
            {quotes.map((quote) => (
              <li key={quote.quote_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">Quote for Deal ID: {quote.deal_id || 'N/A'}</p>
                  {quote.quote_date && <p className="text-sm text-gray-600">Date: {quote.quote_date}</p>}
                  {quote.total_amount && <p className="text-sm text-gray-600">Amount: ${quote.total_amount}</p>}
                  <p className="text-sm text-gray-600">Status: {quote.status}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditQuoteClick(quote)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuote(quote.quote_id)}
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
        <h2 className="text-xl font-semibold mb-2">{editingProposal ? 'Edit Proposal' : 'Add New Proposal'}</h2>
        <form onSubmit={handleProposalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="deal_id"
            placeholder="Deal ID (Optional)"
            value={proposalFormData.deal_id}
            onChange={handleProposalInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="proposal_date"
            placeholder="Proposal Date"
            value={proposalFormData.proposal_date}
            onChange={handleProposalInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={proposalFormData.status}
            onChange={handleProposalInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          <textarea
            name="content"
            placeholder="Content"
            value={proposalFormData.content}
            onChange={handleProposalInputChange}
            rows={5}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingProposal ? 'Update Proposal' : 'Add Proposal'}
          </button>
          {editingProposal && (
            <button
              type="button"
              onClick={() => {
                setEditingProposal(null);
                setProposalFormData({
                  deal_id: '',
                  proposal_date: '',
                  content: '',
                  status: 'Draft',
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
        <h2 className="text-xl font-semibold mb-2">Existing Proposals</h2>
        {proposals.length === 0 ? (
          <p>No proposals found.</p>
        ) : (
          <ul className="space-y-2">
            {proposals.map((proposal) => (
              <li key={proposal.proposal_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">Proposal for Deal ID: {proposal.deal_id || 'N/A'}</p>
                  {proposal.proposal_date && <p className="text-sm text-gray-600">Date: {proposal.proposal_date}</p>}
                  <p className="text-sm text-gray-600">Status: {proposal.status}</p>
                  {proposal.content && <p className="text-sm text-gray-600">Content: {proposal.content.substring(0, 100)}...</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProposalClick(proposal)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProposal(proposal.proposal_id)}
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