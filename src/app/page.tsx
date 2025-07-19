'use client';

import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      contact_id
      first_name
      last_name
      email
      phone_number
      company
      job_title
    }
  }
`;

const ADD_CONTACT = gql`
  mutation AddContact(
    $first_name: String!
    $last_name: String!
    $email: String!
    $phone_number: String
    $company: String
    $job_title: String
  ) {
    addContact(
      first_name: $first_name
      last_name: $last_name
      email: $email
      phone_number: $phone_number
      company: $company
      job_title: $job_title
    ) {
      contact_id
    }
  }
`;

function ContactForm() {
  const [addContact, { data, loading, error }] = useMutation(ADD_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContact({
      variables: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        company: company,
        job_title: jobTitle,
      },
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
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
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Contact'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function ContactList() {
  const { loading, error, data } = useQuery(GET_CONTACTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.contacts.map((contact: any) => (
        <div key={contact.contact_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{contact.first_name} {contact.last_name}</h3>
          <p>{contact.email}</p>
          <p>{contact.phone_number}</p>
          <p>{contact.company}</p>
          <p>{contact.job_title}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Contacts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Add Contact</h2>
            <ContactForm />
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Contact List</h2>
            <ContactList />
          </div>
        </div>
      </main>
    </ApolloProvider>
  );
}
