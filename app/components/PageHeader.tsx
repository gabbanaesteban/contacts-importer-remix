type PageHeaderProps = {
  title: string
  description: string
}

export default function PageHeader(props: PageHeaderProps) {
  const { title, description } = props
  
  return (
    <div className="p-3 mt-3 pb-md-4 mx-auto">
      <h1 className="display-6 fw-normal">{ title }</h1>
      <p className="fs-5 text-muted">{ description }</p>
    </div>
  )
}
