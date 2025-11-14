exports.isNumber = function(str) {
    console.log(str);
  return /^-?\d+(\.\d+)?$/.test(str);
}