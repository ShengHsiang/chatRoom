module.exports = {
  // 编译时校验代码
  lintOnSave: false,
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/demo/css/main.scss` 这个文件
        data: `@import "@/chatRoom/css/_variables.scss";`
      }
    }
  }
}