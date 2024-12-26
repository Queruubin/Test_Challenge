import { describe, it, expect,  } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import Search from '../components/Search'

describe('<App/>', () => {
  it('Component app render', () => {
    render(<App />)

    const h1 = screen.getByText('Upload CSV + Search')

    expect(h1).toBeInTheDocument()
  })

  it('Select file and upload file', async () => {
    render(<App />)

    const csvFile = new File(['ID,Nombre,Edad,Ciudad\n1,Juan,25,Barcelona\n2,María,30,Madrid'], 'data.csv', { type: 'text/csv' });
    const inputElement = screen.getByTestId('file-input')
    
    fireEvent.change(inputElement, { target: { files: [csvFile]}})
    const label = screen.getByTestId('label-file')
    const submitButton = screen.getByTestId('button-file')

    expect(submitButton).toBeInTheDocument()
    expect(label).toHaveTextContent('data.csv')

    act(() => {
      fireEvent.click(submitButton)
    })

    const cards_containers = await waitFor(() => screen.getAllByTestId('card-container')) 
    
    expect(cards_containers).toHaveLength(5)

    const input_search = screen.getByTestId('input-search')
    expect(input_search).toBeInTheDocument()

    act(() => {
      fireEvent.input(input_search, { target: { value: 'J' }})
    })

    await waitFor(() => {
      const cards = screen.queryAllByTestId('card-container')
      expect(cards).toHaveLength(1)
    })

  })

  it('Search not match data', async () => {
    const mockData = [
      { id: '1', nombre: "Juan", edad: '25', ciudad: "Barcelona" },
      { id: '2', nombre: "María", edad: '30', ciudad: "Madrid" },
      { id: '3', nombre: "Carlos", edad: '28', ciudad: "Sevilla" },
      { id: '4', nombre: "Ana", edad: '22', ciudad: "Valencia" },
      { id: '5', nombre: "Luis", edad: '35', ciudad: "Bilbao" },
    ]
  
    render(<Search initialData={mockData} />)

    const input_search = screen.getByTestId('input-search')
    expect(input_search).toBeInTheDocument()

    act(() => {
      fireEvent.input(input_search, { target: { value: 'Fernanda' }})
    })
    const text_error = await waitFor(() => screen.getByTestId('text_no_data'))

    expect(text_error).toBeInTheDocument()
  })


})