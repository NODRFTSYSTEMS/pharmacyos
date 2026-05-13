import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gear,
  FloppyDisk,
  CheckCircle,
  Receipt,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/Shell';

interface PharmacySetting {
  key: string;
  value: string;
}

type SettingsMap = Record<string, string>;

interface SettingsFormState {
  // Pharmacy Details
  pharmacy_name: string;
  pharmacy_address: string;
  currency: string;
  // Regulatory
  nhf_provider_no: string;
  oic_reg_no: string;
  // POS Defaults
  default_float: string;
  opening_float: string;
  gct_rate: string;
  default_shift: string;
  loyalty_rate: string;
  // Receipt
  receipt_footer: string;
}

const SETTING_KEYS: Array<keyof SettingsFormState> = [
  'pharmacy_name',
  'pharmacy_address',
  'currency',
  'nhf_provider_no',
  'oic_reg_no',
  'default_float',
  'opening_float',
  'gct_rate',
  'default_shift',
  'loyalty_rate',
  'receipt_footer',
];

function mapToForm(map: SettingsMap): SettingsFormState {
  return {
    pharmacy_name:    map['pharmacy_name']    ?? '',
    pharmacy_address: map['pharmacy_address'] ?? '',
    currency:         map['currency']         ?? 'JMD',
    nhf_provider_no:  map['nhf_provider_no']  ?? '',
    oic_reg_no:       map['oic_reg_no']       ?? '',
    default_float:    map['default_float']    ?? '',
    opening_float:    map['opening_float']    ?? '',
    gct_rate:         map['gct_rate']         ?? '15',
    default_shift:    map['default_shift']    ?? 'MORNING',
    loyalty_rate:     map['loyalty_rate']     ?? '1',
    receipt_footer:   map['receipt_footer']   ?? '',
  };
}

export function Settings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsFormState>(mapToForm({}));
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: settingsRows = [], isLoading } = useQuery<PharmacySetting[]>({
    queryKey: ['pharmacy_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pharmacy_settings')
        .select('key, value');
      if (error) throw error;
      return data as PharmacySetting[];
    },
  });

  useEffect(() => {
    const map: SettingsMap = {};
    for (const row of settingsRows) {
      map[row.key] = row.value;
    }
    setForm(mapToForm(map));
  }, [settingsRows]);

  const mutation = useMutation({
    mutationFn: async (formData: SettingsFormState) => {
      const upserts = SETTING_KEYS.map((key) => ({
        key,
        value: formData[key],
      }));
      const { error } = await supabase
        .from('pharmacy_settings')
        .upsert(upserts, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy_settings'] });
      setShowSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  function handleField(key: keyof SettingsFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    mutation.mutate(form);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Settings"
          subtitle="Pharmacy configuration and system settings"
          breadcrumb={['Admin', 'Settings']}
        />
        <div className="py-16 text-center text-gray-500 text-sm">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        subtitle="Pharmacy configuration and system settings"
        breadcrumb={['Admin', 'Settings']}
        cta={
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            <FloppyDisk size={18} aria-hidden="true" />
            {mutation.isPending ? 'Saving…' : 'Save Settings'}
          </button>
        }
      />

      {/* Success banner */}
      {showSuccess && (
        <div
          className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          role="status"
          aria-live="polite"
        >
          <CheckCircle size={18} className="shrink-0" aria-hidden="true" />
          Settings saved successfully.
        </div>
      )}

      {mutation.isError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
          aria-live="assertive"
        >
          Failed to save settings. Please try again.
        </div>
      )}

      {/* ── Pharmacy Details ─────────────────────────────────────────────── */}
      <section aria-labelledby="section-details">
        <h2 id="section-details" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          Pharmacy Details
        </h2>
        <div className="card space-y-4 p-5">
          <div>
            <label htmlFor="s-name" className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacy Name
            </label>
            <input
              id="s-name"
              type="text"
              className="input w-full max-w-md"
              value={form.pharmacy_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('pharmacy_name', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="s-address"
              rows={3}
              className="input w-full max-w-md resize-none"
              style={{ height: 'auto', paddingTop: '8px', paddingBottom: '8px' }}
              value={form.pharmacy_address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleField('pharmacy_address', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="s-currency"
              className="input w-full max-w-xs"
              value={form.currency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('currency', e.target.value)}
            >
              <option value="JMD">JMD — Jamaican Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="TTD">TTD — Trinidad Dollar</option>
              <option value="BBD">BBD — Barbados Dollar</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Regulatory ───────────────────────────────────────────────────── */}
      <section aria-labelledby="section-regulatory">
        <h2 id="section-regulatory" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          Regulatory
        </h2>
        <div className="card space-y-4 p-5">
          <div>
            <label htmlFor="s-nhf" className="block text-sm font-medium text-gray-700 mb-1">
              NHF Provider Number
            </label>
            <input
              id="s-nhf"
              type="text"
              className="input w-full max-w-xs"
              placeholder="NHF-XXXXX"
              value={form.nhf_provider_no}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('nhf_provider_no', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-oic" className="block text-sm font-medium text-gray-700 mb-1">
              OIC Registration Number
            </label>
            <input
              id="s-oic"
              type="text"
              className="input w-full max-w-xs"
              placeholder="OIC-XXXXX"
              value={form.oic_reg_no}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('oic_reg_no', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── POS & Operations ─────────────────────────────────────────────── */}
      <section aria-labelledby="section-pos">
        <h2 id="section-pos" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          POS &amp; Operations
        </h2>
        <div className="card p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="s-float" className="block text-sm font-medium text-gray-700 mb-1">
                Default Opening Float (JMD)
              </label>
              <input
                id="s-float"
                type="number"
                min={0}
                step={0.01}
                className="input w-full"
                placeholder="e.g. 5000"
                value={form.default_float}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('default_float', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-400">Used when opening a new EOD session</p>
            </div>
            <div>
              <label htmlFor="s-opening-float" className="block text-sm font-medium text-gray-700 mb-1">
                Today's Opening Float Override (JMD)
              </label>
              <input
                id="s-opening-float"
                type="number"
                min={0}
                step={0.01}
                className="input w-full"
                placeholder="Leave blank to use default"
                value={form.opening_float}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('opening_float', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-400">Overrides default for the current day only</p>
            </div>
            <div>
              <label htmlFor="s-gct" className="block text-sm font-medium text-gray-700 mb-1">
                GCT Rate (%)
              </label>
              <input
                id="s-gct"
                type="number"
                min={0}
                max={100}
                step={0.01}
                className="input w-full"
                placeholder="15"
                value={form.gct_rate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('gct_rate', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-shift" className="block text-sm font-medium text-gray-700 mb-1">
                Default Shift
              </label>
              <select
                id="s-shift"
                className="input w-full"
                value={form.default_shift}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('default_shift', e.target.value)}
              >
                <option value="MORNING">Morning</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="EVENING">Evening</option>
                <option value="OVERNIGHT">Overnight</option>
              </select>
            </div>
            <div>
              <label htmlFor="s-loyalty" className="block text-sm font-medium text-gray-700 mb-1">
                Loyalty Points Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="s-loyalty"
                  type="number"
                  min={0}
                  step={0.01}
                  className="input w-full"
                  placeholder="1"
                  value={form.loyalty_rate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('loyalty_rate', e.target.value)}
                />
                <span className="text-sm text-gray-500 shrink-0">pts / $1</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Points earned per dollar spent</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Receipt ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="section-receipt">
        <h2 id="section-receipt" className="section-title mb-4 flex items-center gap-2">
          <Receipt size={18} aria-hidden="true" />
          Receipt
        </h2>
        <div className="card p-5 space-y-4">
          <div>
            <label htmlFor="s-footer" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Footer Message
            </label>
            <textarea
              id="s-footer"
              rows={3}
              className="input w-full max-w-lg resize-none"
              style={{ height: 'auto', paddingTop: '8px', paddingBottom: '8px' }}
              placeholder="e.g. Thank you for choosing Winchester Global Pharmacy. Your health is our priority."
              value={form.receipt_footer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleField('receipt_footer', e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">Printed at the bottom of every POS receipt</p>
          </div>
        </div>
      </section>

      {/* Bottom save button */}
      <div className="flex justify-end pb-6">
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          <FloppyDisk size={18} aria-hidden="true" />
          {mutation.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
