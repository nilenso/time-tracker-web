import Request from 'superagent';
import Immutable from 'immutable';

export function makeTimersStale() {
  return {
    type: 'MAKE_TIMERS_STALE'
  }
}

export function requestTimers() {
  return {
    type: 'REQUEST_TIMERS'
  }
}

export function receiveTimersAndProjects(entities) {
  return {
    type: 'RECEIVE_TIMERS_PROJECTS',
    entities
  }
}

export function requestTimersFailed() {
  return {
    type: 'REQUEST_TIMERS_FAILED'
  }
}

function getProjectFromTimer(timer, authToken) {
  const url = 'http://localhost:8000/api/projects/' + timer['project-id'] + '/'
  return Request
          .get(url)
          .set('Authorization', 'Bearer ' + authToken)
          .then((response) => {
            return response.body
          })
}

function normalizeArray(items) {
  return Immutable.fromJS(items)
                  .reduce((normalMap, item) => {
                    return normalMap.set(item.get('id'), item)
                  }, Immutable.Map({}))
}

export function fetchTimers(authToken) {
  return (dispatch) => {
    dispatch(requestTimers())

    Request
      .get('http://localhost:8000/api/timers/')
      .set('Authorization', 'Bearer ' + authToken)
      .then((response) => {
        const timers = response.body

        return Promise.all(timers.map((timer) => {
          return getProjectFromTimer(timer, authToken)
        }))
        .then((projects) => {
          const normalizedTimers = normalizeArray(timers)
          const normalizedProjects = normalizeArray(projects)
          dispatch(receiveTimersAndProjects(Immutable.Map({
            timers: normalizedTimers,
            projects: normalizedProjects
          })))
        })
      })
      .catch((reason) => {
        dispatch(requestTimersFailed())
      })
  }
}

export function userSignedIn(googleUser) {
  return {
    type: 'USER_SIGNED_IN',
    googleUser
  };
}
