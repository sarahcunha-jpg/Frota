import React from 'react';
import { StatusBadge } from '../common';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'danger' | 'warning' | 'info';
  timestamp: string;
  icon?: React.ReactNode;
}

interface AlertsSectionProps {
  alerts: Alert[];
  onAlertClick?: (id: string) => void;
  maxHeight?: boolean;
}

const severityIcons = {
  danger: '⚠️',
  warning: '⚡',
  info: 'ℹ️',
};

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  alerts,
  onAlertClick,
  maxHeight = true,
}) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-white border border-neutral-300 rounded-lg p-4 lg:p-6 text-center">
        <span className="text-3xl mb-2 block">✓</span>
        <p className="text-neutral-600">Nenhum alerta no momento</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-neutral-300">
        <h3 className="text-lg font-semibold text-neutral-900">Alertas Críticos</h3>
        <p className="text-sm text-neutral-600 mt-1">{alerts.length} alerta(s) ativa(s)</p>
      </div>

      <div className={`${maxHeight ? 'max-h-96 overflow-y-auto' : ''}`}>
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`
              p-4 border-b border-neutral-200 hover:bg-neutral-50 transition-colors
              ${onAlertClick ? 'cursor-pointer' : ''}
              ${index === 0 ? '' : ''}
            `}
            onClick={() => onAlertClick?.(alert.id)}
            role={onAlertClick ? 'button' : undefined}
            tabIndex={onAlertClick ? 0 : undefined}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">
                {alert.icon || severityIcons[alert.severity]}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-neutral-900 text-sm">{alert.title}</h4>
                  <StatusBadge
                    status={alert.severity}
                    label={alert.severity === 'danger' ? 'Urgente' : alert.severity === 'warning' ? 'Aviso' : 'Info'}
                  />
                </div>
                <p className="text-xs text-neutral-600 truncate">{alert.description}</p>
                <p className="text-xs text-neutral-500 mt-1">{alert.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;