import { api } from "./client";
import { clearTokens, saveTokens, type AuthTokens } from "./tokens";

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

export const authApi = {
  async register(input: RegisterInput) {
    const res = await api.post<AuthTokens>("/auth/register", withoutEmpty(input), { auth: false });
    // The nickname chosen at signup is the name Mira uses, even if the response carries no user.
    const nickname = input.nickname.trim();
    const withUser: AuthTokens = res.user ? res : { ...res, user: { id: "", nickname } };
    if (withUser.user && !withUser.user.nickname) withUser.user = { ...withUser.user, nickname };
    saveTokens(withUser);
    return withUser;
  },

  async login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/auth/login", { email, password }, { auth: false });
    if (!res.access_token || !res.refresh_token) throw new Error("This account cannot sign in here.");
    const tokens: AuthTokens = { access_token: res.access_token, refresh_token: res.refresh_token, user: res.user };
    saveTokens(tokens);
    return tokens;
  },

  async logout() {
    try {
      await api.post<{ message: string }>("/auth/logout");
    } finally {
      clearTokens();
    }
  },
};
