'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_CALLS = gql`
  query GetCalls {
    calls {
      call_id
      contact_id
      user_id
      call_date
      duration_minutes
      notes
    }
  }
`;

const ADD_CALL = gql`
  mutation AddCall(
    $contact_id: ID
    $user_id: ID
    $call_date: String!
    $duration_minutes: Int
    $notes: String
  ) {
    addCall(
      contact_id: $contact_id
      user_id: $user_id
      call_date: $call_date
      duration_minutes: $duration_minutes
      notes: $notes
    ) {
      call_id
    }
  }
`;

const GET_MEETINGS = gql`
  query GetMeetings {
    meetings {
      meeting_id
      title
      description
      meeting_date
      location
      contact_id
      user_id
    }
  }
`;

const ADD_MEETING = gql`
  mutation AddMeeting(
    $title: String!
    $description: String
    $meeting_date: String!
    $location: String
    $contact_id: ID
    $user_id: ID
  ) {
    addMeeting(
      title: $title
      description: $description
      meeting_date: $meeting_date
      location: $location
      contact_id: $contact_id
      user_id: $user_id
    ) {
      meeting_id
    }
  }
`;

function CallForm() {
  const [addCall, { loading, error }] = useMutation(ADD_CALL, {
    refetchQueries: [{ query: GET_CALLS }],
  });
  const [contactId, setContactId] = useState('');
  const [userId, setUserId] = useState('');
  const [callDate, setCallDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCall({
      variables: {
        contact_id: contactId,
        user_id: userId,
        call_date: callDate,
        duration_minutes: parseInt(durationMinutes),
        notes,
      },
    });
    setContactId('');
    setUserId('');
    setCallDate('');
    setDurationMinutes('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <input
        type="datetime-local"
        placeholder="Call Date"
        value={callDate}
        onChange={(e) => setCallDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Duration (minutes)"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Call'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function CallList() {
  const { loading, error, data } = useQuery(GET_CALLS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.calls.map((call: any) => (
        <div key={call.call_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">Call with {call.contact_id}</h3>
          <p>Date: {call.call_date}</p>
          <p>Duration: {call.duration_minutes} minutes</p>
          <p>Notes: {call.notes}</p>
        </div>
      ))}
    </div>
  );
}

function MeetingForm() {
  const [addMeeting, { loading, error }] = useMutation(ADD_MEETING, {
    refetchQueries: [{ query: GET_MEETINGS }],
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [location, setLocation] = useState('');
  const [contactId, setContactId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeeting({
      variables: {
        title,
        description,
        meeting_date: meetingDate,
        location,
        contact_id: contactId,
        user_id: userId,
      },
    });
    setTitle('');
    setDescription('');
    setMeetingDate('');
    setLocation('');
    setContactId('');
    setUserId('');
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
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        placeholder="Meeting Date"
        value={meetingDate}
        onChange={(e) => setMeetingDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
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
        {loading ? 'Adding...' : 'Add Meeting'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function MeetingList() {
  const { loading, error, data } = useQuery(GET_MEETINGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.meetings.map((meeting: any) => (
        <div key={meeting.meeting_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{meeting.title}</h3>
          <p>Description: {meeting.description}</p>
          <p>Date: {meeting.meeting_date}</p>
          <p>Location: {meeting.location}</p>
        </div>
      ))}
    </div>
  );
}

export default function CommunicationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Communication Tracking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Calls</h2>
          <CallForm />
          <CallList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Meetings</h2>
          <MeetingForm />
          <MeetingList />
        </div>
      </div>
    </div>
  );
}
