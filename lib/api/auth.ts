import { ApiError, api, readJson, messageFrom, unwrap } from "./client";
import { clearTokens, getAccessToken, saveTokens, type AuthTokens } from "./tokens";

/** Patient auth — `/api/v1/auth/*` (UserAuthController). */

export type RegisterInput = {
  email: string;
  password: string;
  nickname: string;
  phone?: string;
  lang?: "en" | "ar";
};

/** The patient app has no two-factor flow: an account that answers with a challenge cannot sign in here. */
type LoginResponse = Partial<AuthTokens> & { requires_2fa?: boolean };

function withoutEmpty<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined && v !== null && v !== "")) as Partial<T>;
}

/** The credentials go to the same-origin session route, which keeps the refresh token in an HttpOnly cookie. */
async function session<T>(action: "login" | "register" | "logout", body: unknown, withBearer = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = withBearer ? getAccessToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(`/api/session/${action}`, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  } catch {
    throw new ApiError("Network error — check your connection and retry.", 0);
  }
  const payload = await readJson(res);
  if (!res.ok) throw new ApiError(messageFrom(payload, res.status), res.status, undefined, payload);
  return unwrap<T>(payload);
}

export const authApi = {
  async register(input: RegisterInput) {
    const res = await session<AuthTokens>("register", withoutEmpty(input));
    // The nickname chosen at signup is the name Mira uses, even if the response carries no user.
    const nickname = input.nickname.trim();
    const withUser: AuthTokens = res.user ? res : { ...res, user: { id: "", nickname } };
    if (withUser.user && !withUser.user.nickname) withUser.user = { ...withUser.user, nickname };
    saveTokens(withUser);
    return withUser;
  },

  async login(email: string, password: string) {
    const res = await session<LoginResponse>("login", { email, password });
    if (!res.access_token) throw new Error("This account cannot sign in here.");
    const tokens: AuthTokens = { access_token: res.access_token, user: res.user };
    saveTokens(tokens);
    return tokens;
  },

  async logout() {
    try {
      // The session route also clears the refresh cookie, which only the server can do.
      await session<{ message: string }>("logout", {}, true);
    } finally {
      clearTokens();
    }
  },
};
