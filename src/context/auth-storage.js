const ACCESS_TOKEN_KEY = 'pm-setu.access-token'

export function getAccessToken() {
  try {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAccessToken(token) {
  try {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    throw new Error('Your browser blocked session storage. Enable site storage and try again.')
  }
}

export function clearAccessToken() {
  try {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // The current in-memory session still ends when the provider clears its state.
  }
}
