
import'@testing-library/jest-dom'

import { http } from 'msw'

const mockData = [
  { id: 1, nombre: "Juan", edad: 25, ciudad: "Barcelona" },
  { id: 2, nombre: "María", edad: 30, ciudad: "Madrid" },
  { id: 3, nombre: "Carlos", edad: 28, ciudad: "Sevilla" },
  { id: 4, nombre: "Ana", edad: 22, ciudad: "Valencia" },
  { id: 5, nombre: "Luis", edad: 35, ciudad: "Bilbao" },
]


const handlers = [
  
  http.get('http://localhost:3000/api/users', ({ request }) => {
    const p = new URL (request.url).searchParams.get('q')  
  
    const filteredUsers = mockData.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(p.toLowerCase())
      );
    });
    
    
    return new Response(JSON.stringify({ data: filteredUsers }), {
      status: 200
    })
  }),
  http.post('http://localhost:3000/api/files', () => {
  
    return new Response(JSON.stringify({data:mockData }), {
      status: 200
    })
  })

]

export default handlers