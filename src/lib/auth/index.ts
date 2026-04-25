/**
 * Public surface of the auth module. All admin code imports from here.
 */

export {
  getSession,
  getSessionFromRequest,
  isAuthenticated,
  requireAdmin,
  requireAdminAction,
  NotAuthenticatedError,
} from './session'
export type { AdminSession } from './session'

export { hashPassword, verifyPassword } from './password'
export { checkLogin, getConfiguredAdmin } from './credentials'
