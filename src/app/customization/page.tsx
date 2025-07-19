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

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

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

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      // Update role
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateRole($role_id: ID!, $role_name: String) {
              updateRole(role_id: $role_id, role_name: $role_name) {
                role_id
                role_name
              }
            }
          `,
          variables: { role_id: editingRole.role_id, role_name: newRoleName },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updateRole) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.role_id === result.data.updateRole.role_id
              ? result.data.updateRole
              : role
          )
        );
        setEditingRole(null);
        setNewRoleName('');
      }
    } else {
      // Add new role
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
    }
  };

  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPermission) {
      // Update permission
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdatePermission($permission_id: ID!, $permission_name: String) {
              updatePermission(permission_id: $permission_id, permission_name: $permission_name) {
                permission_id
                permission_name
              }
            }
          `,
          variables: { permission_id: editingPermission.permission_id, permission_name: newPermissionName },
        }),
      });
      const result = await response.json();
      if (result.data && result.data.updatePermission) {
        setPermissions((prevPermissions) =>
          prevPermissions.map((permission) =>
            permission.permission_id === result.data.updatePermission.permission_id
              ? result.data.updatePermission
              : permission
          )
        );
        setEditingPermission(null);
        setNewPermissionName('');
      }
    } else {
      // Add new permission
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

  const handleEditRoleClick = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.role_name);
  };

  const handleDeleteRole = async (role_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteRole($role_id: ID!) {
            deleteRole(role_id: $role_id)
          }
        `,
        variables: { role_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteRole) {
      setRoles((prevRoles) => prevRoles.filter((role) => role.role_id !== role_id));
    }
  };

  const handleEditPermissionClick = (permission: Permission) => {
    setEditingPermission(permission);
    setNewPermissionName(permission.permission_name);
  };

  const handleDeletePermission = async (permission_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeletePermission($permission_id: ID!) {
            deletePermission(permission_id: $permission_id)
          }
        `,
        variables: { permission_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deletePermission) {
      setPermissions((prevPermissions) =>
        prevPermissions.filter((permission) => permission.permission_id !== permission_id)
      );
    }
  };

  const handleDeleteRolePermission = async (role_id: string, permission_id: string) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation DeleteRolePermission($role_id: ID!, $permission_id: ID!) {
            deleteRolePermission(role_id: $role_id, permission_id: $permission_id)
          }
        `,
        variables: { role_id, permission_id },
      }),
    });
    const result = await response.json();
    if (result.data && result.data.deleteRolePermission) {
      alert('Role permission deleted successfully!');
      // Re-fetch roles and permissions to update the display if needed
      fetchRoles();
      fetchPermissions();
    } else {
      alert('Failed to delete role permission.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customization - Roles & Permissions</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingRole ? 'Edit Role' : 'Add New Role'}</h2>
        <form onSubmit={handleRoleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
            className="p-2 border rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editingRole ? 'Update Role' : 'Add Role'}
          </button>
          {editingRole && (
            <button
              type="button"
              onClick={() => {
                setEditingRole(null);
                setNewRoleName('');
              }}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing Roles</h2>
        {roles.length === 0 ? (
          <p>No roles found.</p>
        ) : (
          <ul className="space-y-2">
            {roles.map((role) => (
              <li key={role.role_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>{role.role_name}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRoleClick(role)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.role_id)}
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{editingPermission ? 'Edit Permission' : 'Add New Permission'}</h2>
        <form onSubmit={handlePermissionSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Permission Name"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            required
            className="p-2 border rounded flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editingPermission ? 'Update Permission' : 'Add Permission'}
          </button>
          {editingPermission && (
            <button
              type="button"
              onClick={() => {
                setEditingPermission(null);
                setNewPermissionName('');
              }}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Existing Permissions</h2>
        {permissions.length === 0 ? (
          <p>No permissions found.</p>
        ) : (
          <ul className="space-y-2">
            {permissions.map((permission) => (
              <li key={permission.permission_id} className="p-3 border rounded shadow-sm flex justify-between items-center">
                <div>{permission.permission_name}</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPermissionClick(permission)}
                    className="bg-yellow-500 text-white p-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePermission(permission.permission_id)}
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

      {/* Add section for deleting role permissions if needed */}
    </div>
  );
}