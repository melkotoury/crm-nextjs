'use client';

import { useState, useEffect } from 'react';

interface Contact {
  contact_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  company?: string;
  job_title?: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    company: '',
    job_title: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
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
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.contacts) {
      setContacts(result.data.contacts);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddContact($first_name: String!, $last_name: String!, $email: String!, $phone_number: String, $company: String, $job_title: String) {
            addContact(first_name: $first_name, last_name: $last_name, email: $email, phone_number: $phone_number, company: $company, job_title: $job_title) {
              contact_id
              first_name
              last_name
              email
            }
          }
        `,
        variables: formData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addContact) {
      setContacts((prevContacts) => [...prevContacts, result.data.addContact]);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        company: '',
        job_title: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Contact</h2>
        <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="job_title"
            placeholder="Job Title"
            value={formData.job_title}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Contact
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Contacts</h2>
        {contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.contact_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                <p className="text-sm text-gray-600">{contact.email}</p>
                {contact.company && <p className="text-sm text-gray-600">{contact.company}</p>}
                {contact.job_title && <p className="text-sm text-gray-600">{contact.job_title}</p>}
                {contact.phone_number && <p className="text-sm text-gray-600">{contact.phone_number}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}