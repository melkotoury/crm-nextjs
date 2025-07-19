'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_REPORTS = gql`
  query GetReports {
    reports {
      report_id
      report_name
      report_type
      generated_date
      data
    }
  }
`;

const ADD_REPORT = gql`
  mutation AddReport(
    $report_name: String!
    $report_type: String
    $generated_date: String
    $data: String
  ) {
    addReport(
      report_name: $report_name
      report_type: $report_type
      generated_date: $generated_date
      data: $data
    ) {
      report_id
    }
  }
`;

function ReportForm() {
  const [addReport, { loading, error }] = useMutation(ADD_REPORT, {
    refetchQueries: [{ query: GET_REPORTS }],
  });
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');
  const [generatedDate, setGeneratedDate] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport({
      variables: {
        report_name: reportName,
        report_type: reportType,
        generated_date: generatedDate,
        data: data,
      },
    });
    setReportName('');
    setReportType('');
    setGeneratedDate('');
    setData('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Report Name"
        value={reportName}
        onChange={(e) => setReportName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Report Type"
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        placeholder="Generated Date"
        value={generatedDate}
        onChange={(e) => setGeneratedDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Data (JSON string)"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Report'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function ReportList() {
  const { loading, error, data } = useQuery(GET_REPORTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.reports.map((report: any) => (
        <div key={report.report_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{report.report_name}</h3>
          <p>Type: {report.report_type}</p>
          <p>Generated: {report.generated_date}</p>
          <p>Data: {report.data}</p>
        </div>
      ))}
    </div>
  );
}

const GET_DASHBOARDS = gql`
  query GetDashboards {
    dashboards {
      dashboard_id
      dashboard_name
      layout
    }
  }
`;

const ADD_DASHBOARD = gql`
  mutation AddDashboard(
    $dashboard_name: String!
    $layout: String
  ) {
    addDashboard(
      dashboard_name: $dashboard_name
      layout: $layout
    ) {
      dashboard_id
    }
  }
`;

function DashboardForm() {
  const [addDashboard, { loading, error }] = useMutation(ADD_DASHBOARD, {
    refetchQueries: [{ query: GET_DASHBOARDS }],
  });
  const [dashboardName, setDashboardName] = useState('');
  const [layout, setLayout] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDashboard({
      variables: {
        dashboard_name: dashboardName,
        layout: layout,
      },
    });
    setDashboardName('');
    setLayout('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Dashboard Name"
        value={dashboardName}
        onChange={(e) => setDashboardName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Layout (JSON string)"
        value={layout}
        onChange={(e) => setLayout(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Dashboard'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function DashboardList() {
  const { loading, error, data } = useQuery(GET_DASHBOARDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.dashboards.map((dashboard: any) => (
        <div key={dashboard.dashboard_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{dashboard.dashboard_name}</h3>
          <p>Layout: {dashboard.layout}</p>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsReportingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Analytics & Reporting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Reports</h2>
          <ReportForm />
          <ReportList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboards</h2>
          <DashboardForm />
          <DashboardList />
        </div>
      </div>
    </div>
  );
}
