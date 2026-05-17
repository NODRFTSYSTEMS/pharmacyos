import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, MagnifyingGlass, X, PencilSimple,
  Buildings, Phone, Envelope, MapPin, NotePencil,
} from '@phosphor-icons/react'
import { supabase } from '../../lib/supabase'
import { PageHeader, Pill as StatusPill } from '../../components/Shell'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  payment_terms: string | null
  notes: string | null
  active: boolean
  created_at: string
  updated_at: string
}

type SupplierDraft = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>

const PAYMENT_TERMS = ['COD', 'Net 7', 'Net 14', 'Net 30', 'Net 60', 'Prepaid', 'On Account']

const BLANK: SupplierDraft = {
  name: '', contact_person: '', phone: '', email: '',
  address: '', payment_terms: '', notes: '', active: true,
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  initial: SupplierDraft | null
  editingId: string | null
  onClose: () => void
}

function SupplierDrawer({ initial, editingId, onClose }: DrawerProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState<SupplierDraft>(initial ?? { ...BLANK })
  const [errors, setErrors] = useState<Partial<Record<keyof SupplierDraft, string>>>({})

  function set<K extends keyof SupplierDraft>(key: K, value: SupplierDraft[K]) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Supplier name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name:          form.name.trim(),
        contact_person: form.contact_person?.trim() || null,
        phone:         form.phone?.trim() || null,
        email:         form.email?.trim() || null,
        address:       form.address?.trim() || null,
        payment_terms: form.payment_terms || null,
        notes:         form.notes?.trim() || null,
        active:        form.active,
        updated_at:    new Date().toISOString(),
      }
      if (editingId) {
        const { error } = await supabase
          .from('retail_suppliers')
          .update(payload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('retail_suppliers')
          .insert([payload])
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['retail-suppliers'] })
      onClose()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) save.mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        className="flex-1 bg-black/40"
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editingId ? 'Edit supplier' : 'Add supplier'}
        className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-semibold text-gray-800 text-base">
            {editingId ? 'Edit Supplier' : 'Add Supplier'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost h-8 w-8 p-0" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <form id="supplier-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Name */}
          <div>
            <label htmlFor="s-name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Supplier Name *
            </label>
            <input
              id="s-name"
              type="text"
              autoFocus
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Caribbean Medical Supplies Ltd."
              className={`input ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Contact person */}
          <div>
            <label htmlFor="s-contact" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Contact Person
            </label>
            <div className="relative">
              <Buildings size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="s-contact"
                type="text"
                value={form.contact_person ?? ''}
                onChange={e => set('contact_person', e.target.value)}
                placeholder="Sales rep or account manager"
                className="input pl-7"
              />
            </div>
          </div>

          {/* Phone + Email side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="s-phone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="s-phone"
                  type="tel"
                  value={form.phone ?? ''}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="876-000-0000"
                  className="input pl-7 font-mono"
                />
              </div>
            </div>
            <div>
              <label htmlFor="s-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Envelope size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="s-email"
                  type="email"
                  value={form.email ?? ''}
                  onChange={e => set('email', e.target.value)}
                  placeholder="orders@supplier.com"
                  className={`input pl-7 ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="s-address" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Address
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-2.5 top-3 text-gray-400" />
              <textarea
                id="s-address"
                value={form.address ?? ''}
                onChange={e => set('address', e.target.value)}
                placeholder="Street, city, parish, Jamaica"
                rows={2}
                className="input pl-7 h-auto py-2 resize-none"
              />
            </div>
          </div>

          {/* Payment terms */}
          <div>
            <label htmlFor="s-terms" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Payment Terms
            </label>
            <select
              id="s-terms"
              value={form.payment_terms ?? ''}
              onChange={e => set('payment_terms', e.target.value)}
              className="input bg-white"
            >
              <option value="">Select terms…</option>
              {PAYMENT_TERMS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="s-notes" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <div className="relative">
              <NotePencil size={14} className="absolute left-2.5 top-3 text-gray-400" />
              <textarea
                id="s-notes"
                value={form.notes ?? ''}
                onChange={e => set('notes', e.target.value)}
                placeholder="Delivery schedule, special terms, account number…"
                rows={3}
                className="input pl-7 h-auto py-2 resize-none"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Active supplier</p>
              <p className="text-xs text-gray-400">Inactive suppliers are hidden from ordering workflows</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => set('active', !form.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.active ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Error from server */}
          {save.isError && (
            <div className="bg-red-50 border border-red-200 rounded px-3 py-2.5 text-sm text-red-700">
              {String((save.error as Error).message)}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="supplier-form"
            onClick={handleSubmit}
            disabled={save.isPending}
            className="btn btn-primary flex-1 gap-2"
          >
            {save.isPending
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : null
            }
            {editingId ? 'Save Changes' : 'Add Supplier'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RetailSuppliers() {
  const [search, setSearch]         = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing]       = useState<Supplier | null>(null)

  const { data: suppliers, isLoading, isError } = useQuery({
    queryKey: ['retail-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('retail_suppliers')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return (data ?? []) as Supplier[]
    },
  })

  const filtered = (suppliers ?? []).filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      (s.contact_person ?? '').toLowerCase().includes(q) ||
      (s.phone ?? '').includes(q) ||
      (s.email ?? '').toLowerCase().includes(q)
    )
  })

  function openAdd() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(s: Supplier) {
    setEditing(s)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditing(null)
  }

  const activeCount   = (suppliers ?? []).filter(s => s.active).length
  const inactiveCount = (suppliers ?? []).filter(s => !s.active).length

  return (
    <div>
      <PageHeader
        title="Retail Suppliers"
        subtitle="Manage vendors and purchasing contacts for OTC and retail inventory"
        breadcrumb={['Retail POS', 'Suppliers']}
        cta={
          <button onClick={openAdd} className="btn btn-primary gap-2">
            <Plus size={14} weight="bold" />
            Add Supplier
          </button>
        }
      />

      {/* Summary strip */}
      <div className="flex items-center gap-6 mb-5 text-sm text-gray-500">
        <span><strong className="text-gray-800">{(suppliers ?? []).length}</strong> total</span>
        <span className="text-emerald-600"><strong>{activeCount}</strong> active</span>
        {inactiveCount > 0 && (
          <span className="text-gray-400"><strong>{inactiveCount}</strong> inactive</span>
        )}
      </div>

      {/* Search */}
      <div className="card p-3 mb-4 flex items-center gap-3 max-w-sm">
        <MagnifyingGlass size={14} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search name, contact, phone, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input border-0 p-0 focus:ring-0 shadow-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Error */}
      {isError && (
        <div className="card p-4 text-sm text-red-600 bg-red-50 mb-4">
          Failed to load suppliers. Check your connection.
        </div>
      )}

      {/* Table */}
      {!isError && (
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading suppliers…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Buildings size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                {search ? 'No suppliers match your search' : 'No suppliers added yet'}
              </p>
              {!search && (
                <button onClick={openAdd} className="btn btn-primary gap-2 mt-4">
                  <Plus size={14} weight="bold" />
                  Add your first supplier
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-compact text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Terms</th>
                    <th className="text-left px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4">
                        <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                        {s.address && (
                          <p className="text-xs text-gray-400 truncate max-w-52">{s.address}</p>
                        )}
                      </td>
                      <td className="px-4 text-xs text-gray-600">
                        {s.contact_person ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 font-mono text-xs text-gray-600">
                        {s.phone
                          ? <a href={`tel:${s.phone}`} className="hover:text-blue-600">{s.phone}</a>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 text-xs text-gray-600 max-w-44 truncate">
                        {s.email
                          ? <a href={`mailto:${s.email}`} className="hover:text-blue-600">{s.email}</a>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 text-xs text-gray-600">
                        {s.payment_terms ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4">
                        <StatusPill
                          label={s.active ? 'Active' : 'Inactive'}
                          variant={s.active ? 'green' : 'gray'}
                        />
                      </td>
                      <td className="px-4 text-right">
                        <button
                          onClick={() => openEdit(s)}
                          className="btn btn-ghost h-7 w-7 p-0"
                          aria-label={`Edit ${s.name}`}
                          title="Edit"
                        >
                          <PencilSimple size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit drawer */}
      {drawerOpen && (
        <SupplierDrawer
          initial={editing ? {
            name:           editing.name,
            contact_person: editing.contact_person,
            phone:          editing.phone,
            email:          editing.email,
            address:        editing.address,
            payment_terms:  editing.payment_terms,
            notes:          editing.notes,
            active:         editing.active,
          } : null}
          editingId={editing?.id ?? null}
          onClose={closeDrawer}
        />
      )}
    </div>
  )
}
