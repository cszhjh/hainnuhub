import $http from "../index";
import { interceptors } from "../config";

const headers = {
  "Content-Type": "Multipart/form-data"
};

export function uploadAvatar({ avatar }) {
  const formData = new FormData();
  formData.append("avatar", avatar ?? "");
  return $http.post({
    url: "/upload/avatar",
    headers,
    data: formData,
    interceptors
  });
}

// picture: Array(File)
export function uploadPicture({ forumId, commentId, picture, cover = 0 }) {
  const url = `/upload${forumId ? `/${forumId}` : ""}${
    commentId ? `/${commentId}` : ""
  }/picture`;
  const formData = new FormData();
  if (Object.prototype.toString.call(picture) === "[object Array]") {
    for (let value of picture) {
      formData.append("picture", value, value.name);
    }
  } else {
    formData.append("picture", picture, picture.name);
  }

  return $http.post({
    url,
    headers,
    data: formData,
    params: {
      cover
    },
    interceptors
  });
}

export function uploadAttachmentRequest({ attachment, forumId }) {
  const formData = new FormData();
  formData.append("attachment", attachment ?? "");
  return $http.post({
    url: `/upload/${forumId}/attachment`,
    headers,
    data: formData,
    params: {
      filename: attachment.name
    },
    interceptors
  });
}
