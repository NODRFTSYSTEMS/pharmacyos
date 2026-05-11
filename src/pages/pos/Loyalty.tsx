import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  MagnifyingGlass,
  X,
  PencilSimple,
  Star,
  Users,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { PageHeader, MetricCard, Pill as StatusPill } from '../../components/Shell';

interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  points_balance: number;
  tier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  is_active: boolean;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

type Tier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface DrawerFormState {
  name: string;
  phone: string;
  email: string;
  tier: Tier;
  notes: string;
  is_active: boolean;
}

interface DrawerErrors {
  name?: string;
}

const TIER_TABS: Array<'ALL' | Tier> = ['ALL', 'STANDARD', 'SILVER', 'GOLD', 'PLATINUM'];

const TIER_PILL_VARIANT: Record<Tier, 'gray' | 'blue' | 'yellow' | 'purple'> = {
  STANDARD: 'gray',
  SILVER: 'blue',
  GOLD: 'yellow',
  PLATINUM: 'purple',
};

const EMPTY_FORM: DrawerFormState = {
  name: '',
  phone: '',
  email: '',
  tier: 'STANDARD',
  notes: '',
  is_active: true,
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-JM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface LoyaltyDrawerProps {
  open: boolean;
  editTarget: LoyaltyCustomer | null;
  onClose: () => void;
}

function LoyaltyDrawer({ open, editTarget, onClose }: LoyaltyDrawerProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DrawerFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<DrawerErrors>({});

  React.useEffect(() => {
    if (open) {
      if (editTarget) {
        setForm({
          name: editTarget.name,
          phone: editTarget.phone ?? '',
          email: editTarget.email ?? '',
          tier: editTarget.tier,
          notes: '',
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
        name: data.name.trim(),
        phone: data.phone.trim() || null,
        email: data.email.trim() || null,
        tier: data.tier,
        is_active: data.is_active,
      };
      if (editTarget) {
        const { error } = await supabase
          .from('loyalty_customers')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('loyalty_customers')
          .insert({ ...payload, points_balance: 0, joined_date: new Date().toISOString() });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty_customers'] });
      onClose();
    },
  });

  function validate(): boolean {
    const errs: DrawerErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    mutation.mutate(form);
  }

  function handleField<K extends keyof DrawerFormState>(key: K, value: DrawerFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'name' && errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-30"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={editTarget ? 'Edit loyalty customer' : 'Add loyalty customer'}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editTarget ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button
            className="btn btn-ghost p-2"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="lc-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="lc-name"
              type="text"
              className={`input w-full${errors.name ? ' border-red-500 focus:ring-red-500' : ''}`}
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('name', e.target.value)}
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="lc-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="lc-phone"
              type="tel"
              className="input w-full"
              value={form.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('phone', e.target.value)}
              autoComplete="tel"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="lc-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="lc-email"
              type="email"
              className="input w-full"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('email', e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Tier */}
          <div>
            <label htmlFor="lc-tier" className="block text-sm font-medium text-gray-700 mb-1">
              Tier
            </label>
            <select
              id="lc-tier"
              className="input w-full"
              value={form.tier}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('tier', e.target.value as Tier)}
            >
              <option value="STANDARD">Standard</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="PLATINUM">Platinum</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="lc-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="lc-notes"
              rows={2}
              className="input w-full resize-none"
              value={form.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleField('notes', e.target.value)}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.is_active}
              id="lc-active"
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
            <label htmlFor="lc-active" className="text-sm font-medium text-gray-700 cursor-pointer">
              Active
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button className="btn btn-ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
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

export function Loyalty() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LoyaltyCustomer | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | Tier>('ALL');
  const [search, setSearch] = useState('');

  const { data: customers = [], isLoading } = useQuery<LoyaltyCustomer[]>({
    queryKey: ['loyalty_customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_customers')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as LoyaltyCustomer[];
    },
  });

  const totalMembers = customers.length;
  const activeMembers = customers.filter((c) => c.is_active).length;
  const eliteCount = customers.filter((c) => c.tier === 'GOLD' || c.tier === 'PLATINUM').length;
  const totalPoints = customers.reduce((sum, c) => sum + c.points_balance, 0);

  const filtered = customers.filter((c) => {
    if (tierFilter !== 'ALL' && c.tier !== tierFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  function openAdd() {
    setEditTarget(null);
    setDrawerOpen(true);
  }

  function openEdit(customer: LoyaltyCustomer) {
    setEditTarget(customer);
    setDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Loyalty Programme"
        subtitle="Customer rewards and points tracking"
        breadcrumb={['Retail POS', 'Loyalty']}
        actions={
          <button className="btn btn-primary flex items-center gap-2" onClick={openAdd}>
            <Plus size={18} aria-hidden="true" />
            Add Customer
          </button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Members"
          value={totalMembers.toLocaleString()}
          icon={<Users size={22} aria-hidden="true" />}
        />
        <MetricCard
          label="Active Members"
          value={activeMembers.toLocaleString()}
          icon={<Users size={22} aria-hidden="true" />}
        />
        <MetricCard
          label="Gold / Platinum"
          value={eliteCount.toLocaleString()}
          icon={<Star size={22} aria-hidden="true" />}
        />
        <MetricCard
          label="Total Points Issued"
          value={totalPoints.toLocaleString()}
          icon={<Star size={22} aria-hidden="true" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Tier tabs */}
        <div
          role="tablist"
          aria-label="Filter by tier"
          className="flex gap-1 flex-wrap"
        >
          {TIER_TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tierFilter === t}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                tierFilter === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTierFilter(t)}
            >
              {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            className="input w-full pl-9 pr-9"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            aria-label="Search customers"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-gray-500 text-sm">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact w-full" aria-label="Loyalty customers">
              <thead>
                <tr>
                  <th scope="col" className="text-left">Name</th>
                  <th scope="col" className="text-left">Phone</th>
                  <th scope="col" className="text-left">Email</th>
                  <th scope="col" className="text-left">Tier</th>
                  <th scope="col" className="text-right">Points</th>
                  <th scope="col" className="text-left">Joined</th>
                  <th scope="col" className="text-left">Status</th>
                  <th scope="col" className="text-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-gray-900">{c.name}</td>
                    <td className="text-gray-600">{c.phone ?? '—'}</td>
                    <td className="text-gray-600">{c.email ?? '—'}</td>
                    <td>
                      <StatusPill variant={TIER_PILL_VARIANT[c.tier]}>
                        {c.tier.charAt(0) + c.tier.slice(1).toLowerCase()}
                      </StatusPill>
                    </td>
                    <td className="text-right">
                      <span className="num">{c.points_balance.toLocaleString()}</span>
                    </td>
                    <td className="text-gray-600">{fmtDate(c.joined_date)}</td>
                    <td>
                      <StatusPill variant={c.is_active ? 'green' : 'gray'}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </StatusPill>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-ghost p-1.5"
                        onClick={() => openEdit(c)}
                        aria-label={`Edit ${c.name}`}
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

      <LoyaltyDrawer
        open={drawerOpen}
        editTarget={editTarget}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
