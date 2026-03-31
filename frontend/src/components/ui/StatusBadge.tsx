import { STATUS_LABELS, PRIORITY_LABELS } from '@/types';
import clsx from 'clsx';

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('status-badge', `status-${status}`)}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={clsx('status-badge', `priority-${priority}`)}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}
