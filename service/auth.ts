export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  type?: string;
  user?: any;
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface RegisterResponse {
  token?: string; // assuming backend returns token
  accessToken?: string; // alternative naming
  user?: any; // shape unknown
  message?: string;
  [key: string]: any;
}

/**
 * Register a new user via POST /auth/register
 * Returns parsed JSON or throws on network / HTTP error.
 */
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errMsg = `${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        
        // Prefer 'error' field, then 'message'
        if (errJson?.error) errMsg = errJson.error;
        else if (errJson?.message) errMsg = errJson.message;        
      } catch (_) { /* swallow parse errors */ }
      throw new Error(errMsg);
    }

    const json = await res.json();
    return json as RegisterResponse;
  } catch (e: any) {
    throw new Error(e.message || 'Registration failed');
  }
}

/**
 * Login an existing user via POST /auth/login
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      let errMsg = `${res.status} ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson?.error) errMsg = errJson.error; else if (errJson?.message) errMsg = errJson.message;
      } catch (_) {}
      throw new Error(errMsg);
    }
    const json = await res.json();
    return json as LoginResponse;
  } catch (e: any) {
    throw new Error(e?.message || 'Login failed');
  }
}

/**
 * Fetch current authenticated user using token cookie (client side) or provided token.
 * Assumes backend exposes GET /auth/me returning user object.
 */
export async function getCurrentUser(token?: string): Promise<any | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/profile`, { headers, cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch {
    return null;
  }
}
