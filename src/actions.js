
// Websockets actions

export const WS_CONNECTION_FAILED = 'WS_CONNECTION_FAILED';
export function wsConnectionFailed() {
  return {
    type: WS_CONNECTION_FAILED
  };
}

export const WS_RECEIVED_MESSAGE = 'WS_RECEIVED_MESSAGE';
export function wsReceivedMessage(message) {
  return {
    type: WS_RECEIVED_MESSAGE,
    message
  };
}

export const WS_HANDSHAKE_FAILED = 'WS_HANDSHAKE_FAILED';
export function wsHandshakeFailed() {
  return {
    type: WS_HANDSHAKE_FAILED
  };
}

export const WS_CONNECTION_READY = 'WS_CONNECTION_READY';
export function wsConnectionReady(connection) {
  return {
    type: WS_CONNECTION_READY,
    connection
  };
}

// Timer actions

export const MAKE_TIMERS_STALE = 'MAKE_TIMERS_STALE';
export function makeTimersStale() {
  return {
    type: MAKE_TIMERS_STALE
  }
}

export const REQUEST_TIMERS = 'REQUEST_TIMERS';
export function requestTimers() {
  return {
    type: REQUEST_TIMERS
  };
}

export const RECEIVE_TIMERS = 'RECEIVE_TIMERS';
export function receiveTimers(timers) {
  return {
    type: RECEIVE_TIMERS,
    timers
  }
}

export const REQUEST_TIMERS_FAILED = 'REQUEST_TIMERS_FAILED';
export function requestTimersFailed() {
  return {
    type: REQUEST_TIMERS_FAILED
  };
}

// User actions

export const USER_SIGNED_IN = 'USER_SIGNED_IN';
export function userSignedIn(googleUser) {
  return {
    type: USER_SIGNED_IN,
    googleUser
  };
}

export const RECEIVE_LOCAL_USER_DATA = 'RECEIVE_LOCAL_USER_DATA';
export function receiveLocalUserData(userData) {
  return {
    type: RECEIVE_LOCAL_USER_DATA,
    userData
  };
}

export const RECEIVE_ALL_USERS = 'RECEIVE_ALL_USERS';
export function receiveAllUsers(usersData) {
  return {
    type: RECEIVE_ALL_USERS,
    users: usersData
  }
}

// Project actions

export const PROJECT_CREATED = 'PROJECT_CREATED';
export function projectCreated(project) {
  return {
    type: PROJECT_CREATED,
    project
  };
}

export const PROJECT_CREATION_FAILED = 'PROJECT_CREATION_FAILED';
export function projectCreationFailed() {
  return {
    type: PROJECT_CREATION_FAILED
  };
}

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
export function receiveProjects(projects) {
  return {
    type: RECEIVE_PROJECTS,
    projects
  };
}

// Invoice download actions
export const START_INVOICE_DOWNLOAD = 'START_INVOICE_DOWNLOAD';
export function startInvoiceDownload() {
  return {
    type: START_INVOICE_DOWNLOAD
  };
}

export const FINISH_INVOICE_DOWNLOAD = 'FINISH_INVOICE_DOWNLOAD';
export function finishInvoiceDownload() {
  return {
    type: FINISH_INVOICE_DOWNLOAD
  };
}

export const INVOICE_DOWNLOAD_FAILED = 'INVOICE_DOWNLOAD_FAILED';
export function invoiceDownloadFailed() {
  return {
    type: INVOICE_DOWNLOAD_FAILED
  };
}

// Invoice create actions
export const FINISH_INVOICE_DOWNLOAD_AFTER_SAVE = 'FINISH_INVOICE_DOWNLOAD_AFTER_SAVE';
export function finishInvoiceDownloadAfterSave() {
  return {
    type: FINISH_INVOICE_DOWNLOAD_AFTER_SAVE
  };
}

export const INVOICE_DOWNLOAD_FAILED_AFTER_SAVE = 'INVOICE_DOWNLOAD_FAILED_AFTER_SAVE';
export function invoiceDownloadFailedAfterSave() {
  return {
    type: INVOICE_DOWNLOAD_FAILED_AFTER_SAVE
  };
}

export const RECEIVE_ALL_INVOICES = 'RECEIVE_ALL_INVOICES';
export function receiveAllInvoices(invoicesData) {
  return {
    type: RECEIVE_ALL_INVOICES,
    invoices: invoicesData
  }
}

// Status bar actions

export const CLEAR_STATUS_BAR = 'CLEAR_STATUS_BAR';
export function clearStatusBar() {
  return {
    type: CLEAR_STATUS_BAR
  };
}

export const SET_STATUS_BAR = 'SET_STATUS_BAR';
export function setStatusBar(message) {
  return {
    type: SET_STATUS_BAR,
    message
  };
}

export const SET_STATUS_BAR_TIMEOUT = 'SET_STATUS_BAR_TIMEOUT';
export function setStatusBarTimeout(message, timeoutSeconds) {
  return {
    type: SET_STATUS_BAR_TIMEOUT,
    message,
    timeoutSeconds
  };
}
