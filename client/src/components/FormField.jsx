import React from "react";

/**
 * FormField (JSX)
 *
 * Props:
 * - labelName (string) : label text shown above the input
 * - placeholder (string)
 * - inputType (string)  : e.g. "text", "url", "date"
 * - isTextArea (bool)
 * - value
 * - handleChange (fn)
 * - rows (number) optional for textarea (default 6)
 * - required (bool) optional (default true)
 *
 * Compatible with your current usage.
 */
const FormField = ({
  labelName,
  placeholder,
  inputType = "text",
  isTextArea = false,
  value,
  handleChange,
  rows = 6,
  required = true,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="mb-2 text-sm font-medium text-slate-800">
          {labelName}
        </span>
      )}

      {isTextArea ? (
        <textarea
          required={required}
          value={value}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          aria-label={labelName || placeholder}
          className="resize-none w-full min-h-[140px] px-4 py-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow shadow-sm"
        />
      ) : (
        <input
          required={required}
          value={value}
          onChange={handleChange}
          type={inputType}
          step={inputType === "number" ? "0.01" : undefined}
          placeholder={placeholder}
          aria-label={labelName || placeholder}
          className="w-full h-12 px-4 py-3 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow shadow-sm"
        />
      )}
    </label>
  );
};

export default FormField;
