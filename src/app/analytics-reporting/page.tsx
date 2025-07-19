'use client';

import { useState, useEffect } from 'react';

interface Report {
  report_id: string;
  report_name: string;
  report_type?: string;
  generated_date?: string;
  data?: string;
}

interface Dashboard {
  dashboard_id: string;
  dashboard_name: string;
  layout?: string;
}

export default function AnalyticsReportingPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const [reportFormData, setReportFormData] = useState({
    report_name: '',
    report_type: '',
    generated_date: '',
    data: '',
  });

  const [dashboardFormData, setDashboardFormData] = useState({
    dashboard_name: '',
    layout: '',
  });

  useEffect(() => {
    fetchReports();
    fetchDashboards();
  }, []);

  const fetchReports = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            reports {
              report_id
              report_name
              report_type
              generated_date
              data
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.reports) {
      setReports(result.data.reports);
    }
  };

  const fetchDashboards = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            dashboards {
              dashboard_id
              dashboard_name
              layout
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.dashboards) {
      setDashboards(result.data.dashboards);
    }
  };

  const handleReportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDashboardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDashboardFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddReport($report_name: String!, $report_type: String, $generated_date: String, $data: String) {
            addReport(report_name: $report_name, report_type: $report_type, generated_date: $generated_date, data: $data) {
              report_id
              report_name
              report_type
            }
          }
        `,
        variables: reportFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addReport) {
      setReports((prevReports) => [...prevReports, result.data.addReport]);
      setReportFormData({
        report_name: '',
        report_type: '',
        generated_date: '',
        data: '',
      });
    }
  };

  const handleAddDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddDashboard($dashboard_name: String!, $layout: String) {
            addDashboard(dashboard_name: $dashboard_name, layout: $layout) {
              dashboard_id
              dashboard_name
            }
          }
        `,
        variables: dashboardFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addDashboard) {
      setDashboards((prevDashboards) => [...prevDashboards, result.data.addDashboard]);
      setDashboardFormData({
        dashboard_name: '',
        layout: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics & Reporting</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Report</h2>
        <form onSubmit={handleAddReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="report_name"
            placeholder="Report Name"
            value={reportFormData.report_name}
            onChange={handleReportInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="report_type"
            placeholder="Report Type"
            value={reportFormData.report_type}
            onChange={handleReportInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="generated_date"
            placeholder="Generated Date"
            value={reportFormData.generated_date}
            onChange={handleReportInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="data"
            placeholder="Report Data (e.g., JSON string)"
            value={reportFormData.data}
            onChange={handleReportInputChange}
            rows={3}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Report
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Reports</h2>
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report.report_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{report.report_name} ({report.report_type})</p>
                {report.generated_date && <p className="text-sm text-gray-600">Generated: {report.generated_date}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Dashboard</h2>
        <form onSubmit={handleAddDashboard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="dashboard_name"
            placeholder="Dashboard Name"
            value={dashboardFormData.dashboard_name}
            onChange={handleDashboardInputChange}
            required
            className="p-2 border rounded"
          />
          <textarea
            name="layout"
            placeholder="Layout (e.g., JSON string for widget positions)"
            value={dashboardFormData.layout}
            onChange={handleDashboardInputChange}
            rows={3}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Dashboard
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Dashboards</h2>
        {dashboards.length === 0 ? (
          <p>No dashboards found.</p>
        ) : (
          <ul className="space-y-2">
            {dashboards.map((dashboard) => (
              <li key={dashboard.dashboard_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{dashboard.dashboard_name}</p>
                {dashboard.layout && <p className="text-sm text-gray-600">Layout: {dashboard.layout.substring(0, 100)}...</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}