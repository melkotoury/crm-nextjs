'use client';

import { useState, useEffect } from 'react';

interface Ticket {
  ticket_id: string;
  subject: string;
  description?: string;
  status: string;
  priority?: string;
  contact_id?: string;
  user_id?: string;
}

interface KnowledgeBaseArticle {
  article_id: string;
  title: string;
  content?: string;
  category?: string;
}

export default function CustomerServicePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [ticketFormData, setTicketFormData] = useState({
    subject: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    contact_id: '',
    user_id: '',
  });
  const [kbFormData, setKbFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editingKbArticle, setEditingKbArticle] = useState<KnowledgeBaseArticle | null>(null);

  useEffect(() => {
    fetchTickets();
    fetchKbArticles();
  }, []);

  const fetchTickets = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            tickets {
              ticket_id
              subject
              description
              status
              priority
              contact_id
              user_id
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.tickets) {
      setTickets(result.data.tickets);
    }
  };

  const fetchKbArticles = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            knowledgeBaseArticles {
              article_id
              title
              content
              category
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.knowledgeBaseArticles) {
      setKbArticles(result.data.knowledgeBaseArticles);
    }
  };

  const handleTicketInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKbInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKbFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      // Update ticket
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateTicket($ticket_id: ID!, $subject: String, $description: String, $status: String, $priority: String, $contact_id: ID, $user_id: ID) {
              updateTicket(ticket_id: $ticket_id, subject: $subject, description: $description, status: $status, priority: $priority, contact_id: $contact_id, user_id: $user_id) {
                ticket_id
                subject
                description
                status
                priority
                contact_id
                user_id
              }
            }
          `,
          variables: { ticket_id: editingTicket.ticket_id, ...ticketFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateTicket) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.ticket_id === result.data.updateTicket.ticket_id
              ? result.data.updateTicket
              : ticket
          )
        );
        setEditingTicket(null);
        setTicketFormData({
          subject: '',
          description: '',
          status: 'Open',
          priority: 'Medium',
          contact_id: '',
          user_id: '',
        });
      }
    } else {
      // Add new ticket
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddTicket($subject: String!, $description: String, $status: String, $priority: String, $contact_id: ID, $user_id: ID) {
              addTicket(subject: $subject, description: $description, status: $status, priority: $priority, contact_id: $contact_id, user_id: $user_id) {
                ticket_id
                subject
                description
                status
                priority
                contact_id
                user_id
              }
            }
          `,
          variables: ticketFormData,
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addTicket) {
        setTickets((prevTickets) => [...prevTickets, result.data.addTicket]);
        setTicketFormData({
          subject: '',
          description: '',
          status: 'Open',
          priority: 'Medium',
          contact_id: '',
          user_id: '',
        });
      }
    }
  };

  const handleKbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKbArticle) {
      // Update KB Article
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateKnowledgeBaseArticle($article_id: ID!, $title: String, $content: String, $category: String) {
              updateKnowledgeBaseArticle(article_id: $article_id, title: $title, content: $content, category: $category) {
                article_id
                title
                content
                category
              }
            }
          `,
          variables: { article_id: editingKbArticle.article_id, ...kbFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateKnowledgeBaseArticle) {
        setKbArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.article_id === result.data.updateKnowledgeBaseArticle.article_id
              ? result.data.updateKnowledgeBaseArticle
              : article
          )
        );
        setEditingKbArticle(null);
        setKbFormData({
          title: '',
          content: '',
          category: '',
        });
      }
    } else {
      // Add new KB Article
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddKnowledgeBaseArticle($title: String!, $content: String, $category: String) {
              addKnowledgeBaseArticle(title: $title, content: $content, category: $category) {
                article_id
                title
                content
                category
              }
            }
          `,
          variables: kbFormData,
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addKnowledgeBaseArticle) {
        setKbArticles((prevArticles) => [...prevArticles, result.data.addKnowledgeBaseArticle]);
        setKbFormData({
          title: '',
          content: '',
          category: '',
        });
      }
    }
  };

  const handleEditTicketClick = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setTicketFormData({
      subject: ticket.subject,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'Medium',
      contact_id: ticket.contact_id || '',
      user_id: ticket.user_id || '',
    });
  };

  const handleDeleteTicket = async (ticket_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteTicket($ticket_id: ID!) {
            deleteTicket(ticket_id: $ticket_id)
          }
        `,
        variables: { ticket_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteTicket) {
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.ticket_id !== ticket_id)
      );
    }
  };

  const handleEditKbArticleClick = (article: KnowledgeBaseArticle) => {
    setEditingKbArticle(article);
    setKbFormData({
      title: article.title,
      content: article.content || '',
      category: article.category || '',
    });
  };

  const handleDeleteKbArticle = async (article_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteKnowledgeBaseArticle($article_id: ID!) {
            deleteKnowledgeBaseArticle(article_id: $article_id)
          }
        `,
        variables: { article_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteKnowledgeBaseArticle) {
      setKbArticles((prevArticles) =>
        prevArticles.filter((article) => article.article_id !== article_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Service & Support</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingTicket ? 'Edit Ticket' : 'Add New Ticket'}</h2>
        <form onSubmit={handleTicketSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={ticketFormData.subject}
            onChange={handleTicketInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={ticketFormData.description}
            onChange={handleTicketInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={ticketFormData.status}
            onChange={handleTicketInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            name="priority"
            value={ticketFormData.priority}
            onChange={handleTicketInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="text"
            name="contact_id"
            placeholder="Contact ID (Optional)"
            value={ticketFormData.contact_id}
            onChange={handleTicketInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="user_id"
            placeholder="User ID (Optional)"
            value={ticketFormData.user_id}
            onChange={handleTicketInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingTicket ? 'Update Ticket' : 'Add Ticket'}
          </button>
          {editingTicket && (
            <button
              type="button"
              onClick={() => {
                setEditingTicket(null);
                setTicketFormData({
                  subject: '',
                  description: '',
                  status: 'Open',
                  priority: 'Medium',
                  contact_id: '',
                  user_id: '',
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
        <h2 className="text-xl font-semibold mb-2">Existing Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((ticket) => (
              <li key={ticket.ticket_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{ticket.subject} (Status: {ticket.status})</p>
                  {ticket.description && <p className="text-sm text-gray-600">{ticket.description}</p>}
                  {ticket.priority && <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTicketClick(ticket)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.ticket_id)}
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
        <h2 className="text-xl font-semibold mb-2">{editingKbArticle ? 'Edit Knowledge Base Article' : 'Add New Knowledge Base Article'}</h2>
        <form onSubmit={handleKbSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={kbFormData.title}
            onChange={handleKbInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={kbFormData.category}
            onChange={handleKbInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="content"
            placeholder="Content"
            value={kbFormData.content}
            onChange={handleKbInputChange}
            rows={5}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingKbArticle ? 'Update Article' : 'Add Article'}
          </button>
          {editingKbArticle && (
            <button
              type="button"
              onClick={() => {
                setEditingKbArticle(null);
                setKbFormData({
                  title: '',
                  content: '',
                  category: '',
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
        <h2 className="text-xl font-semibold mb-2">Existing Knowledge Base Articles</h2>
        {kbArticles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="space-y-2">
            {kbArticles.map((article) => (
              <li key={article.article_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{article.title}</p>
                  {article.category && <p className="text-sm text-gray-600">Category: {article.category}</p>}
                  {article.content && <p className="text-sm text-gray-600">{article.content.substring(0, 100)}...</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditKbArticleClick(article)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteKbArticle(article.article_id)}
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