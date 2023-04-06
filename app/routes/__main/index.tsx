import type { PrismaClient } from "@prisma/client"
import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { composeSkipAndTakeFromPageAndLimit, searchParamsToObject, validateParams } from "~/utils/helpers"
import { listContactsSchema } from "~/schemas/schemas"
import Pagination from "~/components/Pagination"
import container from "~/ioC/inversify.config"
import { DB_CLIENT } from "~/ioC/constant"
import PageHeader from "~/components/PageHeader"

export function meta() {
  return {
    title: "Contacts",
    description: "List of contacts successfully imported.",
  }
}

export async function loader ({ request }: LoaderArgs) {
  const params = searchParamsToObject(new URL(request.url).searchParams)
  const { limit, page } = validateParams(params, listContactsSchema)
  const { skip, take } = composeSkipAndTakeFromPageAndLimit({ page, limit })

  const prisma = container.get<PrismaClient>(DB_CLIENT)

  const contacts = await prisma.contact.findMany({ skip, take })

  const hasMore = contacts.length > limit
  const items = hasMore ? contacts.slice(0, -1) : contacts

  return {
    contacts: items,
    pagination: {
      hasMore,
      filters: { limit, page },
    },
  }
}

export default function Contacts() {
  const { contacts, pagination: { filters, hasMore } } = useLoaderData<typeof loader>()
  const { title, description } = meta()

  return (
    <>
      <PageHeader title={title} description={description} />

      <Pagination hasMore={hasMore} filters={filters} />

      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Credit Card Number</th>
              <th>Credit Card Network</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </td>
                <td>{contact.dateOfBirth}</td>
                <td>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </td>
                <td>{contact.address}</td>
                <td>**** **** **** {contact.creditCardLast4} </td>
                <td>{contact.creditCardNetwork}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
