import { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search"
import { toast } from "sonner"
import './Search.css'

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
    <div className="container_data">
      <form className="form_search">
        <input onChange={handleSearch} type="text" placeholder="Buscar informacion..."/>
      </form>

      {data.length > 0 && (
        <div id="container-table">
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map((data, index) => (
                  <th key={index}>{data}</th>
              ))}
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                  <tr key={d.ID} >
                  {Object
                  .entries(d)
                  .map(
                      ([_, value], index) =>
                      <td key={index}>{value}</td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ul className="ul_container_main">
        
        {data.length === 0 && (
          <div id="text_no_data">
            No hat datos coincidentes
          </div>
        )}
      </ul>
    </div>

  )
}