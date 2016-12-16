
// Websockets actions

export function wsConnectionFailed() {
  return {
    type: 'WS_CONNECTION_FAILED'
  };
}

export function wsReceivedMessage(message) {
  return {
    type: 'WS_RECEIVED_MESSAGE',
    message
  };
}

export function wsHandshakeFailed() {
  return {
    type: 'WS_HANDSHAKE_FAILED'
  };
}

export function wsConnectionReady(connection) {
  return {
    type: 'WS_CONNECTION_READY',
    connection
  };
}

// Timer+project data fetch actions

export function makeTimersStale() {
  return {
    type: 'MAKE_TIMERS_STALE'
  }
}

export function requestTimersAndProjects() {
  return {
    type: 'REQUEST_TIMERS_PROJECTS'
  }
}

export function receiveTimersAndProjects(entities) {
  return {
    type: 'RECEIVE_TIMERS_PROJECTS',
    entities
  }
}

export function requestTimersAndProjectsFailed() {
  return {
    type: 'REQUEST_TIMERS_PROJECTS_FAILED'
  }
}

// User auth actions

export function userSignedIn(googleUser) {
  return {
    type: 'USER_SIGNED_IN',
    googleUser
  };
}

// Project actions

export function projectCreated(project) {
  return {
    type: 'PROJECT_CREATED',
    project
  }
}

// Status bar actions

export function clearStatusBar() {
  return {
    type: 'CLEAR_STATUS_BAR'
  };
}

export function setStatusBar(message) {
  return {
    type: 'SET_STATUS_BAR',
    message
  };
}

export function setStatusBarTimeout(message, timeoutSeconds) {
  return {
    type: 'SET_STATUS_BAR_TIMEOUT',
    message,
    timeoutSeconds
  };
}
