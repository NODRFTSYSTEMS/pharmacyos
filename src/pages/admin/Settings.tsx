import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gear,
  FloppyDisk,
  CheckCircle,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/Shell';

interface PharmacySetting {
  key: string;
  value: string;
}

type SettingsMap = Record<string, string>;

interface SettingsFormState {
  pharmacy_name: string;
  pharmacy_address: string;
  nhf_provider_no: string;
  oic_reg_no: string;
  default_float: string;
  gct_rate: string;
}

const SETTING_KEYS: Array<keyof SettingsFormState> = [
  'pharmacy_name',
  'pharmacy_address',
  'nhf_provider_no',
  'oic_reg_no',
  'default_float',
  'gct_rate',
];

function mapToForm(map: SettingsMap): SettingsFormState {
  return {
    pharmacy_name: map['pharmacy_name'] ?? '',
    pharmacy_address: map['pharmacy_address'] ?? '',
    nhf_provider_no: map['nhf_provider_no'] ?? '',
    oic_reg_no: map['oic_reg_no'] ?? '',
    default_float: map['default_float'] ?? '',
    gct_rate: map['gct_rate'] ?? '15',
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

  // Clean up timer on unmount
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
        actions={
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

      {/* Pharmacy Details */}
      <section aria-labelledby="section-details">
        <h2 id="section-details" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          Pharmacy Details
        </h2>
        <div className="card space-y-4">
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
              value={form.pharmacy_address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleField('pharmacy_address', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Regulatory */}
      <section aria-labelledby="section-regulatory">
        <h2 id="section-regulatory" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          Regulatory
        </h2>
        <div className="card space-y-4">
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

      {/* POS Defaults */}
      <section aria-labelledby="section-pos">
        <h2 id="section-pos" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          POS Defaults
        </h2>
        <div className="card space-y-4">
          <div>
            <label htmlFor="s-float" className="block text-sm font-medium text-gray-700 mb-1">
              Default Opening Float (JMD)
            </label>
            <input
              id="s-float"
              type="number"
              min={0}
              step={0.01}
              className="input w-full max-w-xs"
              value={form.default_float}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('default_float', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="s-gct" className="block text-sm font-medium text-gray-700 mb-1">
              GCT Rate %
            </label>
            <input
              id="s-gct"
              type="number"
              min={0}
              max={100}
              step={0.01}
              className="input w-full max-w-xs"
              value={form.gct_rate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('gct_rate', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Bottom save button (convenience for long form) */}
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
