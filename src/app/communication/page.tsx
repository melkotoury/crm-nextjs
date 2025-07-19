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

  const [editingCall, setEditingCall] = useState<Call | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

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

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCall) {
      // Update call
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateCall($call_id: ID!, $contact_id: ID, $user_id: ID, $call_date: String, $duration_minutes: Int, $notes: String) {
              updateCall(call_id: $call_id, contact_id: $contact_id, user_id: $user_id, call_date: $call_date, duration_minutes: $duration_minutes, notes: $notes) {
                call_id
                contact_id
                user_id
                call_date
                duration_minutes
                notes
              }
            }
          `,
          variables: {
            call_id: editingCall.call_id,
            ...callFormData,
            duration_minutes: callFormData.duration_minutes ? parseInt(callFormData.duration_minutes) : null,
          },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateCall) {
        setCalls((prevCalls) =>
          prevCalls.map((call) =>
            call.call_id === result.data.updateCall.call_id
              ? result.data.updateCall
              : call
          )
        );
        setEditingCall(null);
        setCallFormData({
          contact_id: '',
          user_id: '',
          call_date: '',
          duration_minutes: '',
          notes: '',
        });
      }
    } else {
      // Add new call
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
                contact_id
                user_id
                call_date
                duration_minutes
                notes
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
    }
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeeting) {
      // Update meeting
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateMeeting($meeting_id: ID!, $title: String, $description: String, $meeting_date: String, $location: String, $contact_id: ID, $user_id: ID) {
              updateMeeting(meeting_id: $meeting_id, title: $title, description: $description, meeting_date: $meeting_date, location: $location, contact_id: $contact_id, user_id: $user_id) {
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
          variables: { meeting_id: editingMeeting.meeting_id, ...meetingFormData },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateMeeting) {
        setMeetings((prevMeetings) =>
          prevMeetings.map((meeting) =>
            meeting.meeting_id === result.data.updateMeeting.meeting_id
              ? result.data.updateMeeting
              : meeting
          )
        );
        setEditingMeeting(null);
        setMeetingFormData({
          title: '',
          description: '',
          meeting_date: '',
          location: '',
          contact_id: '',
          user_id: '',
        });
      }
    } else {
      // Add new meeting
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
                description
                meeting_date
                location
                contact_id
                user_id
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
    }
  };

  const handleEditCallClick = (call: Call) => {
    setEditingCall(call);
    setCallFormData({
      contact_id: call.contact_id || '',
      user_id: call.user_id || '',
      call_date: call.call_date,
      duration_minutes: call.duration_minutes ? String(call.duration_minutes) : '',
      notes: call.notes || '',
    });
  };

  const handleDeleteCall = async (call_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteCall($call_id: ID!) {
            deleteCall(call_id: $call_id)
          }
        `,
        variables: { call_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteCall) {
      setCalls((prevCalls) =>
        prevCalls.filter((call) => call.call_id !== call_id)
      );
    }
  };

  const handleEditMeetingClick = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setMeetingFormData({
      title: meeting.title,
      description: meeting.description || '',
      meeting_date: meeting.meeting_date,
      location: meeting.location || '',
      contact_id: meeting.contact_id || '',
      user_id: meeting.user_id || '',
    });
  };

  const handleDeleteMeeting = async (meeting_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteMeeting($meeting_id: ID!) {
            deleteMeeting(meeting_id: $meeting_id)
          }
        `,
        variables: { meeting_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteMeeting) {
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.meeting_id !== meeting_id)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Communication Tracking</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingCall ? 'Edit Call' : 'Add New Call'}</h2>
        <form onSubmit={handleCallSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingCall ? 'Update Call' : 'Add Call'}
          </button>
          {editingCall && (
            <button
              type="button"
              onClick={() => {
                setEditingCall(null);
                setCallFormData({
                  contact_id: '',
                  user_id: '',
                  call_date: '',
                  duration_minutes: '',
                  notes: '',
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Calls</h2>
        {calls.length === 0 ? (
          <p>No calls found.</p>
        ) : (
          <ul className="space-y-2">
            {calls.map((call) => (
              <li key={call.call_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">Call on {call.call_date}</p>
                  {call.duration_minutes && <p className="text-sm text-gray-600">Duration: {call.duration_minutes} mins</p>}
                  {call.notes && <p className="text-sm text-gray-600">Notes: {call.notes}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCallClick(call)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCall(call.call_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2">{editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}</h2>
        <form onSubmit={handleMeetingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingMeeting ? 'Update Meeting' : 'Add Meeting'}
          </button>
          {editingMeeting && (
            <button
              type="button"
              onClick={() => {
                setEditingMeeting(null);
                setMeetingFormData({
                  title: '',
                  description: '',
                  meeting_date: '',
                  location: '',
                  contact_id: '',
                  user_id: '',
                });
              }}
              className="bg-gray-500 text-white p-2 rounded col-span-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Meetings</h2>
        {meetings.length === 0 ? (
          <p>No meetings found.</p>
        ) : (
          <ul className="space-y-2">
            {meetings.map((meeting) => (
              <li key={meeting.meeting_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{meeting.title} on {meeting.meeting_date}</p>
                  {meeting.location && <p className="text-sm text-gray-600">Location: {meeting.location}</p>}
                  {meeting.description && <p className="text-sm text-gray-600">Description: {meeting.description}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMeetingClick(meeting)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.meeting_id)}
                    className="bg-red-500 text-white p-2 rounded text-sm"
                  >
                    Delete
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