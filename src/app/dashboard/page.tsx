'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalContacts: number;
  totalLeads: number;
  totalDeals: number;
  dealsByStage: { stage: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            totalContacts
            totalLeads
            totalDeals
            dealsByStage {
              stage
              count
            }
            leadsByStatus {
              status
              count
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data) {
      setStats(result.data);
    }
  };

  if (!stats) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">{t('total_contacts')}</h2>
          <p className="text-3xl font-bold">{stats.totalContacts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">{t('total_leads')}</h2>
          <p className="text-3xl font-bold">{stats.totalLeads}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">{t('total_deals')}</h2>
          <p className="text-3xl font-bold">{stats.totalDeals}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <h2 className="text-lg font-semibold mb-4">{t('deals_by_stage')}</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dealsByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-80">
          <h2 className="text-lg font-semibold mb-4">{t('leads_by_status')}</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}