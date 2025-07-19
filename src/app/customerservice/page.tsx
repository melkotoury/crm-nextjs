'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_TICKETS = gql`
  query GetTickets {
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
`;

const ADD_TICKET = gql`
  mutation AddTicket(
    $subject: String!
    $description: String
    $status: String
    $priority: String
    $contact_id: ID
    $user_id: ID
  ) {
    addTicket(
      subject: $subject
      description: $description
      status: $status
      priority: $priority
      contact_id: $contact_id
      user_id: $user_id
    ) {
      ticket_id
    }
  }
`;

const GET_KNOWLEDGE_BASE_ARTICLES = gql`
  query GetKnowledgeBaseArticles {
    knowledgeBaseArticles {
      article_id
      title
      content
      category
    }
  }
`;

const ADD_KNOWLEDGE_BASE_ARTICLE = gql`
  mutation AddKnowledgeBaseArticle(
    $title: String!
    $content: String
    $category: String
  ) {
    addKnowledgeBaseArticle(
      title: $title
      content: $content
      category: $category
    ) {
      article_id
    }
  }
`;

function TicketForm() {
  const [addTicket, { loading, error }] = useMutation(ADD_TICKET, {
    refetchQueries: [{ query: GET_TICKETS }],
  });
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [contactId, setContactId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket({
      variables: {
        subject,
        description,
        status,
        priority,
        contact_id: contactId,
        user_id: userId,
      },
    });
    setSubject('');
    setDescription('');
    setStatus('');
    setPriority('');
    setContactId('');
    setUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Ticket'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function TicketList() {
  const { loading, error, data } = useQuery(GET_TICKETS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.tickets.map((ticket: any) => (
        <div key={ticket.ticket_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{ticket.subject}</h3>
          <p>{ticket.description}</p>
          <p>Status: {ticket.status}</p>
          <p>Priority: {ticket.priority}</p>
        </div>
      ))}
    </div>
  );
}

function KnowledgeBaseArticleForm() {
  const [addKnowledgeBaseArticle, { loading, error }] = useMutation(ADD_KNOWLEDGE_BASE_ARTICLE, {
    refetchQueries: [{ query: GET_KNOWLEDGE_BASE_ARTICLES }],
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addKnowledgeBaseArticle({
      variables: {
        title,
        content,
        category,
      },
    });
    setTitle('');
    setContent('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Article'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function KnowledgeBaseArticleList() {
  const { loading, error, data } = useQuery(GET_KNOWLEDGE_BASE_ARTICLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.knowledgeBaseArticles.map((article: any) => (
        <div key={article.article_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{article.title}</h3>
          <p>{article.content}</p>
          <p>Category: {article.category}</p>
        </div>
      ))}
    </div>
  );
}

export default function CustomerServicePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Service & Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Tickets</h2>
          <TicketForm />
          <TicketList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Knowledge Base</h2>
          <KnowledgeBaseArticleForm />
          <KnowledgeBaseArticleList />
        </div>
      </div>
    </div>
  );
}
