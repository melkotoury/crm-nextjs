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

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
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
              status
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
  };

  const handleAddKbArticle = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Service & Support</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Ticket</h2>
        <form onSubmit={handleAddTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Add Ticket
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((ticket) => (
              <li key={ticket.ticket_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{ticket.subject} (Status: {ticket.status})</p>
                {ticket.description && <p className="text-sm text-gray-600">{ticket.description}</p>}
                {ticket.priority && <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Knowledge Base Article</h2>
        <form onSubmit={handleAddKbArticle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Add Article
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Knowledge Base Articles</h2>
        {kbArticles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="space-y-2">
            {kbArticles.map((article) => (
              <li key={article.article_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{article.title}</p>
                {article.category && <p className="text-sm text-gray-600">Category: {article.category}</p>}
                {article.content && <p className="text-sm text-gray-600">{article.content.substring(0, 100)}...</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}