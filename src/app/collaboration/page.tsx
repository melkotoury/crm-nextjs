'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_SHARED_CALENDARS = gql`
  query GetSharedCalendars {
    sharedCalendars {
      calendar_id
      calendar_name
      owner_user_id
    }
  }
`;

const ADD_SHARED_CALENDAR = gql`
  mutation AddSharedCalendar(
    $calendar_name: String!
    $owner_user_id: ID
  ) {
    addSharedCalendar(
      calendar_name: $calendar_name
      owner_user_id: $owner_user_id
    ) {
      calendar_id
    }
  }
`;

const GET_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      document_id
      document_name
      document_url
      owner_user_id
    }
  }
`;

const ADD_DOCUMENT = gql`
  mutation AddDocument(
    $document_name: String!
    $document_url: String!
    $owner_user_id: ID
  ) {
    addDocument(
      document_name: $document_name
      document_url: $document_url
      owner_user_id: $owner_user_id
    ) {
      document_id
    }
  }
`;

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      team_member_id
      user_id
      team_role
    }
  }
`;

const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember(
    $user_id: ID!
    $team_role: String
  ) {
    addTeamMember(
      user_id: $user_id
      team_role: $team_role
    ) {
      team_member_id
    }
  }
`;

function SharedCalendarForm() {
  const [addSharedCalendar, { loading, error }] = useMutation(ADD_SHARED_CALENDAR, {
    refetchQueries: [{ query: GET_SHARED_CALENDARS }],
  });
  const [calendarName, setCalendarName] = useState('');
  const [ownerUserId, setOwnerUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSharedCalendar({
      variables: {
        calendar_name: calendarName,
        owner_user_id: ownerUserId,
      },
    });
    setCalendarName('');
    setOwnerUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Calendar Name"
        value={calendarName}
        onChange={(e) => setCalendarName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Owner User ID"
        value={ownerUserId}
        onChange={(e) => setOwnerUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Calendar'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function SharedCalendarList() {
  const { loading, error, data } = useQuery(GET_SHARED_CALENDARS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.sharedCalendars.map((calendar: any) => (
        <div key={calendar.calendar_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{calendar.calendar_name}</h3>
          <p>Owner User ID: {calendar.owner_user_id}</p>
        </div>
      ))}
    </div>
  );
}

function DocumentForm() {
  const [addDocument, { loading, error }] = useMutation(ADD_DOCUMENT, {
    refetchQueries: [{ query: GET_DOCUMENTS }],
  });
  const [documentName, setDocumentName] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [ownerUserId, setOwnerUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      variables: {
        document_name: documentName,
        document_url: documentUrl,
        owner_user_id: ownerUserId,
      },
    });
    setDocumentName('');
    setDocumentUrl('');
    setOwnerUserId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Document Name"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Document URL"
        value={documentUrl}
        onChange={(e) => setDocumentUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Owner User ID"
        value={ownerUserId}
        onChange={(e) => setOwnerUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Document'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function DocumentList() {
  const { loading, error, data } = useQuery(GET_DOCUMENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.documents.map((document: any) => (
        <div key={document.document_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{document.document_name}</h3>
          <p>URL: {document.document_url}</p>
          <p>Owner User ID: {document.owner_user_id}</p>
        </div>
      ))}
    </div>
  );
}

function TeamMemberForm() {
  const [addTeamMember, { loading, error }] = useMutation(ADD_TEAM_MEMBER, {
    refetchQueries: [{ query: GET_TEAM_MEMBERS }],
  });
  const [userId, setUserId] = useState('');
  const [teamRole, setTeamRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeamMember({
      variables: {
        user_id: userId,
        team_role: teamRole,
      },
    });
    setUserId('');
    setTeamRole('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Team Role"
        value={teamRole}
        onChange={(e) => setTeamRole(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Team Member'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function TeamMemberList() {
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.teamMembers.map((member: any) => (
        <div key={member.team_member_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">User ID: {member.user_id}</h3>
          <p>Role: {member.team_role}</p>
        </div>
      ))}
    </div>
  );
}

export default function CollaborationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Collaboration Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Shared Calendars</h2>
          <SharedCalendarForm />
          <SharedCalendarList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Documents</h2>
          <DocumentForm />
          <DocumentList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Team Members</h2>
          <TeamMemberForm />
          <TeamMemberList />
        </div>
      </div>
    </div>
  );
}
