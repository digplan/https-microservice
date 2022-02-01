const crypto = await import('node:crypto');

const replaceChars = (s) => {
  s = s.replaceAll('=', '');
  s = s.replaceAll('+', '-');
  s = s.replaceAll('/', '_');
  return s;
};

class JWT {
  constructor(private_key) {
    this.key = private_key;
  }
  create(payload) {
    const header = replaceChars(btoa('{"typ":"JWT","alg":"HS256"}'));
    payload = replaceChars(btoa(JSON.stringify(payload)));
    const signature = this.sign(header, payload);
    return `${header}.${payload}.${signature}`;
  }
  sign(header, payload) {
    let signature = crypto.createHmac('sha256', this.key);
    return replaceChars(
      (signature.update(`${header}.${payload}`), signature.digest('base64'))
    );
  }
  verify(jwt) {
    const [header, payload, signature] = jwt.split('.');
    return this.sign(header, payload) === signature ? atob(payload) : false;
  }
}

export { JWT };
