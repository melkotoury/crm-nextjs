'use client';

import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      user_id
      username
      email
      full_name
      role
      role_id
    }
  }
`;

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($user_id: ID!, $role_id: ID!) {
    updateUserRole(user_id: $user_id, role_id: $role_id) {
      user_id
      role_id
    }
  }
`;

const GET_ROLES = gql`
  query GetRoles {
    roles {
      role_id
      role_name
    }
  }
`;

const ADD_ROLE = gql`
  mutation AddRole($role_name: String!) {
    addRole(role_name: $role_name) {
      role_id
      role_name
    }
  }
`;

const GET_PERMISSIONS = gql`
  query GetPermissions {
    permissions {
      permission_id
      permission_name
    }
  }
`;

const ADD_PERMISSION = gql`
  mutation AddPermission($permission_name: String!) {
    addPermission(permission_name: $permission_name) {
      permission_id
      permission_name
    }
  }
`;

const ADD_ROLE_PERMISSION = gql`
  mutation AddRolePermission($role_id: ID!, $permission_id: ID!) {
    addRolePermission(role_id: $role_id, permission_id: $permission_id)
  }
`;

function RoleForm() {
  const [addRole, { loading, error }] = useMutation(ADD_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
  });
  const [roleName, setRoleName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRole({
      variables: {
        role_name: roleName,
      },
    });
    setRoleName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Role Name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Role'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function RoleList() {
  const { loading, error, data } = useQuery(GET_ROLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.roles.map((role: any) => (
        <div key={role.role_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{role.role_name}</h3>
        </div>
      ))}
    </div>
  );
}

function PermissionForm() {
  const [addPermission, { loading, error }] = useMutation(ADD_PERMISSION, {
    refetchQueries: [{ query: GET_PERMISSIONS }],
  });
  const [permissionName, setPermissionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPermission({
      variables: {
        permission_name: permissionName,
      },
    });
    setPermissionName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Permission Name"
        value={permissionName}
        onChange={(e) => setPermissionName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="w-full p-2 bg-blue-500 text-white rounded">
        {loading ? 'Adding...' : 'Add Permission'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}

function PermissionList() {
  const { loading, error, data } = useQuery(GET_PERMISSIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.permissions.map((permission: any) => (
        <div key={permission.permission_id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-bold">{permission.permission_name}</h3>
        </div>
      ))}
    </div>
  );
}

function UserList() {
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
  const { loading: rolesLoading, error: rolesError, data: rolesData } = useQuery(GET_ROLES);
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    refetchQueries: [{ query: GET_USERS }],
  });

  if (usersLoading || rolesLoading) return <p>Loading...</p>;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;
  if (rolesError) return <p>Error loading roles: {rolesError.message}</p>;

  const handleRoleChange = (userId: string, roleId: string) => {
    updateUserRole({
      variables: {
        user_id: userId,
        role_id: roleId,
      },
    });
  };

  return (
    <div className="space-y-4">
      {usersData.users.map((user: any) => (
        <div key={user.user_id} className="p-4 border rounded-lg flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{user.username}</h3>
            <p>{user.email}</p>
            <p>Current Role: {user.role_id ? rolesData.roles.find((r: any) => r.role_id == user.role_id)?.role_name : 'N/A'}</p>
          </div>
          <select
            value={user.role_id || ''}
            onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Role</option>
            {rolesData.roles.map((role: any) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default function CustomizationPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customization & Scalability</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Roles</h2>
          <RoleForm />
          <RoleList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Permissions</h2>
          <PermissionForm />
          <PermissionList />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Assign Roles to Users</h2>
          <UserList />
        </div>
      </div>
    </div>
  );
}
