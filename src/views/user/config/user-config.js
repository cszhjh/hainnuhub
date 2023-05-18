import { updateUserInfoRequest } from "@/service/user/user";

export const rules = {
  username: [
    {
      min: 3,
      max: 16,
      trigger: "blur",
      message: "昵称长度为3~16位"
    }
  ],
  description: [
    {
      max: 50,
      trigger: "blur",
      message: "最多输入50个字"
    }
  ]
};

export const validateUsername = (formData, oldUsername, showEditUsername) => {
  const validateExists = async (rule, username, callback) => {
    if (username === "" || username === oldUsername.value) {
      formData.value.username = oldUsername.value;
      showEditUsername.value = false;
      callback();
      return;
    }

    try {
      await updateUserInfoRequest({
        username: formData.value.username,
        type: false
      });
      showEditUsername.value = false;
    } catch (error) {
      callback(new Error("昵称已存在"));
    }
  };

  rules.username.push({
    validator: validateExists,
    trigger: "blur"
  });
};
