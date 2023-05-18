export const rules = {
  email: [
    {
      required: true,
      message: "邮箱地址不能为空",
      trigger: "blur"
    },
    {
      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
      message: "邮箱格式错误",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur"
    }
  ]
};
