'use client';

import React, { useState } from 'react';
import { useVanta } from '@/lib/vanta-context';
import { Project, Task, TaskPriority, TaskStatus } from '@/types';
import { Sliders, Plus, CheckCircle2, Clock, Calendar, Users, AlertTriangle, X } from 'lucide-react';

export default function AdminProjectsPage() {
  const { projects, tasks, profiles, addTask, updateTask, deleteTask } = useVanta();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [deadline, setDeadline] = useState('2025-04-15');
  const [assignedUserId, setAssignedUserId] = useState(profiles[2]?.id || '');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const proj = projects.find((p) => p.id === projectId);
    const user = profiles.find((p) => p.id === assignedUserId);

    addTask({
      projectId,
      projectTitle: proj?.title,
      title: taskTitle.trim(),
      description: description.trim(),
      priority,
      status: 'todo',
      deadline,
      assignedUserIds: user ? [user.id] : [],
      assignedUserNames: user ? [user.displayName] : [],
      createdBy: 'Founder',
    });

    setTaskTitle('');
    setDescription('');
    setShowTaskModal(false);
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const priorityColors = {
    urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    normal: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-1">
            Production Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-white">
            Production Pipelines & Tasks
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Dispatch urgent creator deliverables, schedule deadlines, and monitor task completion across departments.
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Deliverable Task
        </button>
      </div>

      {/* Projects Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-5 rounded-xl border border-white/10 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                {proj.clientName}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {proj.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-sm font-bold font-mono text-white">{proj.title}</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Division: {proj.departmentName} • Target Deadline: {proj.deadline}
            </p>
          </div>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800">
          <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
            Active Task Pipeline ({tasks.length})
          </h3>
        </div>

        <div className="divide-y divide-zinc-900">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors text-xs font-mono"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">{task.projectTitle}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{task.title}</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{task.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-1">
                  <span>Assigned to: <strong className="text-zinc-300">{task.assignedUserNames?.join(', ') || 'Unassigned'}</strong></span>
                  <span>Due: <strong className="text-zinc-300">{task.deadline}</strong></span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="review">Under QA Review</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-zinc-600 hover:text-red-400 text-xs p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-4 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold font-mono uppercase text-white">
                Dispatch Production Task
              </h3>
              <button onClick={() => setShowTaskModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Deliverable Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. 4K Nether Portal Lighting & Title Pass"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Parent Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Assign Specialist
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => setAssignedUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName} ({p.positionTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Task Specifications
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Requirements, reference links, resolution expectations..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Dispatch Task to Artist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
