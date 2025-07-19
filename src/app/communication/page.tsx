'use client';

import { useState, useEffect } from 'react';

interface Call {
  call_id: string;
  contact_id?: string;
  user_id?: string;
  call_date: string;
  duration_minutes?: number;
  notes?: string;
}

interface Meeting {
  meeting_id: string;
  title: string;
  description?: string;
  meeting_date: string;
  location?: string;
  contact_id?: string;
  user_id?: string;
}

export default function CommunicationPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  const [callFormData, setCallFormData] = useState({
    contact_id: '',
    user_id: '',
    call_date: '',
    duration_minutes: '',
    notes: '',
  });

  const [meetingFormData, setMeetingFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    location: '',
    contact_id: '',
    user_id: '',
  });

  useEffect(() => {
    fetchCalls();
    fetchMeetings();
  }, []);

  const fetchCalls = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            calls {
              call_id
              contact_id
              user_id
              call_date
              duration_minutes
              notes
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.calls) {
      setCalls(result.data.calls);
    }
  };

  const fetchMeetings = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
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
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.meetings) {
      setMeetings(result.data.meetings);
    }
  };

  const handleCallInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCallFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMeetingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeetingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddCall($contact_id: ID, $user_id: ID, $call_date: String!, $duration_minutes: Int, $notes: String) {
            addCall(contact_id: $contact_id, user_id: $user_id, call_date: $call_date, duration_minutes: $duration_minutes, notes: $notes) {
              call_id
              call_date
              contact_id
            }
          }
        `,
        variables: {
          ...callFormData,
          duration_minutes: callFormData.duration_minutes ? parseInt(callFormData.duration_minutes) : null,
        },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addCall) {
      setCalls((prevCalls) => [...prevCalls, result.data.addCall]);
      setCallFormData({
        contact_id: '',
        user_id: '',
        call_date: '',
        duration_minutes: '',
        notes: '',
      });
    }
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddMeeting($title: String!, $description: String, $meeting_date: String!, $location: String, $contact_id: ID, $user_id: ID) {
            addMeeting(title: $title, description: $description, meeting_date: $meeting_date, location: $location, contact_id: $contact_id, user_id: $user_id) {
              meeting_id
              title
              meeting_date
            }
          }
        `,
        variables: meetingFormData,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addMeeting) {
      setMeetings((prevMeetings) => [...prevMeetings, result.data.addMeeting]);
      setMeetingFormData({
        title: '',
        description: '',
        meeting_date: '',
        location: '',
        contact_id: '',
        user_id: '',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Communication Tracking</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Call</h2>
        <form onSubmit={handleAddCall} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="contact_id"
            placeholder="Contact ID (Optional)"
            value={callFormData.contact_id}
            onChange={handleCallInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="user_id"
            placeholder="User ID (Optional)"
            value={callFormData.user_id}
            onChange={handleCallInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="call_date"
            placeholder="Call Date"
            value={callFormData.call_date}
            onChange={handleCallInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="duration_minutes"
            placeholder="Duration (minutes)"
            value={callFormData.duration_minutes}
            onChange={handleCallInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={callFormData.notes}
            onChange={handleCallInputChange}
            rows={3}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Call
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Calls</h2>
        {calls.length === 0 ? (
          <p>No calls found.</p>
        ) : (
          <ul className="space-y-2">
            {calls.map((call) => (
              <li key={call.call_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">Call on {call.call_date}</p>
                {call.duration_minutes && <p className="text-sm text-gray-600">Duration: {call.duration_minutes} mins</p>}
                {call.notes && <p className="text-sm text-gray-600">Notes: {call.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Meeting</h2>
        <form onSubmit={handleAddMeeting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={meetingFormData.title}
            onChange={handleMeetingInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="meeting_date"
            placeholder="Meeting Date"
            value={meetingFormData.meeting_date}
            onChange={handleMeetingInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={meetingFormData.location}
            onChange={handleMeetingInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="contact_id"
            placeholder="Contact ID (Optional)"
            value={meetingFormData.contact_id}
            onChange={handleMeetingInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="user_id"
            placeholder="User ID (Optional)"
            value={meetingFormData.user_id}
            onChange={handleMeetingInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={meetingFormData.description}
            onChange={handleMeetingInputChange}
            rows={3}
            className="p-2 border rounded col-span-full"
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Add Meeting
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Meetings</h2>
        {meetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <ul className="space-y-2">
            {meetings.map((meeting) => (
              <li key={meeting.meeting_id} className="p-3 border rounded shadow-sm">
                <p className="font-medium">{meeting.title} on {meeting.meeting_date}</p>
                {meeting.location && <p className="text-sm text-gray-600">Location: {meeting.location}</p>}
                {meeting.description && <p className="text-sm text-gray-600">Description: {meeting.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}