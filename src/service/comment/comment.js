import $http from "../index";
import { interceptors } from "../config";

export function releaseCommentRequest(payload) {
  return $http.post({
    url: "/comment",
    data: payload,
    showLoading: false,
    interceptors
  });
}

export function replyCommentRequest({ forumId, commentId, content, image }) {
  return $http.post({
    url: "/comment/" + commentId + "/reply",
    data: { forumId, content, image },
    showLoading: false,
    interceptors
  });
}

export function updateCommentRequest({ commentId, content }) {
  return $http.get({
    url: "/comment/" + commentId,
    data: { content },
    interceptors
  });
}

export function removeCommentRequest({ commentId }) {
  return $http.delete({
    url: "/comment/" + commentId,
    interceptors
  });
}

export function getCommentRequest({ userId, forumId, type = 0 }) {
  return $http.get({
    url: "/comment",
    showLoading: false,
    params: { userId, forumId, type }
  });
}

export function doLikeRequest({ forumId, commentId }) {
  return $http.post({
    url: `/comment/${commentId}/dolike`,
    params: {
      forumId
    },
    showLoading: false,
    interceptors
  });
}

export function updateTopType({ forumId, commentId, type }) {
  return $http.patch({
    url: `/comment/${forumId}/${commentId}/top`,
    data: {
      type
    },
    showLoading: false,
    interceptors
  });
}
