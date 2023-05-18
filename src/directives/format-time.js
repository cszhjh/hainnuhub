import dayjs from "dayjs";
import { getTimestamp } from "@/utils/utils";

export default function registerFormatTime(app) {
  app.directive("format-time", {
    created(el, bindings) {},
    mounted(el, bindings) {
      let formatString = "YYYY-MM-DD HH:mm:ss";
      if (bindings.modifiers.ymd) {
        formatString = "YYYY-MM-DD";
      }
      const date = bindings.value;
      let timestamp = parseInt(getTimestamp(date));
      el.textContent = dayjs(timestamp).format(formatString);
    },
    beforeUpdate(el, bindings) {
      let formatString = "YYYY-MM-DD HH:mm:ss";
      if (bindings.modifiers.ymd) {
        formatString = "YYYY-MM-DD";
      }
      const date = bindings.value;
      let timestamp = parseInt(getTimestamp(date));
      el.textContent = dayjs(timestamp).format(formatString);
    }
  });
}
