import type{ SelectHTMLAttributes } from "react";

interface MappingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  name: string;
  label: string;
  mapping: Record<string, string> | null;
}
export default function MappingSelect({
  options,
  name,
  label,
  mapping,
  ...props
}: MappingSelectProps) {
  return (
    <div className="col-md-4 mb-3">
      <div className="form-floating">
        <select className="form-select" value={mapping?.[name]} name={name} disabled={!options.length} {...props} required>
          {options.map((option, index) => (
            <option key={option + index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label htmlFor={name}>{label}</label>
      </div>
    </div>
  )
}