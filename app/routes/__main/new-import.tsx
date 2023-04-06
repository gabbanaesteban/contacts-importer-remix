import type { CSVHeadersHook } from "~/utils/useCSVHeaders"
import type { PrismaClient } from "@prisma/client"
import type { ActionFunction } from "@remix-run/node"
import type { MappingMap } from "~/types";
import { redirect } from "@remix-run/node"
import { useCSVHeaders } from "~/utils/useCSVHeaders"
import MappingSelect from "~/components/MappingSelect"
import { useEffect, useState } from "react"
import PageHeader from "~/components/PageHeader"
import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { swapObjectProps, validateParams } from "~/utils/helpers"
import { addImportSchema } from "~/schemas/schemas"
import container from "~/ioC/inversify.config"
import { DB_CLIENT } from "~/ioC/constant"
import { nanoid } from "nanoid"
import { ImportStatus } from "~/types"

export function meta() {
  return {
    title: "Add Import",
    description: "Upload a new file with contacts to import",
  }
}

function getUploadHandler() {
  return unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 10_000_000, //10 MB
      file: ({ filename }) => `${nanoid()}*${filename}`,
      directory: "uploads",
      // We don't want to save the file if it's not a csv
      filter: (file) => file.contentType === "text/csv",
    }),
    //This second handler is for fields that are not files.
    // We don't need to parse any other file type, so we can use a memory handler
    // to avoid saving the file to disk but also avoid parsing the big files.
    unstable_createMemoryUploadHandler({ maxPartSize: 5000 })
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(request, getUploadHandler())
  const params = Object.fromEntries(formData.entries())
  const { file, mapping_name: mappingName, ...mapping } = validateParams(params, addImportSchema)

  const promises = []
  const prisma = container.get<PrismaClient>(DB_CLIENT)

  if (mappingName) {
    promises.push(
      prisma.mapping.create({
        data: { ownerId: 1, name: mappingName, map: mapping, createdAt: new Date() },
      })
    )
  }

  promises.push(
    prisma.import.create({
      data: {
        filePath: `${process.env.UPLOADS_DIR}/${file.name}`,
        originalName: file.name.split("*").pop() ?? "",
        mapping: swapObjectProps(mapping),
        status: ImportStatus.ON_HOLD,
        userId: 1,
        createdAt: new Date(),
      },
    })
  )

  await Promise.all(promises)

  return redirect("/imports")
}

export async function loader() {
  const prisma = container.get<PrismaClient>(DB_CLIENT)
  const mappings = await prisma.mapping.findMany({ where: { ownerId: 1 } })

  return {
    mappings,
  }
}

export default function NewImport() {
  const { title, description } = meta()
  const { mappings } = useLoaderData<typeof loader>()
  const [headers, handleFileInputChange]: CSVHeadersHook = useCSVHeaders()
  const [isChecked, setIsChecked] = useState(false)
  const [selectedMapping, setSelectedMapping] = useState<MappingMap | null>(null)

  const handleMappingSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const mappingId = parseInt(event.target.value)
    const mapping = mappings.find((map) => map.id === mappingId)
    console.log(mapping?.map)
    setSelectedMapping(mapping?.map as MappingMap ?? null)
  }

  useEffect(() => {
    if (!headers.length) {
      setSelectedMapping(null)
    }
  }, [headers])


  return (
    <>
      <PageHeader title={title} description={description} />
      <Form action="/new-import" method="post" encType="multipart/form-data">
        <div className="row">
          <div className="mb-3 col-8">
            <input
              id="contact-files-import"
              name="file"
              className="form-control form-control-lg"
              type="file"
              onChange={handleFileInputChange}
              required
            />
          </div>
          <div className="mb-3 col-4">
            <div className="form-floating">
              <select
                className="form-select"
                name="select-mapping"
                onChange={handleMappingSelectChange}
                disabled={!headers.length}
                defaultValue={""}
              >
                <option value="">-- Select a mapping --</option>
                {mappings.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
              <label htmlFor="select-mapping">Mapping</label>
            </div>
          </div>
        </div>

        <div className="row">
          <MappingSelect options={headers} mapping={selectedMapping} name="name" label="Name"/>
          <MappingSelect options={headers} mapping={selectedMapping} name="date_of_birth" label="Date of Birth" />
          <MappingSelect options={headers} mapping={selectedMapping} name="phone" label="Phone" />
        </div>
        <div className="row">
          <MappingSelect options={headers} mapping={selectedMapping} name="address" label="Address" />
          <MappingSelect options={headers} mapping={selectedMapping} name="credit_card_number" label="Credit Card Number" />
          <MappingSelect options={headers} mapping={selectedMapping} name="email" label="Email" />
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
              <input type="text" className="form-control" name="mapping_name" required />
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
      </Form>
    </>
  )
}
