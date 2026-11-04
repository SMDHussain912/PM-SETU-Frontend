import test from 'node:test'
import assert from 'node:assert/strict'
import { getRouteAccess } from '../../src/lib/route-access.js'

const aipUser = {
  roles: [{ code: 'aip_user' }],
  permissions: [],
}

const spvUser = {
  roles: [{ code: 'spv_user' }],
  permissions: [],
}

const adminUser = {
  roles: [{ code: 'state_pmu_admin' }],
  permissions: ['documents.read', 'documents.publish'],
}

function access(user, roles, permissions) {
  return getRouteAccess({
    loading: false,
    isAuthenticated: Boolean(user),
    user,
    roles,
    permissions,
  })
}

test('AIP-only user can access the AIP workspace', () => {
  assert.equal(access(aipUser, ['aip_user']), 'allowed')
})

test('SPV-only user can access the SPV workspace', () => {
  assert.equal(access(spvUser, ['spv_user']), 'allowed')
})

test('AIP-only user is denied SPV and ITI workspaces', () => {
  assert.equal(access(aipUser, ['spv_user']), 'forbidden')
  assert.equal(access(aipUser, ['hub_iti_user', 'spoke_iti_user']), 'forbidden')
})

test('SPV-only user is denied AIP and ITI workspaces', () => {
  assert.equal(access(spvUser, ['aip_user']), 'forbidden')
  assert.equal(access(spvUser, ['hub_iti_user', 'spoke_iti_user']), 'forbidden')
})

test('unauthenticated users are directed to the login state', () => {
  assert.equal(access(null, ['aip_user']), 'unauthenticated')
})

test('loading state takes precedence while the session is being checked', () => {
  assert.equal(getRouteAccess({
    loading: true,
    isAuthenticated: false,
    user: null,
  }), 'loading')
})

test('administrator roles retain access when included in the route contract', () => {
  assert.equal(access(adminUser, ['state_pmu_admin', 'super_admin']), 'allowed')
})

test('all required permissions must be present', () => {
  assert.equal(access(adminUser, undefined, ['documents.read']), 'allowed')
  assert.equal(access(adminUser, undefined, ['documents.read', 'documents.delete']), 'forbidden')
})
