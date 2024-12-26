import './Card.css'

export function Card({data}: {data:Record<string, string>}) {
  
  return (
    <section className="container_data_cards" data-testid="card-container">
      {Object.entries(data).map(([key, value]) => (
        <div className="div_info" key={key}>
          <h5>{key}:</h5>
          <p data-testid="p-values">{value}</p>
        </div>
      ))}
    </section>
  )
}