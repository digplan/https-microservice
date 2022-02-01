export default function logout(r, s ,data) {
    if(r.url !== '/logout') return false
    return s.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT').end('logged out')
}