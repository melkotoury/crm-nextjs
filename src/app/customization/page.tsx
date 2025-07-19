'use client';

import { useState, useEffect } from 'react';

interface Role {
  role_id: string;
  role_name: string;
}

interface Permission {
  permission_id: string;
  permission_name: string;
}

export default function CustomizationPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissionName, setNewPermissionName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            roles {
              role_id
              role_name
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.roles) {
      setRoles(result.data.roles);
    }
  };

  const fetchPermissions = async () => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            permissions {
              permission_id
              permission_name
            }
          }
        `,
      }),
    });
    const result = await response.json();
    if (result.data && result.data.permissions) {
      setPermissions(result.data.permissions);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddRole($role_name: String!) {
            addRole(role_name: $role_name) {
              role_id
              role_name
            }
          }
        `,
        variables: { role_name: newRoleName },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addRole) {
      setRoles((prevRoles) => [...prevRoles, result.data.addRole]);
      setNewRoleName('');
    }
  };

  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddPermission($permission_name: String!) {
            addPermission(permission_name: $permission_name) {
              permission_id
              permission_name
            }
          }
        `,
        variables: { permission_name: newPermissionName },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addPermission) {
      setPermissions((prevPermissions) => [...prevPermissions, result.data.addPermission]);
      setNewPermissionName('');
    }
  };

  const handleAddRolePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !selectedPermissionId) {
      alert('Please select both a role and a permission.');
      return;
    }
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation AddRolePermission($role_id: ID!, $permission_id: ID!) {
            addRolePermission(role_id: $role_id, permission_id: $permission_id)
          }
        `,
        variables: { role_id: selectedRoleId, permission_id: selectedPermissionId },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.addRolePermission) {
      alert('Role permission added successfully!');
      setSelectedRoleId('');
      setSelectedPermissionId('');
    } else {
      alert('Failed to add role permission.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customization - Roles & Permissions</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Role</h2>
        <form onSubmit={handleAddRole} className="flex gap-2">
          <input
            type="text"
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
            className="p-2 border rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Role
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing Roles</h2>
        {roles.length === 0 ? (
          <p>No roles found.</p>
        ) : (
          <ul className="space-y-2">
            {roles.map((role) => (
              <li key={role.role_id} className="p-3 border rounded shadow-sm">
                {role.role_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Permission</h2>
        <form onSubmit={handleAddPermission} className="flex gap-2">
          <input
            type="text"
            placeholder="Permission Name"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            required
            className="p-2 border rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Permission
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing Permissions</h2>
        {permissions.length === 0 ? (
          <p>No permissions found.</p>
        ) : (
          <ul className="space-y-2">
            {permissions.map((permission) => (
              <li key={permission.permission_id} className="p-3 border rounded shadow-sm">
                {permission.permission_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assign Permission to Role</h2>
        <form onSubmit={handleAddRolePermission} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            required
            className="p-2 border rounded"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
          <select
            value={selectedPermissionId}
            onChange={(e) => setSelectedPermissionId(e.target.value)}
            required
            className="p-2 border rounded"
          >
            <option value="">Select Permission</option>
            {permissions.map((permission) => (
              <option key={permission.permission_id} value={permission.permission_id}>
                {permission.permission_name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full">
            Assign Permission
          </button>
        </form>
      </div>
    </div>
  );
}