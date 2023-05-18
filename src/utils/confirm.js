import { ElMessageBox } from "element-plus";

const confirm = (message, confirmFn, cancelFn, type = "info") => {
  ElMessageBox.confirm(message, "提示", {
    "confirm-button-text": "确定",
    "cancel-button-class": "取消",
    type
  })
    .then(async () => {
      confirmFn && confirmFn();
    })
    .catch((err) => {
      cancelFn && cancelFn(err);
    });
};

export default confirm;
