function myCors(req, res, next) {
  const allowedOrigin = [
    'https://mest.michelle.nomoredomains.club',
    'http://mest.michelle.nomoredomains.club',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://84.201.129.89',
    'https://84.201.129.89',
  ];

  const allowedMethods = 'GET,PUT,HEAD,PATCH,DELETE,POST';
  const allowedHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;

  if (allowedOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', allowedHeaders);
    res.header('Access-Control-Allow-Credentials', true); // remove later
    res.end();
  }

  next();
}

module.exports = {
  myCors,
};
