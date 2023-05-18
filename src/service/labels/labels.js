import $http from "../index";

export function createLabelRequest({ name }) {
  return $http.post({
    url: "/label",
    data: {
      name
    }
  });
}

export function getLablesRequest(payload) {
  return $http.get({
    url: "/label",
    params: payload
  });
}
