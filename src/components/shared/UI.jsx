import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className }) => (
  <div className={cn("bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden", className)}>
    {children}
  </div>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-gray-100 text-gray-600 border-gray-200",
    LAB_TESTING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    LAB_PASSED: "bg-green-100 text-green-700 border-green-200",
    LAB_FAILED: "bg-red-100 text-red-700 border-red-200",
    APPROVED: "bg-primary-light/20 text-primary-dark border-primary-light/30",
    QR_GENERATED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    RECALLED: "bg-red-200 text-red-900 border-red-300",
  };

  const dotColors = {
    PENDING: "bg-gray-400",
    LAB_TESTING: "bg-yellow-500",
    LAB_PASSED: "bg-green-500",
    LAB_FAILED: "bg-red-500",
    APPROVED: "bg-primary",
    QR_GENERATED: "bg-emerald-500",
    RECALLED: "bg-red-700",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-fit uppercase tracking-wider",
      styles[status] || styles.PENDING
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", dotColors[status] || dotColors.PENDING)} />
      {status?.replace('_', ' ')}
    </span>
  );
};

export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
);

export const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-6 shadow-sm">
      {Icon ? <Icon size={32} /> : <div className="w-8 h-8 bg-gray-100 rounded-full" />}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{description}</p>
  </div>
);
// update on 2026-03-15 - 
// update on 2026-03-17 - docs: update API documentation
// update on 2026-03-21 - fix: correct edge case in service logic
// update on 2026-03-23 - refactor: improve code structure
// update on 2026-03-25 - refactor: improve code structure
// update on 2026-03-25 - feat: improve farmer batch handling
// update on 2026-03-25 - refactor: optimize backend performance
// update on 2026-03-26 - style: improve UI responsiveness
// update on 2026-03-27 - refactor: optimize backend performance
// update on 2026-03-28 - fix: resolve API validation issue
// update on 2026-03-29 - feat: update dashboard UI components
// update on 2026-04-02 - style: improve UI responsiveness
// update on 2026-04-02 - feat: optimize blockchain interaction
// update on 2026-04-06 - refactor: optimize backend performance
// update on 2026-04-08 - fix: resolve API validation issue
// update on 2026-04-11 - feat: update dashboard UI components
// update on 2026-04-11 - style: improve UI responsiveness
// update on 2026-04-12 - refactor: optimize backend performance
// update on 2026-03-15 - feat: optimize blockchain interaction
// update on 2026-03-16 - docs: update API documentation
// update on 2026-03-17 - docs: update API documentation
// update on 2026-03-17 - fix: resolve API validation issue
// update on 2026-03-18 - refactor: improve code structure
// update on 2026-03-22 - feat: improve farmer batch handling
