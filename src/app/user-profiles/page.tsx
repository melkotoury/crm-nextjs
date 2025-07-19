'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_USER_PROFILES = gql`
  query GetUserProfiles {
    userProfiles {
      profile_id
      user_id
      bio
      profile_picture_url
      social_media_links
    }
  }
`;

const ADD_USER_PROFILE = gql`
  mutation AddUserProfile(
    $user_id: ID!
    $bio: String
    $profile_picture_url: String
    $social_media_links: String
  ) {
    addUserProfile(
      user_id: $user_id
      bio: $bio
      profile_picture_url: $profile_picture_url
      social_media_links: $social_media_links
    ) {
      profile_id
    }
  }
`;

function UserProfileForm() {
  const [addUserProfile, { loading, error }] = useMutation(ADD_USER_PROFILE, {
    refetchQueries: [{ query: GET_USER_PROFILES }],
  });
  const [userId, setUserId] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [socialMediaLinks, setSocialMediaLinks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserProfile({
      variables: {
        user_id: userId,
        bio,
        profile_picture_url: profilePictureUrl,
        social_media_links: socialMediaLinks,
      },
    });
    setUserId('');
    setBio('');
    setProfilePictureUrl('');
    setSocialMediaLinks('');
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
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Profile Picture URL"
        value={profilePictureUrl}
        onChange={(e) => setProfilePictureUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Social Media Links (JSON string)"
        value={socialMediaLinks}
        onChange={(e) => setSocialMediaLinks(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add User Profile'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function UserProfileList() {
  const { loading, error, data } = useQuery(GET_USER_PROFILES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.userProfiles.map((profile: any) => (
        <div key={profile.profile_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">User ID: {profile.user_id}</h3>
          <p>Bio: {profile.bio}</p>
          <p>Profile Picture: {profile.profile_picture_url}</p>
          <p>Social Media: {profile.social_media_links}</p>
        </div>
      ))}
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add User Profile</h2>
          <UserProfileForm />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">User Profiles List</h2>
          <UserProfileList />
        </div>
      </div>
    </div>
  );
}
