/**
 * Public surface of the auth module. All admin code imports from here.
 */

export {
  isAuthenticated,
  requireAdmin,
  requireAdminAction,
  NotAuthenticatedError,
} from './session'
