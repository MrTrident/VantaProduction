'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Department } from '@/types';
import { Layers, Plus, Edit2, Trash2, Users, Shield, CheckCircle2, X } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const { departments, profiles, addDepartment, updateDepartment, deleteDepartment } = useVanta();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [headId, setHeadId] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const head = profiles.find((p) => p.id === headId);

    addDepartment({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      headId: headId || undefined,
      headName: head ? head.displayName : undefined,
      isActive: true,
      displayOrder: departments.length + 1,
    });

    setName('');
    setSlug('');
    setDescription('');
    setHeadId('');
    setShowAddModal(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    const head = profiles.find((p) => p.id === headId);

    updateDepartment(editingDept.id, {
      name,
      description,
      headId: headId || undefined,
      headName: head ? head.displayName : undefined,
    });

    setEditingDept(null);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description);
    setHeadId(dept.headId || '');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-purple-400 font-bold block mb-1">
            Divisional Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Department Management
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Configure isolated creative divisions, assign department heads, and isolate talent scopes.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setSlug('');
            setDescription('');
            setHeadId('');
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const membersInDept = profiles.filter((p) => p.departmentId === dept.id);
          return (
            <div
              key={dept.id}
              className="p-6 rounded-2xl border border-white/10 bg-zinc-950 flex flex-col justify-between hover:border-white/30 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-purple-300">
                    /{dept.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(dept)}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="Edit Department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {dept.slug !== 'executive' && (
                      <button
                        onClick={() => {
                          if (confirm(`Archive department ${dept.name}?`)) {
                            deleteDepartment(dept.id);
                          }
                        }}
                        className="p-1 text-zinc-600 hover:text-red-400"
                        title="Delete Department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold font-mono uppercase text-white">{dept.name}</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed min-h-[48px]">
                  {dept.description || 'Dedicated production division within the Vanta Production network.'}
                </p>
              </div>

              <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Department Head:</span>
                  <span className="text-white font-bold">{dept.headName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Assigned Talent:</span>
                  <span className="text-zinc-200">{membersInDept.length} Personnel</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingDept) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingDept(null);
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-mono uppercase text-white">
              {editingDept ? 'Edit Department' : 'Create Department'}
            </h3>

            <form onSubmit={editingDept ? handleUpdate : handleCreate} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 3D Environments & Worldbuilding"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Appoint Department Head
                </label>
                <select
                  value={headId}
                  onChange={(e) => setHeadId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                >
                  <option value="">Select Department Head...</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName} (@{p.username}) - {p.positionTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities, toolstack and workflow scope..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                {editingDept ? 'Save Changes' : 'Register Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
