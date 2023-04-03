import { useCSVHeaders } from "~/utils/useCSVHeaders"
import type { CSVHeadersHook } from "~/utils/useCSVHeaders"
import MappingSelect from "~/components/MappingSelect"
import { useState } from "react"
import PageHeader from "~/components/PageHeader"

export function meta() {
  return {
    title: "Add Import",
    description: "Upload a new file with contacts to import",
  }
}

export default function NewImport() {
  const { title, description } = meta()
  const [headers, handleFileInputChange]: CSVHeadersHook = useCSVHeaders()
  const [isChecked, setIsChecked] = useState(false)

  return (
    <>
      <PageHeader title={title} description={description} />
    <form action="/new-import" method="post" encType="multipart/form-data">
      <div className="mb-3">
        <label className="form-label" htmlFor="contact-files-import">
          Select file to import:
        </label>
        <input
          id="contact-files-import"
          name="file"
          className="form-control form-control-lg"
          type="file"
          onChange={handleFileInputChange}
          required
        />
      </div>

      <div className="row">
        <MappingSelect headers={headers} name="name" label="Name" />
        <MappingSelect headers={headers} name="date_of_birth" label="Date of Birth" />
        <MappingSelect headers={headers} name="phone" label="Phone" />
      </div>
      <div className="row">
        <MappingSelect headers={headers} name="address" label="Address" />
        <MappingSelect headers={headers} name="credit_card_number" label="Credit Card Number" />
        <MappingSelect headers={headers} name="email" label="Email" />
      </div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="saveMappingSwitch"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="saveMappingSwitch">
          Save mapping
        </label>
      </div>
      {isChecked ? (
        <div className="col-md-4">
          <div className="form-floating">
            <input type="text" className="form-control" name="mapping_name" required/>
            <label htmlFor="mapping_name">Mapping name</label>
          </div>
        </div>
      ) : null}

      <div className="row">
        <div className="col-md-12 mb-3">
          <div className="text-end">
            <button className="btn btn-primary" type="submit">
              Import
            </button>
          </div>
        </div>
      </div>
    </form>
    </>
  )
}
