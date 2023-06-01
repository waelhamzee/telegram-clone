module.exports = {
  getFileBase64(file, cb) {
    let reader = new FileReader();
    reader.onloadend = function () {
      // var b64 = reader.result.replace(/^data:.+;base64,/, "");
      var b64 = reader.result
      cb(b64);
    };
    reader.readAsDataURL(file);
  },
};
