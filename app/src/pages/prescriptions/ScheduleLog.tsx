import React from 'react';
import { Warning, LockSimple, ClipboardText } from '@phosphor-icons/react';
import { PageHeader } from '../../components/Shell';

export function ScheduleLog() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Schedule Drug Log"
        breadcrumb={['Prescriptions', 'Schedule Log']}
      />

      {/* Blocked placeholder card */}
      <div
        className="rounded-lg border border-amber-300 bg-amber-50 px-6 py-8 flex flex-col gap-5"
        role="region"
        aria-labelledby="schedule-log-status"
      >
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            <Warning size={32} weight="fill" className="text-amber-500" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="schedule-log-status"
              className="text-lg font-semibold text-amber-900 mb-1"
            >
              Module Pending Pharmacist Approval
            </h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              This module requires pharmacist sign-off on the log format before implementation.
            </p>
          </div>
        </div>

        {/* Controlled document notice */}
        <div className="flex items-start gap-3 border-t border-amber-200 pt-5">
          <LockSimple size={20} className="shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <div className="text-sm text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">Controlled Document</p>
            <p>
              The Schedule Drug Log is a controlled document under the{' '}
              <strong>Dangerous Drugs Act (Jamaica)</strong>. The format, fields, and workflow must
              comply with regulatory requirements before this module may be deployed.
            </p>
          </div>
        </div>

        {/* Governance reference */}
        <div className="flex items-start gap-3 border-t border-amber-200 pt-5">
          <ClipboardText size={20} className="shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <div className="text-sm text-amber-800 leading-relaxed">
            <p className="font-semibold mb-1">Governance Reference</p>
            <p>
              Implementation is pending pharmacist approval{' '}
              <span className="font-mono text-xs bg-amber-100 px-1.5 py-0.5 rounded">Gap G6</span>{' '}
              in the project governance record.
            </p>
            <p className="mt-2">
              The pharmacist-in-charge must review and sign off on the log format before this module
              can be activated.
            </p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div>
        <a
          href="/prescriptions"
          className="btn btn-ghost inline-flex items-center gap-2 text-sm"
        >
          &larr; Back to Prescription Queue
        </a>
      </div>
    </div>
  );
}
