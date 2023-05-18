export const rules = {
  title: [
    {
      required: true,
      trigger: "blur",
      message: "请输入标题"
    },
    {
      min: 3,
      max: 30,
      trigger: "blur",
      message: "标题必须为3～30个字符"
    }
  ],
  summary: [
    {
      max: 250,
      trigger: "blur",
      message: "最多250个字"
    }
  ]
};
