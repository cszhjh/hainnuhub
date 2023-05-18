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
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur"
    },
    {
      min: 4,
      max: 16,
      message: "用户名必须是4～16位",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z0-9_-]{4,16}$/,
      message: "用户名只能包含字母、数字、下划线、减号",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur"
    },
    {
      min: 8,
      max: 16,
      message: "密码必须是8～16位",
      trigger: "blur"
    },
    {
      pattern:
        /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*.]+$)[\da-zA-z~!@#$%^&*.]{8,16}$/,
      message: "密码只能包含字母、数字、特殊符号（~!@#$%^&*.）任意两种组合",
      trigger: "blur"
    }
  ],
  rePassword: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur"
    },
    {
      min: 8,
      max: 16,
      message: "密码必须是8～16位",
      trigger: "blur"
    },
    {
      pattern:
        /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*.]+$)[\da-zA-z~!@#$%^&*.]{8,16}$/,
      message: "密码只能包含字母、数字、特殊符号（~!@#$%^&*.）任意两种组合",
      trigger: "blur"
    }
  ],
  code: [
    {
      required: true,
      message: "验证码不能为空",
      trigger: "blur"
    }
  ]
};

export function validatePassword({ password, rePassword }, formRef) {
  // 验证两次密码一致
  const validatePass = (rule, pass, callback) => {
    if (!pass) {
      callback(new Error("密码不能为空"));
    } else {
      if (rePassword.value) {
        formRef.value.validateField("rePassword", () => {});
      }
      callback();
    }
  };

  const validateConfirm = (rule, rePass, callback) => {
    if (!rePass) {
      callback(new Error("密码不能为空"));
    } else if (rePass !== password.value) {
      callback(new Error("两次密码不一致，请重新输入"));
    } else {
      callback();
    }
  };

  rules.password.push({
    validator: validatePass,
    trigger: "blur"
  });
  rules.rePassword.push({
    validator: validateConfirm,
    trigger: "blur"
  });
}
