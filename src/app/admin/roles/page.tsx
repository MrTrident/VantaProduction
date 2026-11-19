'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Role, PermissionScope } from '@/types';
import { KeyRound, Plus, Shield, CheckCircle2, Lock, X, Edit3, Trash2 } from 'lucide-react';

export default function AdminRolesPage() {
  const { roles, permissions, departments, addRole, updateRole, deleteRole } = useVanta();

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState<PermissionScope>('department');
  const [departmentId, setDepartmentId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Group permissions by category
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  const handleOpenCreate = () => {
    setEditingRole(null);
    setName('');
    setSlug('');
    setDescription('');
    setScope('department');
    setDepartmentId('');
    setSelectedPermissions([]);
    setShowModal(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setSlug(role.slug);
    setDescription(role.description);
    setScope(role.scope);
    setDepartmentId(role.departmentId || '');
    setSelectedPermissions(role.permissionIds);
    setShowModal(true);
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingRole) {
      updateRole(editingRole.id, {
        name: name.trim(),
        description: description.trim(),
        scope,
        departmentId: departmentId || undefined,
        permissionIds: selectedPermissions,
      });
    } else {
      addRole({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
        isSystem: false,
        scope,
        departmentId: departmentId || undefined,
        permissionIds: selectedPermissions,
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
            Access Control System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Custom Role & Permission Builder
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Define customized roles with granular permission scopes (Global, Department, Team, Assigned, or Own).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-300">
                  Scope: {role.scope}
                </span>

                <div className="flex items-center gap-1.5">
                  {role.isSystem ? (
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> System
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenEdit(role)}
                        className="p-1 text-zinc-400 hover:text-white"
                        title="Edit Role"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="p-1 text-zinc-600 hover:text-red-400"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold font-mono uppercase text-white">{role.name}</h3>
              <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {role.description}
              </p>
            </div>

            <div className="border-t border-zinc-900 pt-4 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Granted Privileges:</span>
              <span className="text-white font-bold">{role.permissionIds.length} Permissions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Role Builder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold font-mono uppercase text-white">
                {editingRole ? `Edit Role: ${editingRole.name}` : 'Role & Permission Builder'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Configure permission scopes and toggle granular platform abilities.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior Thumbnail Curator"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Permission Scope *
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="global">Global (Platform-Wide)</option>
                    <option value="department">Department-Scoped</option>
                    <option value="team">Team-Scoped</option>
                    <option value="assigned">Assigned Tasks Only</option>
                    <option value="own">Own Account Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Role Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Operational purpose and scope of this role..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {/* Granular Permission Toggles Grouped by Category */}
              <div className="space-y-6 border-t border-zinc-900 pt-6">
                <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
                  Granular Permission Assignment ({selectedPermissions.length} selected)
                </h4>

                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
                  {categories.map((cat) => {
                    const perms = permissions.filter((p) => p.category === cat);
                    return (
                      <div key={cat} className="space-y-2">
                        <h5 className="text-[11px] font-mono uppercase font-bold text-amber-400">
                          {cat}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perms.map((p) => {
                            const isChecked = selectedPermissions.includes(p.id);
                            return (
                              <div
                                key={p.id}
                                onClick={() => togglePermission(p.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                                  isChecked
                                    ? 'border-white bg-white/10 text-white'
                                    : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 rounded bg-zinc-800 border-zinc-700 text-white"
                                />
                                <div>
                                  <p className="text-xs font-bold font-mono text-white">{p.name}</p>
                                  <p className="text-[10px] text-zinc-400 leading-tight">{p.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                {editingRole ? 'Update Role Configuration' : 'Save & Register Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
