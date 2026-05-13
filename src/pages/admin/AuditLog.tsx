import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  ArrowClockwise,
  LockSimple,
  Export,
  CaretDown,
  CaretRight,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/Shell';

interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  details: unknown;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function defaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return { from: toDateString(from), to: toDateString(to) };
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-JM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Color-coded badge for action types
interface ActionBadge { label: string; cls: string }

function getActionBadge(action: string): ActionBadge {
  const u = action.toUpperCase();
  if (u.startsWith('EOD_') || u.includes('CLOSEOUT') || u.includes('SHIFT'))
    return { label: action, cls: 'pill pill-yellow' };
  if (u.startsWith('PRESCRIPTION_') || u.startsWith('RX_') || u.startsWith('DISPENS') || u.startsWith('SCHEDULE_'))
    return { label: action, cls: 'pill pill-purple' };
  if (u.startsWith('TRANSACTION_') || u.startsWith('SALE_') || u.startsWith('PAYMENT_') || u.startsWith('POS_'))
    return { label: action, cls: 'pill pill-blue' };
  if (u.startsWith('STAFF_') || u.startsWith('USER_') || u.includes('LOGIN') || u.includes('LOGOUT') || u.startsWith('AUTH_'))
    return { label: action, cls: 'pill pill-green' };
  if (u.startsWith('SETTING_') || u.startsWith('CONFIG_') || u.startsWith('SYSTEM_'))
    return { label: action, cls: 'pill pill-gray' };
  if (u.startsWith('INVENTORY_') || u.startsWith('STOCK_') || u.startsWith('PRODUCT_'))
    return { label: action, cls: 'pill pill-blue' };
  if (u.startsWith('PATIENT_'))
    return { label: action, cls: 'pill pill-purple' };
  if (u.startsWith('LOYALTY_'))
    return { label: action, cls: 'pill pill-green' };
  return { label: action, cls: 'pill pill-gray' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AuditLog() {
  const defaults = defaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaults.from);
  const [dateTo, setDateTo] = useState(defaults.to);
  const [actionFilter, setActionFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: entries = [], isLoading, isFetching } = useQuery<AuditLogEntry[]>({
    queryKey: ['audit_log', dateFrom, dateTo, refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .gte('created_at', `${dateFrom}T00:00:00`)
        .lte('created_at', `${dateTo}T23:59:59`)
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  const filtered = entries.filter((e) => {
    if (actionFilter.trim()) {
      return e.action.toLowerCase().includes(actionFilter.trim().toLowerCase());
    }
    return true;
  });

  function exportCsv() {
    const rows = [
      ['Timestamp', 'Actor', 'Action', 'Table', 'Record ID', 'Details'],
      ...filtered.map((e) => [
        fmtDateTime(e.created_at),
        e.actor_name ?? e.actor_id ?? '—',
        e.action,
        e.table_name ?? '—',
        e.record_id ?? '—',
        e.details ? JSON.stringify(e.details) : '—',
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit Log"
        subtitle="System activity log — read only"
        breadcrumb={['Admin', 'Audit Log']}
      />

      {/* Read-only notice */}
      <div
        className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
        role="note"
        aria-label="Audit log notice"
      >
        <LockSimple size={18} className="mt-0.5 shrink-0 text-gray-500" aria-hidden="true" />
        <p>Audit entries are system-generated. Manual editing is not permitted. Click any row to expand details.</p>
      </div>

      {/* Controls */}
      <div className="card flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between flex-wrap p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date range */}
          <div>
            <label htmlFor="al-from" className="block text-xs font-medium text-gray-600 mb-1">
              From
            </label>
            <input
              id="al-from"
              type="date"
              className="input"
              value={dateFrom}
              max={dateTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="al-to" className="block text-xs font-medium text-gray-600 mb-1">
              To
            </label>
            <input
              id="al-to"
              type="date"
              className="input"
              value={dateTo}
              min={dateFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
            />
          </div>

          {/* Action filter */}
          <div>
            <label htmlFor="al-action" className="block text-xs font-medium text-gray-600 mb-1">
              Filter by action
            </label>
            <div className="relative">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="al-action"
                type="search"
                className="input pl-9 w-48"
                placeholder="Filter by action…"
                value={actionFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActionFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost flex items-center gap-2 text-xs"
            onClick={exportCsv}
            disabled={isLoading || filtered.length === 0}
            aria-label="Export audit log as CSV"
          >
            <Export size={15} aria-hidden="true" />
            Export CSV
          </button>
          <button
            className="btn btn-ghost flex items-center gap-2"
            onClick={() => setRefreshKey((k) => k + 1)}
            aria-label="Refresh audit log"
            disabled={isFetching}
          >
            <ArrowClockwise
              size={16}
              aria-hidden="true"
              className={isFetching ? 'animate-spin' : undefined}
              style={{ animationDuration: '600ms' }}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-500 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ClockCounterClockwise size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-gray-500 text-sm">No audit entries for this period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-compact w-full" aria-label="Audit log entries">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="w-5 px-3" />
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Table</th>
                  <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Record ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((entry) => {
                  const badge = getActionBadge(entry.action);
                  const isExpanded = expandedId === entry.id;
                  const hasDetails = entry.details !== null && entry.details !== undefined;

                  return (
                    <React.Fragment key={entry.id}>
                      <tr
                        className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleExpand(entry.id)}
                        aria-expanded={isExpanded}
                      >
                        <td className="px-3 text-gray-400">
                          {isExpanded
                            ? <CaretDown size={12} aria-hidden="true" />
                            : <CaretRight size={12} aria-hidden="true" />
                          }
                        </td>
                        <td className="px-4 whitespace-nowrap text-gray-600 text-xs font-mono">
                          {fmtDateTime(entry.created_at)}
                        </td>
                        <td className="px-4 text-gray-700 text-xs">
                          {entry.actor_name ?? entry.actor_id ?? '—'}
                        </td>
                        <td className="px-4">
                          <span className={badge.cls} style={{ fontSize: '10px' }}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 text-gray-600 text-xs">{entry.table_name ?? '—'}</td>
                        <td className="px-4 text-gray-500 font-mono text-xs">
                          {entry.record_id ? entry.record_id.slice(0, 8) + '…' : '—'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-blue-50 border-b border-blue-100">
                          <td />
                          <td colSpan={5} className="px-4 py-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Details
                            </p>
                            {hasDetails ? (
                              <pre className="text-xs text-gray-700 bg-white border border-gray-200 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
                                {JSON.stringify(entry.details, null, 2)}
                              </pre>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No details recorded for this event.</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2 font-mono">
                              ID: {entry.id}
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 500 && (
              <p className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                Showing the 500 most recent entries matching this filter. Narrow the date range to see earlier records.
              </p>
            )}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'}
              {actionFilter ? ` matching "${actionFilter}"` : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
