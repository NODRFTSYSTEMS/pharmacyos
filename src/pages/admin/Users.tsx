import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  PencilSimple,
  Users,
  Shield,
  X,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell';

interface StaffProfile {
  id: string;
  email: string;
  full_name: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type StaffRole = 'PHARMACIST' | 'CASHIER' | 'TECHNICIAN' | 'MANAGER' | 'ADMIN';

interface DrawerFormState {
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
}

interface DrawerErrors {
  full_name?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_PILL_VARIANT: Record<StaffRole, 'green' | 'blue' | 'purple' | 'yellow' | 'red'> = {
  PHARMACIST: 'green',
  CASHIER: 'blue',
  TECHNICIAN: 'purple',
  MANAGER: 'yellow',
  ADMIN: 'red',
};

const EMPTY_FORM: DrawerFormState = {
  full_name: '',
  email: '',
  role: 'CASHIER',
  is_active: true,
};

interface UserDrawerProps {
  open: boolean;
  editTarget: StaffProfile | null;
  onClose: () => void;
}

function UserDrawer({ open, editTarget, onClose }: UserDrawerProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DrawerFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<DrawerErrors>({});

  React.useEffect(() => {
    if (open) {
      if (editTarget) {
        setForm({
          full_name: editTarget.full_name,
          email: editTarget.email,
          role: editTarget.role,
          is_active: editTarget.is_active,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, editTarget]);

  const mutation = useMutation({
    mutationFn: async (data: DrawerFormState) => {
      const payload = {
        full_name: data.full_name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        is_active: data.is_active,
      };
      if (editTarget) {
        const { error } = await supabase
          .from('staff_profiles')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('staff_profiles').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_profiles'] });
      onClose();
    },
  });

  function validate(): boolean {
    const errs: DrawerErrors = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    mutation.mutate(form);
  }

  function handleField<K extends keyof DrawerFormState>(key: K, value: DrawerFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'full_name' && errors.full_name) setErrors((p) => ({ ...p, full_name: undefined }));
    if (key === 'email' && errors.email) setErrors((p) => ({ ...p, email: undefined }));
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-30"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={editTarget ? 'Edit staff member' : 'Add staff member'}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTarget ? 'Edit Staff Member' : 'Add Staff Member'}
          </h2>
          <button className="btn btn-ghost p-2" onClick={onClose} aria-label="Close drawer">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="u-name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="u-name"
              type="text"
              className={`input w-full${errors.full_name ? ' border-red-500 focus:ring-red-500' : ''}`}
              value={form.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('full_name', e.target.value)}
              autoComplete="name"
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600" role="alert">{errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="u-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="u-email"
              type="email"
              className={`input w-full${errors.email ? ' border-red-500 focus:ring-red-500' : ''}`}
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('email', e.target.value)}
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="u-role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="u-role"
              className="input w-full"
              value={form.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('role', e.target.value as StaffRole)}
            >
              <option value="PHARMACIST">Pharmacist</option>
              <option value="CASHIER">Cashier</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.is_active}
              id="u-active"
              onClick={() => handleField('is_active', !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                form.is_active ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
                aria-hidden="true"
              />
            </button>
            <label htmlFor="u-active" className="text-sm font-medium text-gray-700 cursor-pointer">
              Active
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>

        {mutation.isError && (
          <p className="px-6 pb-3 text-xs text-red-600" role="alert">
            Failed to save. Please try again.
          </p>
        )}
      </aside>
    </>
  );
}

export function UsersAdmin() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffProfile | null>(null);

  const { data: staff = [], isLoading } = useQuery<StaffProfile[]>({
    queryKey: ['staff_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('*')
        .order('full_name', { ascending: true });
      if (error) throw error;
      return data as StaffProfile[];
    },
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.is_active).length;
  const pharmacistCount = staff.filter((s) => s.role === 'PHARMACIST').length;
  const managerCount = staff.filter((s) => s.role === 'MANAGER').length;

  function openAdd() {
    setEditTarget(null);
    setDrawerOpen(true);
  }

  function openEdit(member: StaffProfile) {
    setEditTarget(member);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Staff & Users"
        subtitle="Manage staff accounts and system access"
        breadcrumb={['Admin', 'Users']}
        cta={
          <button className="btn btn-primary flex items-center gap-2" onClick={openAdd}>
            <Plus size={18} aria-hidden="true" />
            Add Staff
          </button>
        }
      />

      {/* Info banner */}
      <div
        className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
        role="note"
        aria-label="Authentication note"
      >
        <Shield size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Access credentials are managed through Supabase Auth. This form records staff roles and
          permissions for display purposes.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Staff"
          value={totalStaff.toLocaleString()}
          icon={Users}
        />
        <MetricCard
          label="Active"
          value={activeStaff.toLocaleString()}
          icon={Users}
        />
        <MetricCard
          label="Pharmacists"
          value={pharmacistCount.toLocaleString()}
          icon={Shield}
        />
        <MetricCard
          label="Managers"
          value={managerCount.toLocaleString()}
          icon={Shield}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading…</div>
        ) : staff.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-gray-500 text-sm">No staff records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact w-full" aria-label="Staff members">
              <thead>
                <tr>
                  <th scope="col" className="text-left">Name</th>
                  <th scope="col" className="text-left">Email</th>
                  <th scope="col" className="text-left">Role</th>
                  <th scope="col" className="text-left">Status</th>
                  <th scope="col" className="text-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-gray-900">{s.full_name}</td>
                    <td className="text-gray-600">{s.email}</td>
                    <td>
                      <StatusPill
                        label={s.role.charAt(0) + s.role.slice(1).toLowerCase()}
                        variant={ROLE_PILL_VARIANT[s.role]}
                      />
                    </td>
                    <td>
                      <StatusPill
                        label={s.is_active ? 'Active' : 'Inactive'}
                        variant={s.is_active ? 'green' : 'gray'}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-ghost p-1.5"
                        onClick={() => openEdit(s)}
                        aria-label={`Edit ${s.full_name}`}
                      >
                        <PencilSimple size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserDrawer
        open={drawerOpen}
        editTarget={editTarget}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
