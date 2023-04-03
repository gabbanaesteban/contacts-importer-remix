export default function MappingSelect({
  headers,
  name,
  label,
}: {
  headers: string[]
  name: string
  label: string
}) {
  return (
    <div className="col-md-4 mb-3">
      <div className="form-floating">
        <select className="form-select" name={name} disabled={!headers.length} required>
          {headers.map((header, index) => (
            <option key={header + index} value={header}>
              {header}
            </option>
          ))}
        </select>
        <label htmlFor={name}>{label}</label>
      </div>
    </div>
  )
}