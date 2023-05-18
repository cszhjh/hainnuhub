export function formatSize(size) {
  let data = "";
  if (size < 0.1 * 1024) {
    data = size.toFixed(2) + "B";
  } else if (size < 0.1 * 1024 * 1024) {
    data = (size / 1024).toFixed(2) + "KB";
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    data = (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    data = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
  const sizeString = data + "";
  const length = sizeString.indexOf(".");
  const dec = sizeString.substring(length + 1, length + 3);
  if (dec == "00") {
    return (
      sizeString.substring(0, length) +
      sizeString.substring(length + 3, length + 5)
    );
  }
  return sizeString;
}

export function getTimestamp(date) {
  return new Date(date).getTime();
}

export function debounce(func, delay = 100) {
  let timer = null;
  return function () {
    let that = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func && func.apply(that, args);
    }, delay);
  };
}

export function throttle(func, wait = 100) {
  let lastTime = 0;
  return function () {
    let nowTime = new Date().getTime();
    if (nowTime - lastTime > wait) {
      func && func.apply(this, arguments);
      lastTime = nowTime;
    }
  };
}

export function formatFilename(filename) {
  let resName = "";

  let index = filename.indexOf("·.-@-.·");
  for (let idx in filename) {
    if (idx == index) break;
    resName += filename.charAt(idx);
  }
  return resName;
}

export function dispatchEventStorage() {
  const signSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function (key, val) {
    let setEvent = new Event("setItemEvent");
    setEvent.key = key;
    setEvent.newValue = val;
    window.dispatchEvent(setEvent);
    signSetItem.apply(this, arguments);
  };
}
