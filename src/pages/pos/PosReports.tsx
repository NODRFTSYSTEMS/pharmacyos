import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Export,
  CurrencyDollar,
  Receipt,
  Calculator,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { toJamaicaBounds, toJamaicaDate, todayJamaica } from '../../lib/date';
import { PageHeader, MetricCard } from '../../components/Shell';
import { ReportAssistant } from '../../components/ReportAssistant';

interface RetailTransaction {
  id: string;
  payment_method: 'CASH' | 'CARD' | 'LYNK';
  total: number;
  created_at: string;
}

interface PaymentMethodRow {
  method: string;
  count: number;
  total: number;
  pct: number;
}

interface DailySalesRow {
  date: string;
  cash: number;
  card: number;
  lynk: number;
  txCount: number;
  total: number;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-JM', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function fmtJMD(value: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
  }).format(value);
}

function defaultDateRange(): { from: string; to: string } {
  // I-22: Use Jamaica timezone for default date range
  const to = todayJamaica()
  const fromDate = new Date(to)
  fromDate.setDate(fromDate.getDate() - 6)
  return { from: fromDate.toISOString().slice(0, 10), to }
}

function exportCsv(rows: DailySalesRow[]) {
  const header = ['Date', 'Cash', 'Card', 'Lynk', 'Transactions', 'Total'];
  const body = rows.map((r) =>
    [r.date, r.cash.toFixed(2), r.card.toFixed(2), r.lynk.toFixed(2), r.txCount, r.total.toFixed(2)].join(',')
  );
  const csv = [header.join(','), ...body].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pos-daily-sales.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function PosReports() {
  const defaults = defaultDateRange();
  const [dateFrom, setDateFrom] = useState(defaults.from);
  const [dateTo, setDateTo] = useState(defaults.to);

  const { data: transactions = [], isLoading } = useQuery<RetailTransaction[]>({
    queryKey: ['pos_reports', dateFrom, dateTo],
    queryFn: async () => {
      const bounds = toJamaicaBounds(dateFrom, dateTo)
      const { data, error } = await supabase
        .from('retail_transactions')
        .select('id, payment_method, total, created_at')
        .gte('created_at', bounds.gte)
        .lte('created_at', bounds.lte)
        .eq('voided', false)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as RetailTransaction[];
    },
  });

  const totalRevenue = useMemo(() => transactions.reduce((s, t) => s + t.total, 0), [transactions]);
  const cashTotal = useMemo(() => transactions.filter((t) => t.payment_method === 'CASH').reduce((s, t) => s + t.total, 0), [transactions]);
  const cardTotal = useMemo(() => transactions.filter((t) => t.payment_method === 'CARD').reduce((s, t) => s + t.total, 0), [transactions]);
  const lynkTotal = useMemo(() => transactions.filter((t) => t.payment_method === 'LYNK').reduce((s, t) => s + t.total, 0), [transactions]);

  const paymentBreakdown = useMemo<PaymentMethodRow[]>(() => {
    const methods: Array<RetailTransaction['payment_method']> = ['CASH', 'CARD', 'LYNK'];
    return methods.map((m) => {
      const filtered = transactions.filter((t) => t.payment_method === m);
      const total = filtered.reduce((s, t) => s + t.total, 0);
      return {
        method: m,
        count: filtered.length,
        total,
        pct: totalRevenue > 0 ? (total / totalRevenue) * 100 : 0,
      };
    });
  }, [transactions, totalRevenue]);

  const dailySales = useMemo<DailySalesRow[]>(() => {
    const map = new Map<string, DailySalesRow>();
    for (const t of transactions) {
      const d = toJamaicaDate(t.created_at);
      const existing = map.get(d) ?? { date: d, cash: 0, card: 0, lynk: 0, txCount: 0, total: 0 };
      if (t.payment_method === 'CASH') existing.cash += t.total;
      if (t.payment_method === 'CARD') existing.card += t.total;
      if (t.payment_method === 'LYNK') existing.lynk += t.total;
      existing.txCount += 1;
      existing.total += t.total;
      map.set(d, existing);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  const dataSummary = useMemo(() => {
    const lines = [
      `Period: ${dateFrom} to ${dateTo}`,
      `Total POS revenue: JMD ${totalRevenue.toFixed(2)}`,
      `Transactions: ${transactions.length}`,
      `Cash: JMD ${cashTotal.toFixed(2)} (${totalRevenue > 0 ? ((cashTotal / totalRevenue) * 100).toFixed(1) : 0}%)`,
      `Card: JMD ${cardTotal.toFixed(2)} (${totalRevenue > 0 ? ((cardTotal / totalRevenue) * 100).toFixed(1) : 0}%)`,
      `Lynk: JMD ${lynkTotal.toFixed(2)} (${totalRevenue > 0 ? ((lynkTotal / totalRevenue) * 100).toFixed(1) : 0}%)`,
      '',
      'Daily breakdown:',
      ...dailySales.map(r =>
        `${r.date}: ${r.txCount} txns, JMD ${r.total.toFixed(2)} (Cash ${r.cash.toFixed(2)}, Card ${r.card.toFixed(2)}, Lynk ${r.lynk.toFixed(2)})`
      ),
    ]
    return lines.join('\n')
  }, [dateFrom, dateTo, totalRevenue, cashTotal, cardTotal, lynkTotal, transactions.length, dailySales])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="POS Reports"
        subtitle="Payment and shift-level reporting"
        breadcrumb={['Retail POS', 'Reports']}
      />

      {/* Date range + export */}
      <div className="card flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="rpt-from" className="block text-xs font-medium text-gray-600 mb-1">
              From
            </label>
            <input
              id="rpt-from"
              type="date"
              className="input"
              value={dateFrom}
              max={dateTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="rpt-to" className="block text-xs font-medium text-gray-600 mb-1">
              To
            </label>
            <input
              id="rpt-to"
              type="date"
              className="input"
              value={dateTo}
              min={dateFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn btn-ghost flex items-center gap-2"
          onClick={() => exportCsv(dailySales)}
          disabled={dailySales.length === 0}
          aria-label="Export daily sales as CSV"
        >
          <Export size={16} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total POS Revenue"
          value={fmtJMD(totalRevenue)}
          icon={CurrencyDollar}
        />
        <MetricCard
          label="Cash Total"
          value={fmtJMD(cashTotal)}
          icon={Calculator}
        />
        <MetricCard
          label="Card Total"
          value={fmtJMD(cardTotal)}
          icon={Receipt}
        />
        <MetricCard
          label="Lynk Total"
          value={fmtJMD(lynkTotal)}
          icon={Receipt}
        />
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500 text-sm">Loading…</div>
      ) : (
        <>
          {/* Payment Method Breakdown */}
          <section aria-labelledby="payment-breakdown-title">
            <h2 id="payment-breakdown-title" className="section-title mb-3">
              Payment Method Breakdown
            </h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-compact w-full" aria-label="Payment method breakdown">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left">Method</th>
                      <th scope="col" className="text-right">Transaction Count</th>
                      <th scope="col" className="text-right">Total</th>
                      <th scope="col" className="text-right">% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentBreakdown.map((row) => (
                      <tr key={row.method}>
                        <td className="font-medium text-gray-900">{row.method}</td>
                        <td className="text-right">
                          <span className="num">{row.count.toLocaleString()}</span>
                        </td>
                        <td className="text-right">
                          <span className="num">{fmtJMD(row.total)}</span>
                        </td>
                        <td className="text-right">
                          <span className="num">{row.pct.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                    {paymentBreakdown.every((r) => r.count === 0) && (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500 py-6 text-sm">
                          No transactions in this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Daily Sales */}
          <section aria-labelledby="daily-sales-title">
            <h2 id="daily-sales-title" className="section-title mb-3">
              Daily Sales
            </h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-compact w-full" aria-label="Daily sales breakdown">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left">Date</th>
                      <th scope="col" className="text-right">Cash</th>
                      <th scope="col" className="text-right">Card</th>
                      <th scope="col" className="text-right">Lynk</th>
                      <th scope="col" className="text-right">Transactions</th>
                      <th scope="col" className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySales.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-500 py-6 text-sm">
                          No sales data for this period.
                        </td>
                      </tr>
                    ) : (
                      dailySales.map((row) => (
                        <tr key={row.date}>
                          <td className="text-gray-700">{fmtDate(row.date)}</td>
                          <td className="text-right"><span className="num">{fmtJMD(row.cash)}</span></td>
                          <td className="text-right"><span className="num">{fmtJMD(row.card)}</span></td>
                          <td className="text-right"><span className="num">{fmtJMD(row.lynk)}</span></td>
                          <td className="text-right"><span className="num">{row.txCount}</span></td>
                          <td className="text-right font-semibold"><span className="num">{fmtJMD(row.total)}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}

      <ReportAssistant dataSummary={dataSummary} reportType="POS Revenue" />
    </div>
  );
}
