import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClockCounterClockwise,
  MagnifyingGlass,
  ArrowClockwise,
  LockSimple,
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

function truncateDetails(details: unknown): string {
  if (details === null || details === undefined) return '—';
  const raw = JSON.stringify(details);
  return raw.length > 80 ? raw.slice(0, 80) + '…' : raw;
}

export function AuditLog() {
  const defaults = defaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaults.from);
  const [dateTo, setDateTo] = useState(defaults.to);
  const [actionFilter, setActionFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

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
        <p>Audit entries are system-generated. Manual editing is not permitted.</p>
      </div>

      {/* Controls */}
      <div className="card flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between flex-wrap">
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
                className="input pl-9 w-56"
                placeholder="Filter by action…"
                value={actionFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActionFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Refresh */}
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
              <thead>
                <tr>
                  <th scope="col" className="text-left whitespace-nowrap">Timestamp</th>
                  <th scope="col" className="text-left">Actor</th>
                  <th scope="col" className="text-left">Action</th>
                  <th scope="col" className="text-left">Table</th>
                  <th scope="col" className="text-left">Record ID</th>
                  <th scope="col" className="text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap text-gray-600 text-xs">
                      {fmtDateTime(entry.created_at)}
                    </td>
                    <td className="text-gray-700">
                      {entry.actor_name ?? entry.actor_id ?? '—'}
                    </td>
                    <td className="font-medium text-gray-900">{entry.action}</td>
                    <td className="text-gray-600">{entry.table_name ?? '—'}</td>
                    <td className="text-gray-600 font-mono text-xs">
                      {entry.record_id ? entry.record_id.slice(0, 8) + '…' : '—'}
                    </td>
                    <td
                      className="text-gray-500 text-xs max-w-xs truncate"
                      title={entry.details ? JSON.stringify(entry.details) : undefined}
                    >
                      {truncateDetails(entry.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 500 && (
              <p className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                Showing the 500 most recent entries matching this filter. Narrow the date range to see earlier records.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
