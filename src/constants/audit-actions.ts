// ── Audit Action String Registry ──────────────────────────────────────────────
// All audit_log writes MUST use these constants as the `action` value.
// Adding new actions: add the constant here first, then use it at the write site.
// The AuditLog admin page color map is keyed against these strings.

export const AUDIT_ACTIONS = {
  // ── POS / Retail ────────────────────────────────────────────────────────────
  TRANSACTION_CREATE:       'transaction_create',
  TRANSACTION_VOID:         'transaction_void',
  LOYALTY_POINTS_EARN:      'loyalty_points_earn',
  LOYALTY_POINTS_REDEEM:    'loyalty_points_redeem',
  LOYALTY_CUSTOMER_CREATE:  'loyalty_customer_create',
  LOYALTY_CUSTOMER_UPDATE:  'loyalty_customer_update',

  // ── EOD ─────────────────────────────────────────────────────────────────────
  EOD_SUBMIT:               'eod_submit',
  EOD_APPROVE:              'eod_approve',
  EOD_DISCREPANCY:          'eod_discrepancy',

  // ── Prescriptions / Rx ──────────────────────────────────────────────────────
  RX_CREATE:                'rx_create',
  RX_STATUS_ADVANCE:        'rx_status_advance',
  RX_DISPENSE:              'rx_dispense',
  RX_CANCEL:                'rx_cancel',
  RX_TRANSACTION_CREATE:    'rx_transaction_create',

  // ── Schedule Drug Log ────────────────────────────────────────────────────────
  SCHEDULE_DRUG_ENTRY:      'schedule_drug_entry',
  SCHEDULE_DRUG_UPDATE:     'schedule_drug_update',
  SCHEDULE_DRUG_DELETE:     'schedule_drug_delete',

  // ── Inventory / Stock ────────────────────────────────────────────────────────
  STOCK_DECREMENT:          'stock_decrement',
  STOCK_RECEIVE:            'stock_receive',
  STOCK_ADJUST:             'stock_adjust',
  PRODUCT_CREATE:           'product_create',
  PRODUCT_UPDATE:           'product_update',

  // ── Patients ─────────────────────────────────────────────────────────────────
  PATIENT_CREATE:           'patient_create',
  PATIENT_UPDATE:           'patient_update',
  PATIENT_JDPA_CONSENT:     'patient_jdpa_consent',
  PATIENT_DATA_EXPORT:      'patient_data_export',
  PATIENT_DATA_DELETE:      'patient_data_delete',

  // ── AI Queue ─────────────────────────────────────────────────────────────────
  AI_EXTRACTION_ACCEPT:     'ai_extraction_accept',
  AI_EXTRACTION_REJECT:     'ai_extraction_reject',

  // ── Timecards ────────────────────────────────────────────────────────────────
  TIMECARD_CLOCK_IN:        'timecard_clock_in',
  TIMECARD_CLOCK_OUT:       'timecard_clock_out',
  TIMECARD_APPROVE:         'timecard_approve',
  TIMECARD_FLAG:            'timecard_flag',

  // ── Staff / Auth ─────────────────────────────────────────────────────────────
  STAFF_CREATE:             'staff_create',
  STAFF_UPDATE:             'staff_update',
  STAFF_DEACTIVATE:         'staff_deactivate',
  STAFF_LOGIN:              'staff_login',
  STAFF_LOGOUT:             'staff_logout',
  STAFF_LOGIN_FAILED:       'staff_login_failed',
  SESSION_TIMEOUT:          'session_timeout',
  ACCESS_DENIED:            'access_denied',

  // ── Void Requests ────────────────────────────────────────────────────────────
  VOID_REQUEST:             'void_request',
  VOID_APPROVED:            'void_approved',
  VOID_DENIED:              'void_denied',

  // ── HR — Leave & Certifications ──────────────────────────────────────────────
  LEAVE_REQUEST_SUBMIT:     'leave_request_submit',
  LEAVE_REQUEST_APPROVE:    'leave_request_approve',
  LEAVE_REQUEST_DENY:       'leave_request_deny',
  LEAVE_REQUEST_CANCEL:     'leave_request_cancel',
  CERT_CREATE:              'cert_create',
  CERT_UPDATE:              'cert_update',

  // ── Settings ─────────────────────────────────────────────────────────────────
  SETTINGS_UPDATE:          'settings_update',
  PERMISSIONS_UPDATE:       'permissions_update',

  // â”€â”€ System Reliability â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  SYSTEM_ERROR:             'system_error',
} as const

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS]
