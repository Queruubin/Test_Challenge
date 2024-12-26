
import '@testing-library/jest-dom'
import handlers from './handlers'
import { setupServer } from 'msw/node'

export const server = setupServer(...handlers)
