import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gear,
  FloppyDisk,
  CheckCircle,
  Receipt,
  Megaphone,
  Robot,
  ClockCounterClockwise,
} from '@phosphor-icons/react';
import { supabase } from '../../lib/supabase';
import { AUDIT_ACTIONS } from '../../constants/audit-actions';
import { PageHeader, Pill as StatusPill } from '../../components/Shell';
import type { AiRoleSetting, DashboardUpdate, StaffRole } from '../../types/database';

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
  // Owner / Licensee Profile (PCOJ + NHF requirement)
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  pharmacy_phone: string;
  pharmacy_license_no: string;
  pharmacy_logo_url: string;
  // Regulatory
  nhf_provider_no: string;
  oic_reg_no: string;
  // POS Defaults
  default_float: string;
  opening_float: string;
  gct_rate: string;
  default_shift: string;
  loyalty_rate: string;
  loyalty_redemption_value: string;
  // POS Controls
  allow_over_sell: string;  // 'true' | 'false' — override stock enforcement for special dispensing
  // Receipt
  receipt_footer: string;
  // Reliability reports
  daily_inconsistency_report_enabled: string;
  daily_inconsistency_report_time: string;
  daily_inconsistency_report_timezone: string;
}

const SETTING_KEYS: Array<keyof SettingsFormState> = [
  'pharmacy_name',
  'pharmacy_address',
  'currency',
  // Owner / Licensee Profile
  'owner_name',
  'owner_phone',
  'owner_email',
  'pharmacy_phone',
  'pharmacy_license_no',
  'pharmacy_logo_url',
  // Regulatory
  'nhf_provider_no',
  'oic_reg_no',
  // POS Defaults
  'default_float',
  'opening_float',
  'gct_rate',
  'default_shift',
  'loyalty_rate',
  'loyalty_redemption_value',
  // POS Controls
  'allow_over_sell',
  // Receipt
  'receipt_footer',
  // Reliability reports
  'daily_inconsistency_report_enabled',
  'daily_inconsistency_report_time',
  'daily_inconsistency_report_timezone',
];

function mapToForm(map: SettingsMap): SettingsFormState {
  return {
    pharmacy_name:    map['pharmacy_name']    ?? '',
    pharmacy_address: map['pharmacy_address'] ?? '',
    currency:         map['currency']         ?? 'JMD',
    // Owner / Licensee Profile
    owner_name:          map['owner_name']          ?? '',
    owner_phone:         map['owner_phone']         ?? '',
    owner_email:         map['owner_email']         ?? '',
    pharmacy_phone:      map['pharmacy_phone']      ?? '',
    pharmacy_license_no: map['pharmacy_license_no'] ?? '',
    pharmacy_logo_url:   map['pharmacy_logo_url']   ?? '',
    // Regulatory
    nhf_provider_no:  map['nhf_provider_no']  ?? '',
    oic_reg_no:       map['oic_reg_no']       ?? '',
    // POS Defaults
    default_float:    map['default_float']    ?? '',
    opening_float:    map['opening_float']    ?? '',
    gct_rate:         map['gct_rate']         ?? '15',
    default_shift:    map['default_shift']    ?? 'MORNING',
    loyalty_rate:              map['loyalty_rate']              ?? '1',
    loyalty_redemption_value:  map['loyalty_redemption_value']  ?? '0.01',
    // POS Controls
    allow_over_sell: map['allow_over_sell'] ?? 'false',
    // Receipt
    receipt_footer:            map['receipt_footer']            ?? '',
    daily_inconsistency_report_enabled:  map['daily_inconsistency_report_enabled']  ?? 'true',
    daily_inconsistency_report_time:     map['daily_inconsistency_report_time']     ?? '18:00',
    daily_inconsistency_report_timezone: map['daily_inconsistency_report_timezone'] ?? 'America/Jamaica',
  };
}

interface DashboardUpdateDraft {
  title: string;
  body: string;
  category: DashboardUpdate['category'];
  audience_role: '' | StaffRole;
  priority: string;
}

const EMPTY_UPDATE: DashboardUpdateDraft = {
  title: '',
  body: '',
  category: 'UPDATE',
  audience_role: '',
  priority: '3',
};

export function Settings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsFormState>(mapToForm({}));
  const [updateDraft, setUpdateDraft] = useState<DashboardUpdateDraft>(EMPTY_UPDATE);
  const [editingAiRole, setEditingAiRole] = useState<string | null>(null);
  const [aiPromptDrafts, setAiPromptDrafts] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  const { data: settingsRows = [], isLoading } = useQuery<PharmacySetting[]>({
    queryKey: ['pharmacy_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pharmacy_settings')
        .select('key, value');
      if (error) throw error;
      return data as PharmacySetting[];
    },
    staleTime: 30_000,
  });

  const { data: dashboardUpdates = [] } = useQuery<DashboardUpdate[]>({
    queryKey: ['admin-dashboard-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_updates')
        .select('*')
        .order('priority', { ascending: true })
        .order('starts_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as DashboardUpdate[];
    },
    staleTime: 30_000,
  });

  const { data: aiRoles = [] } = useQuery<AiRoleSetting[]>({
    queryKey: ['ai-role-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_role_settings')
        .select('*')
        .order('display_name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as AiRoleSetting[];
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    // Only populate the form on the first successful data load.
    // Subsequent query invalidations (e.g. after save) must not overwrite
    // form state — that would cause an infinite re-render loop because
    // every setForm call triggers a re-render, which produces a new
    // settingsRows array reference, which re-fires this effect.
    if (initializedRef.current) return;
    if (settingsRows.length === 0) return;
    initializedRef.current = true;
    const map: SettingsMap = {};
    for (const row of settingsRows) {
      map[row.key] = row.value;
    }
    setForm(mapToForm(map));
  }, [settingsRows]);

  useEffect(() => {
    setAiPromptDrafts(current => {
      const next = { ...current };
      for (const role of aiRoles) {
        if (next[role.role_key] === undefined) next[role.role_key] = role.system_prompt;
      }
      return next;
    });
  }, [aiRoles]);

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

      // Audit trail — record which keys were updated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_log').insert({
          actor_id:   user.id,
          actor_name: user.email ?? 'unknown',
          action:     AUDIT_ACTIONS.SETTINGS_UPDATE,
          table_name: 'pharmacy_settings',
          record_id:  null,
          details:    { updated_keys: SETTING_KEYS },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy_settings'] });
      setShowSuccess(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const createDashboardUpdate = useMutation({
    mutationFn: async (draft: DashboardUpdateDraft) => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        title: draft.title.trim(),
        body: draft.body.trim(),
        category: draft.category,
        audience_role: draft.audience_role || null,
        priority: Number(draft.priority || 3),
        is_active: true,
        starts_at: new Date().toISOString(),
        ends_at: null,
        created_by: user?.id ?? null,
        created_by_name: user?.email ?? 'System',
      };
      const { data: created, error } = await supabase.from('dashboard_updates').insert(payload).select('id').single();
      if (error) throw error;
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.SETTINGS_UPDATE,
        table_name: 'dashboard_updates',
        record_id:  created.id,
        details:    { subtype: 'dashboard_update_create', title: payload.title, category: payload.category },
      });
      if (auditError) console.error('audit_log write failed', auditError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-updates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-updates'] });
      setUpdateDraft(EMPTY_UPDATE);
    },
  });

  const toggleDashboardUpdate = useMutation({
    mutationFn: async (update: DashboardUpdate) => {
      const { error } = await supabase
        .from('dashboard_updates')
        .update({ is_active: !update.is_active, updated_at: new Date().toISOString() })
        .eq('id', update.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-updates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-updates'] });
    },
  });

  const updateAiRole = useMutation({
    mutationFn: async (role: AiRoleSetting) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('ai_role_settings')
        .update({
          enabled: role.enabled,
          system_prompt: aiPromptDrafts[role.role_key] ?? role.system_prompt,
          last_reviewed_at: new Date().toISOString(),
          last_reviewed_by: user?.email ?? 'System',
          updated_at: new Date().toISOString(),
        })
        .eq('id', role.id);
      if (error) throw error;
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.SETTINGS_UPDATE,
        table_name: 'ai_role_settings',
        record_id:  role.id,
        details:    { subtype: 'ai_role_prompt_update', role_key: role.role_key },
      });
      if (auditError) console.error('audit_log write failed', auditError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-role-settings'] });
      setEditingAiRole(null);
    },
  });

  const toggleAiRole = useMutation({
    mutationFn: async (role: AiRoleSetting) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('ai_role_settings')
        .update({
          enabled: !role.enabled,
          last_reviewed_at: new Date().toISOString(),
          last_reviewed_by: user?.email ?? 'System',
          updated_at: new Date().toISOString(),
        })
        .eq('id', role.id);
      if (error) throw error;
      const { error: auditError } = await supabase.from('audit_log').insert({
        actor_id:   user?.id ?? null,
        actor_name: user?.email ?? 'System',
        action:     AUDIT_ACTIONS.SETTINGS_UPDATE,
        table_name: 'ai_role_settings',
        record_id:  role.id,
        details:    { subtype: 'ai_role_toggle', role_key: role.role_key, enabled: !role.enabled },
      });
      if (auditError) console.error('audit_log write failed', auditError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-role-settings'] });
    },
  });

  const runDailyReport = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('generate_daily_inconsistency_report');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latest-daily-inconsistency-report'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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

  function handleUpdateDraft<K extends keyof DashboardUpdateDraft>(key: K, value: DashboardUpdateDraft[K]) {
    setUpdateDraft(prev => ({ ...prev, [key]: value }));
  }

  function handleCreateDashboardUpdate() {
    if (!updateDraft.title.trim() || !updateDraft.body.trim()) return;
    createDashboardUpdate.mutate(updateDraft);
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

      {/* ── Owner / Licensee Profile ─────────────────────────────────────── */}
      {/* Required for PCOJ prescription headers, NHF claims, and print output */}
      <section aria-labelledby="section-owner">
        <h2 id="section-owner" className="section-title mb-4 flex items-center gap-2">
          <Gear size={18} aria-hidden="true" />
          Owner / Licensee Profile
        </h2>
        <div className="card p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="s-owner-name" className="block text-sm font-medium text-gray-700 mb-1">
                Licensed Owner Name
              </label>
              <input
                id="s-owner-name"
                type="text"
                className="input w-full"
                placeholder="Full name as on PCOJ licence"
                value={form.owner_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('owner_name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-pharmacy-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy Phone
              </label>
              <input
                id="s-pharmacy-phone"
                type="tel"
                className="input w-full"
                placeholder="e.g. 876-XXX-XXXX"
                value={form.pharmacy_phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('pharmacy_phone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-owner-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Owner Phone
              </label>
              <input
                id="s-owner-phone"
                type="tel"
                className="input w-full"
                placeholder="e.g. 876-XXX-XXXX"
                value={form.owner_phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('owner_phone', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-owner-email" className="block text-sm font-medium text-gray-700 mb-1">
                Owner Email
              </label>
              <input
                id="s-owner-email"
                type="email"
                className="input w-full"
                placeholder="owner@example.com"
                value={form.owner_email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('owner_email', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-pcoj-license" className="block text-sm font-medium text-gray-700 mb-1">
                PCOJ Licence No.
              </label>
              <input
                id="s-pcoj-license"
                type="text"
                className="input w-full"
                placeholder="PCOJ-XXXXX"
                value={form.pharmacy_license_no}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('pharmacy_license_no', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-logo-url" className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy Logo URL
              </label>
              <input
                id="s-logo-url"
                type="url"
                className="input w-full"
                placeholder="https://..."
                value={form.pharmacy_logo_url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('pharmacy_logo_url', e.target.value)}
              />
            </div>
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
                Loyalty Earn Rate
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
                <span className="text-sm text-gray-500 shrink-0">pts / J$1</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Points earned per dollar spent</p>
            </div>
            <div>
              <label htmlFor="s-loyalty-redeem" className="block text-sm font-medium text-gray-700 mb-1">
                Point Redemption Value
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 shrink-0">J$</span>
                <input
                  id="s-loyalty-redeem"
                  type="number"
                  min={0}
                  step={0.001}
                  className="input w-full"
                  placeholder="0.01"
                  value={form.loyalty_redemption_value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('loyalty_redemption_value', e.target.value)}
                />
                <span className="text-sm text-gray-500 shrink-0">/ pt</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Cash value of 1 point when redeemed</p>
            </div>
          </div>

          {/* Allow Over-Sell — stock enforcement override for special dispensing */}
          <div className="border-t border-gray-100 pt-5 mt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={form.allow_over_sell === 'true'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleField('allow_over_sell', e.target.checked ? 'true' : 'false')
                }
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Allow Over-Sell</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  When enabled, cashiers can sell more units than are recorded in stock.
                  Disable to enforce strict inventory — recommended for controlled drug dispensaries (Pharmacy Act).
                  Disabled by default.
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* ── Receipt ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="section-dashboard-updates">
        <h2 id="section-dashboard-updates" className="section-title mb-4 flex items-center gap-2">
          <Megaphone size={18} aria-hidden="true" />
          Dashboard Updates
        </h2>
        <div className="card p-5 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_160px_160px] gap-4">
            <div>
              <label htmlFor="du-title" className="block text-sm font-medium text-gray-700 mb-1">
                Update Title
              </label>
              <input
                id="du-title"
                type="text"
                className="input w-full"
                value={updateDraft.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateDraft('title', e.target.value)}
                placeholder="Short dashboard headline"
              />
            </div>
            <div>
              <label htmlFor="du-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="du-category"
                className="input w-full"
                value={updateDraft.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateDraft('category', e.target.value as DashboardUpdate['category'])}
              >
                <option value="NEWS">News</option>
                <option value="MESSAGE">Message</option>
                <option value="UPDATE">Update</option>
                <option value="ALERT">Alert</option>
              </select>
            </div>
            <div>
              <label htmlFor="du-audience" className="block text-sm font-medium text-gray-700 mb-1">
                Audience
              </label>
              <select
                id="du-audience"
                className="input w-full"
                value={updateDraft.audience_role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateDraft('audience_role', e.target.value as DashboardUpdateDraft['audience_role'])}
              >
                <option value="">All staff</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="CASHIER">Cashier</option>
                <option value="AUDITOR">Auditor</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="du-body" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="du-body"
              rows={3}
              className="input w-full resize-none"
              style={{ height: 'auto', paddingTop: '8px', paddingBottom: '8px' }}
              value={updateDraft.body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleUpdateDraft('body', e.target.value)}
              placeholder="Operational note visible on the dashboard"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              onClick={handleCreateDashboardUpdate}
              disabled={createDashboardUpdate.isPending || !updateDraft.title.trim() || !updateDraft.body.trim()}
            >
              Publish Update
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full table-compact text-sm" aria-label="Dashboard updates">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Audience</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboardUpdates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      No dashboard updates configured.
                    </td>
                  </tr>
                )}
                {dashboardUpdates.map(update => (
                  <tr key={update.id}>
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-800">{update.title}</div>
                      <div className="text-xs text-gray-500 max-w-xl truncate">{update.body}</div>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">{update.category}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{update.audience_role ?? 'All staff'}</td>
                    <td className="px-4 py-2">
                      <StatusPill label={update.is_active ? 'Active' : 'Inactive'} variant={update.is_active ? 'green' : 'gray'} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="btn btn-ghost text-xs h-8"
                        onClick={() => toggleDashboardUpdate.mutate(update)}
                        disabled={toggleDashboardUpdate.isPending}
                      >
                        {update.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="section-daily-reporting">
        <h2 id="section-daily-reporting" className="section-title mb-4 flex items-center gap-2">
          <ClockCounterClockwise size={18} aria-hidden="true" />
          Daily Inconsistency Reporting
        </h2>
        <div className="card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="s-daily-report-enabled" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Report
              </label>
              <select
                id="s-daily-report-enabled"
                className="input w-full"
                value={form.daily_inconsistency_report_enabled}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleField('daily_inconsistency_report_enabled', e.target.value)}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label htmlFor="s-daily-report-time" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time
              </label>
              <input
                id="s-daily-report-time"
                type="time"
                className="input w-full"
                value={form.daily_inconsistency_report_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('daily_inconsistency_report_time', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-daily-report-timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <input
                id="s-daily-report-timezone"
                type="text"
                className="input w-full"
                value={form.daily_inconsistency_report_timezone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleField('daily_inconsistency_report_timezone', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              The database report generator is installed. Production scheduling must invoke the report RPC at the configured time.
            </p>
            <button
              className="btn btn-ghost bg-white text-xs"
              onClick={() => runDailyReport.mutate()}
              disabled={runDailyReport.isPending}
            >
              {runDailyReport.isPending ? 'Generating...' : 'Generate Now'}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="section-ai-roles">
        <h2 id="section-ai-roles" className="section-title mb-4 flex items-center gap-2">
          <Robot size={18} aria-hidden="true" />
          AI Role Settings
        </h2>
        <div className="card divide-y divide-gray-100">
          {aiRoles.length === 0 && (
            <div className="p-5 text-sm text-gray-500">
              No AI role settings found. Run migration 029 to seed configurable AI roles.
            </div>
          )}
          {aiRoles.map(role => {
            const editing = editingAiRole === role.role_key;
            return (
              <div key={role.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{role.display_name}</h3>
                      <StatusPill label={role.enabled ? 'Enabled' : 'Disabled'} variant={role.enabled ? 'green' : 'gray'} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {role.provider} / {role.model} / escalation: {role.escalation_role ?? 'Not set'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-ghost text-xs"
                      onClick={() => toggleAiRole.mutate(role)}
                      disabled={toggleAiRole.isPending}
                    >
                      {role.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="btn btn-ghost text-xs"
                      onClick={() => setEditingAiRole(editing ? null : role.role_key)}
                    >
                      {editing ? 'Close' : 'Customize'}
                    </button>
                  </div>
                </div>
                {editing && (
                  <div className="mt-4 space-y-3">
                    <label htmlFor={`ai-prompt-${role.role_key}`} className="block text-sm font-medium text-gray-700">
                      System Prompt
                    </label>
                    <textarea
                      id={`ai-prompt-${role.role_key}`}
                      rows={4}
                      className="input w-full resize-none"
                      style={{ height: 'auto', paddingTop: '8px', paddingBottom: '8px' }}
                      value={aiPromptDrafts[role.role_key] ?? role.system_prompt}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setAiPromptDrafts(prev => ({ ...prev, [role.role_key]: e.target.value }));
                      }}
                    />
                    {role.safety_notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                        {role.safety_notes}
                      </p>
                    )}
                    <div className="flex justify-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => updateAiRole.mutate(role)}
                        disabled={updateAiRole.isPending}
                      >
                        Save AI Role
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

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
              placeholder="e.g. Thank you for your visit."
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
