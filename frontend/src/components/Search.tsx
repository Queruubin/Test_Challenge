import { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search"
import { toast } from "sonner"
import './Search.css'
import { Card } from "./Card"

export default function Search ({ initialData }: {initialData: Data}) {
  const [data, setData] = useState<Data>(initialData)
  const [search, setSearch] = useState<string>('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    const newPathname = search === ''
    ? window.location.pathname
    : `?q=${search}`

    window.history.pushState({}, ``, newPathname)
  }, [search])

  useEffect(() => {
    if (!search) {
      setData(initialData)
      return
    }

    searchData(search)
    .then(response => {
      const [err, newData] = response
      if (err) return toast.error(err.message)
        
      if (newData) setData(newData)
    })
  }, [search, initialData])

  return (
    <section className="container_data">
      <form className="form_search">
        <input onChange={handleSearch} type="text" data-testid="input-search" placeholder="Buscar informacion..."/>
      </form>

      <div className="container_cards">
        {data.length > 0 && (
          data.map((info, index) => (
            <Card data={info} key={index} />
          ))
        )}
      </div>

      <ul className="ul_container_main">
        
        {data.length === 0 && (
          <div id="text_no_data" data-testid="text_no_data">
            No matching data
          </div>
        )}
      </ul>
    </section>

  )
}