'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Lead {
  lead_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  status: string;
  source?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    status: 'New',
    source: '',
  });
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
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
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.leads) {
      setLeads(result.data.leads);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      // Update lead
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateLead($lead_id: ID!, $first_name: String, $last_name: String, $email: String, $company: String, $status: String, $source: String) {
              updateLead(lead_id: $lead_id, first_name: $first_name, last_name: $last_name, email: $email, company: $company, status: $status, source: $source) {
                lead_id
                first_name
                last_name
                email
                company
                status
                source
              }
            }
          `,
          variables: {
            lead_id: editingLead.lead_id,
            ...formData,
            amount: formData.amount ? parseFloat(formData.amount) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateLead) {
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.lead_id === result.data.updateLead.lead_id
              ? result.data.updateLead
              : lead
          )
        );
        setEditingLead(null);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          company: '',
          status: 'New',
          source: '',
        });
      }
    } else {
      // Add new lead
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation AddLead($first_name: String!, $last_name: String!, $email: String!, $company: String, $status: String!, $source: String) {
              addLead(first_name: $first_name, last_name: $last_name, email: $email, company: $company, status: $status, source: $source) {
                lead_id
                first_name
                last_name
                email
                company
                status
                source
              }
            }
          `,
          variables: formData,
        }),
      });
      const result = await response.json();
      if (result.data && result.data.addLead) {
        setLeads((prevLeads) => [...prevLeads, result.data.addLead]);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          company: '',
          status: 'New',
          source: '',
        });
      }
    }
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      company: lead.company || '',
      status: lead.status,
      source: lead.source || '',
    });
  };

  const handleDeleteLead = async (lead_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteLead($lead_id: ID!) {
            deleteLead(lead_id: $lead_id)
          }
        `,
        variables: { lead_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteLead) {
      setLeads((prevLeads) =>
        prevLeads.filter((lead) => lead.lead_id !== lead_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('leads')}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingLead ? t('edit_lead') : t('add_new_lead')}</h2>
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
            name="company"
            placeholder={t('company')}
            value={formData.company}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          >
            <option value="New">{t('status_new')}</option>
            <option value="Contacted">{t('status_contacted')}</option>
            <option value="Qualified">{t('status_qualified')}</option>
            <option value="Disqualified">{t('status_disqualified')}</option>
          </select>
          <input
            type="text"
            name="source"
            placeholder={t('source')}
            value={formData.source}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            {editingLead ? t('update_lead') : t('add_lead')}
          </button>
          {editingLead && (
            <button
              type="button"
              onClick={() => {
                setEditingLead(null);
                setFormData({
                  first_name: '',
                  last_name: '',
                  email: '',
                  company: '',
                  status: 'New',
                  source: '',
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
        <h2 className="text-xl font-semibold mb-2">{t('existing_leads')}</h2>
        {leads.length === 0 ? (
          <p>{t('no_leads_found')}</p>
        ) : (
          <ul className="space-y-2">
            {leads.map((lead) => (
              <li key={lead.lead_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  {lead.company && <p className="text-sm text-gray-600">{lead.company}</p>}
                  <p className="text-sm text-gray-600">{t('status')}: {lead.status}</p>
                  {lead.source && <p className="text-sm text-gray-600">{t('source')}: {lead.source}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(lead)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.lead_id)}
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