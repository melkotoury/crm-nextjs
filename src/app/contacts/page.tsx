'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { t } = useTranslation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      // Update contact
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateContact($contact_id: ID!, $first_name: String, $last_name: String, $email: String, $phone_number: String, $company: String, $job_title: String) {
              updateContact(contact_id: $contact_id, first_name: $first_name, last_name: $last_name, email: $email, phone_number: $phone_number, company: $company, job_title: $job_title) {
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
          variables: { contact_id: editingContact.contact_id, ...formData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateContact) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.contact_id === result.data.updateContact.contact_id
              ? result.data.updateContact
              : contact
          )
        );
        setEditingContact(null);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone_number: '',
          company: '',
          job_title: '',
        });
      }
    } else {
      // Add new contact
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
                phone_number
                company
                job_title
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
    }
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone_number || '',
      company: contact.company || '',
      job_title: contact.job_title || '',
    });
  };

  const handleDeleteContact = async (contact_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteContact($contact_id: ID!) {
            deleteContact(contact_id: $contact_id)
          }
        `,
        variables: { contact_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteContact) {
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.contact_id !== contact_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('contacts')}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingContact ? t('edit_contact') : t('add_new_contact')}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder={t('first_name')}
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            placeholder={t('last_name')}
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="phone_number"
            placeholder={t('phone_number')}
            value={formData.phone_number}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="company"
            placeholder={t('company')}
            value={formData.company}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="job_title"
            placeholder={t('job_title')}
            value={formData.job_title}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingContact ? t('update_contact') : t('add_contact')}
          </button>
          {editingContact && (
            <button
              type="button"
              onClick={() => {
                setEditingContact(null);
                setFormData({
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone_number: '',
                  company: '',
                  job_title: '',
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              {t('cancel_edit')}
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">{t('existing_contacts')}</h2>
        {contacts.length === 0 ? (
          <p>{t('no_contacts_found')}</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.contact_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  {contact.company && <p className="text-sm text-gray-600">{contact.company}</p>}
                  {contact.job_title && <p className="text-sm text-gray-600">{contact.job_title}</p>}
                  {contact.phone_number && <p className="text-sm text-gray-600">{contact.phone_number}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(contact)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.contact_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    {t('delete')}
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