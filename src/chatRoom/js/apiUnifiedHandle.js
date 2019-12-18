var unifiedHandle = function (options = {}) {
  if (options.store) {
    this.$store = options.store;
  }
  if (options.router) {
    this.$router = options.router;
  }
}
unifiedHandle.prototype.resetConfigHeaders = function (headers) {
  headers['appId'] = 'mofei';
  return headers;
};
unifiedHandle.prototype.handleEspecialErrCode = function (resopnse) {
  if (resopnse.code === '000009') {
    // this.$router.push("/login")
    window.location.href = "/login"
  }
};

export default function (options) {
  return new unifiedHandle(options);
}