import $http from "../index";

export function loginRequest(account) {
  return $http.post({
    url: "/login",
    data: account,
    showLoading: false
  });
}

export function logoutRequest() {
  return $http.post({
    url: "/logout",
    showMessage: false
  });
}

export function registerRequest(account) {
  return $http.post({
    url: "/users",
    data: account,
    showLoading: false
  });
}

export function resetPasswordRequest(account) {
  return $http.patch({
    url: "/users/forgot",
    data: account,
    showLoading: false
  });
}

export function sendEmailCodeRequest(account) {
  return $http.post({
    url: "/sendEmailCode",
    data: account,
    showLoading: false
  });
}

export function updateUserInfoRequest(payload) {
  return $http.patch({
    url: "/users/update",
    data: payload,
    showLoading: false,
    showMessage: payload.type !== false
  });
}

export function getUserInfoRequest({ userId }) {
  return $http.get({
    url: `/users/${userId}/info`,
    showLoading: false
  });
}

export function getUserForumInfoRequest({ userId, currentUserId, type }) {
  return $http.get({
    url: `/users/${userId}/forum`,
    params: { type, currentUserId },
    showLoading: false
  });
}

export function getMessageCountRequest() {
  return $http.get({
    url: "/users/message",
    showLoading: false,
    showMessage: false
  });
}

export function updateMessageStateRequest({ messageType, offset, size }) {
  return $http.patch({
    url: `/users/message/${messageType}`,
    data: {
      offset,
      size
    },
    showLoading: false
  });
}

export function verifyLoginStateRequest() {
  return $http.get({
    url: "/test",
    showLoading: false,
    showMessage: false
  });
}
