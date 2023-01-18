import { middlewareAdapter } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export const adminAuth = middlewareAdapter(makeAuthMiddleware('admin'))
