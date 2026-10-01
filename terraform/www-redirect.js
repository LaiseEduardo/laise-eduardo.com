function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  if (host.indexOf('www.') !== 0) return request;
  var qs = Object.keys(request.querystring).map(function (k) {
    var q = request.querystring[k];
    return q.value === '' ? k : k + '=' + q.value;
  }).join('&');
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: 'https://' + host.slice(4) + request.uri + (qs ? '?' + qs : '') } }
  };
}
