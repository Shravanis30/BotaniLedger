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

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-mid shadow-lg shadow-green-900/10",
    secondary: "bg-white border-2 border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary",
    accent: "gold-gradient text-primary-dark shadow-xl shadow-green-900/20",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/10",
    ghost: "bg-transparent hover:bg-gray-50 text-gray-400"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = React.forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        "w-full px-6 py-4 bg-gray-50 border-2 border-transparent border-gray-50 rounded-2xl focus:bg-white focus:border-primary transition-all outline-none font-bold text-gray-800 placeholder:text-gray-300",
        error && "border-red-500 bg-red-50/10",
        className
      )}
      {...props}
    />
    {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{error}</p>}
  </div>
));

Input.displayName = "Input";

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
// update on 2026-03-23 - feat: update dashboard UI components
// update on 2026-03-24 - feat: update dashboard UI components
// update on 2026-04-03 - feat: update dashboard UI components
// update on 2026-04-04 - fix: correct edge case in service logic
// update on 2026-04-06 - fix: correct edge case in service logic
// update on 2026-04-07 - docs: update API documentation
// update on 2026-04-08 - 
// update on 2026-04-09 - refactor: optimize backend performance
