module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "prismjs",
      {
        languages: [
          "js",
          "javascript",
          "css",
          "markup",
          "c",
          "cpp",
          "php",
          "java",
          "go",
          "django",
          "python",
          "py",
          "typescript",
          "ts",
          "shell",
          "csharp",
          "basic",
          "json",
          "mongodb",
          "objc",
          "jsx",
          "tsx",
          "sass",
          "scss",
          "sql"
        ],

        plugins: ["line-numbers"],

        theme: "okaidia",

        css: true
      }
    ]
  ]
};
