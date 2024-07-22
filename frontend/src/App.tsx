import { useState } from 'react'
import './App.css'
import { toast, Toaster } from 'sonner'
import { uploadFile } from './services/upload'
import { type Data } from './types'
import Search from './components/Search'

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  READY_UPLOAD: 'ready_upload',
  UPLOADING: 'uploading',
  READY_USAGE: 'ready_usage'
} as const

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {

  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<Data>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []
    
    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) return

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    if (err) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }

    setAppStatus(APP_STATUS.READY_USAGE)
    if (newData) setData(newData)
      
    toast.success('Archivo subido correctamente')
  }

  const showButtom = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  const showForm = appStatus === APP_STATUS.IDLE || appStatus === APP_STATUS.READY_UPLOAD || appStatus == APP_STATUS.UPLOADING
  return (
    <>
      <Toaster  richColors/>
      <header>
        <a href="https://linkin.com">
          <i className='fa fa-github'/>
          <h4>Github</h4>
        </a>
        <h1>Search</h1>
        <p>Challenge: Upload CSV + Search</p>
      </header>
     { showForm &&
     <form onSubmit={handleSubmit} id='form_file'>

        <label htmlFor="">
          <input
            name="file"
            onChange={handleInputChange}
            type="file"
            accept='.csv'
            disabled={appStatus === APP_STATUS.UPLOADING}
          />
        </label>


        {showButtom && (
          <button disabled={appStatus === APP_STATUS.UPLOADING}>
            Subir archivo
          </button>
        )}
      </form>}

      {appStatus === APP_STATUS.READY_USAGE && (
          <Search initialData={data} />
        )}
    </>
  )
}

export default App
