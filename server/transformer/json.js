module.exports = {
  contentType: 'application/json; charset=utf-8',
  format(rows) {
    return JSON.stringify(rows, null, 2);
  }
};
