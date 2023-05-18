import registerFormatTime from "./format-time";

const registerDirectives = {
  install: (app) => {
    registerFormatTime(app);
  }
};

export default registerDirectives;
