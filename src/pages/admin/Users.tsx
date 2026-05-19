import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  PencilSimple,
  Users,
  Shield,
  X,
  FloppyDisk,
  CheckCircle,
  Envelope,
  Trash,
  Warning,
} from '@phosphor-icons/react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { supabase } from '../../lib/supabase';
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell';
import { StaffAvatar } from '../../components/StaffAvatar';
import { getDemoStaffPortrait } from '../../data/demoStaffPortraits';
import { AUDIT_ACTIONS } from '../../constants/audit-actions';
import type { StaffAvatarSourceStatus, StaffProfile, StaffRole } from '../../types/database';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DrawerFormState {
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  avatar_url: string;
  avatar_alt: string;
  avatar_source_status: StaffAvatarSourceStatus;
}

interface DrawerErrors {
  full_name?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_PILL_VARIANT: Record<StaffRole, 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray'> = {
  PHARMACIST: 'green',
  CASHIER:    'blue',
  TECHNICIAN: 'purple',
  MANAGER:    'yellow',
  ADMIN:      'red',
  AUDITOR:    'gray',
};

const AVATAR_STATUS_PILL: Record<StaffAvatarSourceStatus, 'green' | 'yellow' | 'gray'> = {
  VERIFIED: 'green',
  DEMO_ONLY: 'yellow',
  NEEDS_REPLACEMENT: 'gray',
};

const AVATAR_STATUS_LABEL: Record<StaffAvatarSourceStatus, string> = {
  VERIFIED: 'Verified',
  DEMO_ONLY: 'Demo only',
  NEEDS_REPLACEMENT: 'Needs replacement',
};

const EMPTY_FORM: DrawerFormState = {
  full_name: '',
  email: '',
  role: 'CASHIER',
  is_active: true,
  avatar_url: '',
  avatar_alt: '',
  avatar_source_status: 'NEEDS_REPLACEMENT',
};

// ── Permissions definitions ───────────────────────────────────────────────────

const PERMISSIONS = [
  { key: 'pos_terminal',    label: 'POS Terminal'           },
  { key: 'pos_void',        label: 'Void Transactions'      },
  { key: 'pos_closeout',    label: 'Submit EOD Closeout'    },
  { key: 'eod_approve',     label: 'Approve EOD'            },
  { key: 'rx_dispense',     label: 'Dispense Prescriptions' },
  { key: 'rx_schedule_log', label: 'Schedule Drug Log'      },
  { key: 'inventory_manage',label: 'Manage Inventory'       },
  { key: 'reports_view',    label: 'View Reports'           },
  { key: 'staff_manage',    label: 'Manage Staff'           },
  { key: 'audit_view',      label: 'View Audit Log'         },
  { key: 'settings_manage', label: 'Manage Settings'        },
  { key: 'loyalty_manage',  label: 'Manage Loyalty'         },
  { key: 'ai_queue',        label: 'Document Review'        },
  { key: 'timecard_manage', label: 'Manage Timecards'       },
] as const;

const ROLES_LIST: StaffRole[] = ['ADMIN', 'MANAGER', 'PHARMACIST', 'CASHIER', 'TECHNICIAN', 'AUDITOR'];

type RolePermsRecord = Record<string, string[]>;

const DEFAULT_PERMS: RolePermsRecord = {
  ADMIN:      PERMISSIONS.map(p => p.key) as string[],
  MANAGER:    ['pos_terminal','pos_void','pos_closeout','eod_approve','inventory_manage',
               'reports_view','loyalty_manage','audit_view','settings_manage','timecard_manage'],
  PHARMACIST: ['rx_dispense','rx_schedule_log','inventory_manage','reports_view','ai_queue'],
  CASHIER:    ['pos_terminal','loyalty_manage'],
  TECHNICIAN: ['pos_terminal','rx_dispense','inventory_manage','ai_queue'],
  AUDITOR:    ['audit_view','reports_view'],
};

function getAvatarStatus(member: StaffProfile): StaffAvatarSourceStatus {
  const demoPortrait = getDemoStaffPortrait(member.email);
  if (member.avatar_url || demoPortrait) {
    return member.avatar_source_status ?? demoPortrait?.sourceStatus ?? 'NEEDS_REPLACEMENT';
  }
  return 'NEEDS_REPLACEMENT';
}

function makeMatrix(record: RolePermsRecord): Record<string, Set<string>> {
  return Object.fromEntries(
    ROLES_LIST.map(r => [r, new Set<string>(record[r] ?? DEFAULT_PERMS[r] ?? [])])
  );
}

// ── Add / Edit Staff Drawer ───────────────────────────────────────────────────

interface UserDrawerProps {
  open: boolean;
  editTarget: StaffProfile | null;
  onClose: () => void;
}

interface SalaryRecord {
  id: string
  salary_type: string
  amount: number
  currency: string
  effective_from: string
}

function UserDrawer({ open, editTarget, onClose }: UserDrawerProps) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [form, setForm] = useState<DrawerFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<DrawerErrors>({});
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  // Salary quick-view — queries active salary record for this staff member.
  // RLS restricts to ADMIN/MANAGER only; query returns empty for other roles.
  const { data: currentSalary } = useQuery<SalaryRecord | null>({
    queryKey: ['staff-salary-quickview', editTarget?.id],
    queryFn: async () => {
      if (!editTarget?.id) return null
      const { data } = await supabase
        .from('staff_salaries')
        .select('id, salary_type, amount, currency, effective_from')
        .eq('staff_id', editTarget.id)
        .is('effective_to', null)
        .order('effective_from', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data ?? null
    },
    enabled: open && !!editTarget?.id,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (open) {
      if (editTarget) {
        const demoPortrait = getDemoStaffPortrait(editTarget.email);
        setForm({
          full_name: editTarget.full_name,
          email:     editTarget.email,
          role:      editTarget.role,
          is_active: editTarget.is_active,
          avatar_url: editTarget.avatar_url ?? demoPortrait?.url ?? '',
          avatar_alt: editTarget.avatar_alt ?? demoPortrait?.alt ?? '',
          avatar_source_status: editTarget.avatar_source_status ?? demoPortrait?.sourceStatus ?? 'NEEDS_REPLACEMENT',
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
      setResetSent(false);
      setResetError(null);
      setConfirmRemove(false);
    }
  }, [open, editTarget]);

  const mutation = useMutation({
    mutationFn: async (data: DrawerFormState) => {
      const { data: { user } } = await supabase.auth.getUser();
      const email = data.email.trim().toLowerCase();
      const fullName = data.full_name.trim();
      const demoPortrait = getDemoStaffPortrait(email);
      const explicitAvatarUrl = data.avatar_url.trim();
      const resolvedAvatarUrl = explicitAvatarUrl || demoPortrait?.url || null;
      const resolvedAvatarAlt = data.avatar_alt.trim()
        || (resolvedAvatarUrl ? demoPortrait?.alt ?? `${fullName} profile portrait` : null);
      const resolvedAvatarStatus: StaffAvatarSourceStatus = !resolvedAvatarUrl
        ? 'NEEDS_REPLACEMENT'
        : resolvedAvatarUrl === demoPortrait?.url
          ? 'DEMO_ONLY'
          : data.avatar_source_status;

      const payload = {
        full_name: fullName,
        email,
        role:      data.role,
        is_active: data.is_active,
        avatar_url: resolvedAvatarUrl,
        avatar_alt: resolvedAvatarAlt,
        avatar_source_status: resolvedAvatarStatus,
      };
      if (editTarget) {
        const { error } = await supabase
          .from('staff_profiles')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editTarget.id);
        if (error) throw error;
        const action = !data.is_active ? AUDIT_ACTIONS.STAFF_DEACTIVATE : AUDIT_ACTIONS.STAFF_UPDATE;
        const { error: auditError } = await supabase.from('audit_log').insert({
          actor_id:   user?.id ?? null,
          actor_name: user?.email ?? 'System',
          action,
          table_name: 'staff_profiles',
          record_id:  editTarget.id,
          details:    { email, role: data.role, is_active: data.is_active },
        });
        if (auditError) console.error('audit_log write failed', auditError);
      } else {
        const { error } = await supabase.from('staff_profiles').insert(payload);
        if (error) throw error;
        const { error: auditError } = await supabase.from('audit_log').insert({
          actor_id:   user?.id ?? null,
          actor_name: user?.email ?? 'System',
          action:     AUDIT_ACTIONS.STAFF_CREATE,
          table_name: 'staff_profiles',
          record_id:  email,
          details:    { email, role: data.role },
        });
        if (auditError) console.error('audit_log write failed', auditError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff_profiles'] });
      onClose();
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setResetSent(true);
      setResetError(null);
    },
    onError: (err: Error) => {
      setResetError(err.message ?? 'Failed to send reset email.');
    },
  });

  // ADMIN-only: permanently remove the staff_profiles record.
  // Note: this removes the profile record only — the Supabase auth.users entry
  // remains (requires Supabase dashboard or service-role API to delete auth user).
  const removeMutation = useMutation({
    mutationFn: async () => {
      if (!editTarget) return;
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('staff_profiles')
        .delete()
        .eq('id', editTarget.id);
      if (error) throw error;
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.STAFF_REMOVE,
        table_name: 'staff_profiles',
        record_id:  editTarget.id,
        details:    { removed_email: editTarget.email, removed_role: editTarget.role },
      });
      if (auditError) console.error('audit_log write failed', auditError);
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
      <div className="fixed inset-0 bg-black/40 z-30" aria-hidden="true" onClick={onClose} />
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
              className={`input w-full${errors.full_name ? ' border-red-500' : ''}`}
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
              className={`input w-full${errors.email ? ' border-red-500' : ''}`}
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
            <label htmlFor="u-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
              <option value="AUDITOR">Auditor</option>
            </select>
          </div>

          <div className="rounded border border-gray-200 bg-gray-50 p-3">
            <div className="mb-3 flex items-center gap-3">
              <StaffAvatar
                name={form.full_name}
                email={form.email}
                role={form.role}
                avatarUrl={form.avatar_url}
                avatarAlt={form.avatar_alt}
                size="lg"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {form.full_name.trim() || 'Staff Member'}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {AVATAR_STATUS_LABEL[form.avatar_source_status]}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="u-avatar-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile photo URL
                </label>
                <input
                  id="u-avatar-url"
                  type="text"
                  className="input w-full"
                  value={form.avatar_url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('avatar_url', e.target.value)}
                  placeholder="/demo/staff/grace-bennett.jpg"
                />
              </div>

              <div>
                <label htmlFor="u-avatar-alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo alt text
                </label>
                <input
                  id="u-avatar-alt"
                  type="text"
                  className="input w-full"
                  value={form.avatar_alt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('avatar_alt', e.target.value)}
                  placeholder="Demo portrait for staff member"
                />
              </div>

              <div>
                <label htmlFor="u-avatar-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo source status
                </label>
                <select
                  id="u-avatar-status"
                  className="input w-full"
                  value={form.avatar_source_status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('avatar_source_status', e.target.value as StaffAvatarSourceStatus)}
                >
                  <option value="DEMO_ONLY">Demo only</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="NEEDS_REPLACEMENT">Needs replacement</option>
                </select>
              </div>
            </div>
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
            <label htmlFor="u-active" className="text-sm font-medium text-gray-700 cursor-pointer">Active</label>
          </div>

          {/* Salary quick-view — edit mode only; visible to ADMIN/MANAGER (RLS-enforced) */}
          {editTarget && (
            <div className="rounded border border-gray-200 bg-gray-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Salary</p>
              {currentSalary ? (
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-800">
                      {currentSalary.currency} {Number(currentSalary.amount).toLocaleString('en-JM', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{currentSalary.salary_type.toLowerCase()}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    effective {new Date(currentSalary.effective_from).toLocaleDateString('en-JM')}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  No active salary record.{' '}
                  <a href="/hr/manager" className="text-blue-600 hover:underline">Add in HR Manager</a>
                </p>
              )}
            </div>
          )}

          {/* Password reset — edit mode only */}
          {editTarget && (
            <div className="rounded border border-gray-200 bg-gray-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Actions</p>
              <p className="text-xs text-gray-500">
                Send a password reset email to <strong>{editTarget.email}</strong>. The link expires in 1 hour.
              </p>
              {resetSent ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle size={14} aria-hidden="true" />
                  Reset email sent to {editTarget.email}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => resetMutation.mutate(editTarget.email)}
                  disabled={resetMutation.isPending}
                  className="btn btn-ghost flex items-center gap-2 text-xs border border-gray-300 hover:border-blue-400 hover:text-blue-600"
                >
                  <Envelope size={14} aria-hidden="true" />
                  {resetMutation.isPending ? 'Sending…' : 'Send Password Reset Email'}
                </button>
              )}
              {resetError && (
                <p className="text-xs text-red-600" role="alert">{resetError}</p>
              )}
            </div>
          )}

          {/* ADMIN-only: Remove Employee — only appears when editing another user */}
          {editTarget && currentUser?.role === 'ADMIN' && editTarget.id !== currentUser?.id && (
            <div className="rounded border border-red-200 bg-red-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <Warning size={13} aria-hidden="true" />
                Danger Zone
              </p>
              {!confirmRemove ? (
                <>
                  <p className="text-xs text-red-700">
                    Permanently removes this staff profile from PharmacyOS. This action cannot be undone
                    and is recorded in the audit log.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(true)}
                    className="btn btn-ghost text-xs border border-red-300 text-red-600 hover:bg-red-100 flex items-center gap-1.5"
                  >
                    <Trash size={13} aria-hidden="true" />
                    Remove Employee
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-red-800">
                    Remove <strong>{editTarget.full_name}</strong> permanently?
                    This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(false)}
                      className="btn btn-ghost text-xs"
                      disabled={removeMutation.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate()}
                      disabled={removeMutation.isPending}
                      className="btn text-xs bg-red-600 text-white hover:bg-red-700 border-red-600 flex items-center gap-1.5"
                    >
                      <Trash size={13} aria-hidden="true" />
                      {removeMutation.isPending ? 'Removing…' : 'Confirm Removal'}
                    </button>
                  </div>
                  {removeMutation.isError && (
                    <p className="text-xs text-red-600" role="alert">
                      {(removeMutation.error as Error)?.message?.includes('violates foreign key')
                        ? 'Cannot remove: this staff member has linked records (timecards, transactions, or leave). Deactivate their account instead.'
                        : ((removeMutation.error as Error)?.message ?? 'Failed to remove. Check that this staff member has no linked records.')
                      }
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>

        {mutation.isError && (
          <p className="px-6 pb-3 text-xs text-red-600" role="alert">Failed to save. Please try again.</p>
        )}
      </aside>
    </>
  );
}

// ── Role Permissions Matrix ───────────────────────────────────────────────────

function PermissionsMatrix() {
  const queryClient = useQueryClient();
  const [matrix, setMatrix] = useState<Record<string, Set<string>>>(() => makeMatrix(DEFAULT_PERMS));
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: settingsRows } = useQuery<{ key: string; value: string }[]>({
    queryKey: ['pharmacy_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pharmacy_settings').select('key, value');
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!settingsRows) return;
    const permRow = settingsRows.find(r => r.key === 'role_permissions');
    if (permRow) {
      try {
        const parsed = JSON.parse(permRow.value) as RolePermsRecord;
        setMatrix(makeMatrix(parsed));
      } catch {
        // Invalid JSON — keep defaults
      }
    }
  }, [settingsRows]);

  useEffect(() => {
    return () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current); };
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const serialized: RolePermsRecord = Object.fromEntries(
        ROLES_LIST.map(r => [r, Array.from(matrix[r] ?? [])])
      );
      const { error } = await supabase
        .from('pharmacy_settings')
        .upsert({ key: 'role_permissions', value: JSON.stringify(serialized) }, { onConflict: 'key' });
      if (error) throw error;
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.PERMISSIONS_UPDATE,
        table_name: 'pharmacy_settings',
        record_id:  'role_permissions',
        details:    { updated_by: user?.id ?? null },
      });
      if (auditError) console.error('audit_log write failed', auditError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy_settings'] });
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 3000);
    },
  });

  function toggle(role: string, perm: string) {
    if (role === 'ADMIN') return; // Admin always has full access
    setMatrix(prev => {
      const next = { ...prev, [role]: new Set(prev[role]) };
      if (next[role].has(perm)) next[role].delete(perm);
      else next[role].add(perm);
      return next;
    });
  }

  const roleLabels: Record<StaffRole, string> = {
    ADMIN:      'Admin',
    MANAGER:    'Manager',
    PHARMACIST: 'Pharmacist',
    CASHIER:    'Cashier',
    TECHNICIAN: 'Technician',
    AUDITOR:    'Auditor',
  };

  return (
    <section aria-labelledby="section-perms">
      <div className="flex items-center justify-between mb-4">
        <h2 id="section-perms" className="section-title flex items-center gap-2">
          <Shield size={18} aria-hidden="true" />
          Role Permissions
        </h2>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle size={14} aria-hidden="true" />
              Saved
            </span>
          )}
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <FloppyDisk size={16} aria-hidden="true" />
            {mutation.isPending ? 'Saving…' : 'Save Permissions'}
          </button>
        </div>
      </div>

      {mutation.isError && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          Failed to save permissions. Please try again.
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Role permissions matrix">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-56">
                  Permission
                </th>
                {ROLES_LIST.map(role => (
                  <th key={role} className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                    <span className={`pill pill-${ROLE_PILL_VARIANT[role]}`}>
                      {roleLabels[role]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PERMISSIONS.map(perm => (
                <tr key={perm.key} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5 text-sm text-gray-700 font-medium">
                    {perm.label}
                  </td>
                  {ROLES_LIST.map(role => {
                    const isAdmin = role === 'ADMIN';
                    const checked = isAdmin ? true : (matrix[role]?.has(perm.key) ?? false);
                    return (
                      <td key={role} className="text-center px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isAdmin}
                          onChange={() => toggle(role, perm.key)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer disabled:cursor-default disabled:opacity-50"
                          aria-label={`${perm.label} — ${roleLabels[role]}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Admin always has full access to all features. Changes take effect on next login.
          </p>
          <p className="text-xs text-gray-400">
            Permissions are stored in Pharmacy Settings and enforced at the application layer.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

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

  const totalStaff       = staff.length;
  const activeStaff      = staff.filter((s) => s.is_active).length;
  const pharmacistCount  = staff.filter((s) => s.role === 'PHARMACIST').length;
  const managerCount     = staff.filter((s) => s.role === 'MANAGER').length;

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
        subtitle="Manage staff accounts and role permissions"
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
          Login credentials are managed through Supabase Auth. Staff records here control display roles
          and permission assignments. Set role permissions below.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard label="Total Staff"    value={totalStaff.toLocaleString()}       icon={Users} />
        <MetricCard label="Active"         value={activeStaff.toLocaleString()}      icon={Users} />
        <MetricCard label="Pharmacists"    value={pharmacistCount.toLocaleString()}   icon={Shield} />
        <MetricCard label="Managers"       value={managerCount.toLocaleString()}      icon={Shield} />
      </div>

      {/* Staff table */}
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
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
                  <th scope="col" className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((s) => {
                  const avatarStatus = getAvatarStatus(s);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900 text-sm">
                        <div className="flex items-center gap-3">
                          <StaffAvatar
                            name={s.full_name}
                            email={s.email}
                            role={s.role}
                            avatarUrl={s.avatar_url}
                            avatarAlt={s.avatar_alt}
                            size="md"
                          />
                          <span>{s.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 text-gray-600 text-sm">{s.email}</td>
                      <td className="px-4">
                        <StatusPill
                          label={s.role.charAt(0) + s.role.slice(1).toLowerCase()}
                          variant={ROLE_PILL_VARIANT[s.role]}
                        />
                      </td>
                      <td className="px-4">
                        <StatusPill
                          label={s.is_active ? 'Active' : 'Inactive'}
                          variant={s.is_active ? 'green' : 'gray'}
                        />
                      </td>
                      <td className="px-4">
                        <StatusPill
                          label={AVATAR_STATUS_LABEL[avatarStatus]}
                          variant={AVATAR_STATUS_PILL[avatarStatus]}
                        />
                      </td>
                      <td className="px-4 text-right">
                        <button
                          className="btn btn-ghost p-1.5"
                          onClick={() => openEdit(s)}
                          aria-label={`Edit ${s.full_name}`}
                        >
                          <PencilSimple size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions Matrix */}
      <PermissionsMatrix />

      <UserDrawer
        open={drawerOpen}
        editTarget={editTarget}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
