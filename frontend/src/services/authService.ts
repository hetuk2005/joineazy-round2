import { JwtPayload, User } from '../types';

const TOKEN_STORAGE_KEY = 'joineazy_r2_jwt_token';

function toBase64Url(obj: object): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url<T>(str: string): T | null {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const authService = {
  createToken(user: User): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + 60 * 60 * 24 * 7, // 7-day simulated expiry
    };
    const encodedHeader = toBase64Url(header);
    const encodedPayload = toBase64Url(payload);
    // Simulated HMAC signature segment
    const signature = toBase64Url({ sig: `joineazy-${user.id}-${now}` });
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  decodeToken(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = fromBase64Url<JwtPayload>(parts[1]);
    if (!payload || !payload.sub || !payload.exp) return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      this.clearToken();
      return null;
    }
    return payload;
  },

  getActiveSessionPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  },
};
