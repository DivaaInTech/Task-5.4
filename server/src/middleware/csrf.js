import { doubleCsrf } from 'csrf-csrf';

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: req => req.cookies?.token || '',
  cookieName: 'maintenance.csrf',
  cookieOptions: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' },
  getCsrfTokenFromRequest: req => req.headers['x-csrf-token']
});

export function issueCsrfToken(req, res) {
  res.json({ csrfToken: generateCsrfToken(req, res) });
}

export { doubleCsrfProtection as csrfProtection };
