// StadiumMind AI - Frontend API Client
// Centralized API client for all backend communication.
// Handles auth, token refresh, error handling, and typed responses.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    path: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const url = `${API_BASE}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      throw new ApiError(error.detail || "API Error", response.status);
    }
    return response.json();
  }

  async login(email: string, password: string) {
    const data = await this.request<{
      data: { access_token: string; role: string; user_id: string };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.data.access_token);
    return data.data;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } catch {
      /* empty */
    }
    this.setToken(null);
  }

  async getMe() {
    return this.request<{
      data: { id: string; name: string; email: string; role: string };
    }>("/auth/me");
  }

  async aiChat(
    messages: { role: string; content: string }[],
    sessionId?: string,
  ) {
    return this.request<{
      data: { response: string; confidence: number; risk_level: string };
    }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        messages,
        session_id: sessionId || "default",
        role: "user",
      }),
    });
  }

  async aiSummary() {
    return this.request<{
      data: {
        headline: string;
        narrative: string;
        risk_level: string;
        key_insights: string[];
      };
    }>("/ai/summary");
  }

  async aiPredictions() {
    return this.request<{
      data: {
        predictions: { zone: string; prediction: string; confidence: number }[];
      };
    }>("/ai/predictions");
  }

  async getOperationsDashboard() {
    return this.request<{ data: any }>("/operations/dashboard");
  }

  async getStadiumData() {
    return this.request<{ data: any }>("/stadium");
  }

  async runSimulation(query: string, scenarioType?: string) {
    return this.request<{ data: any }>("/simulation/run", {
      method: "POST",
      body: JSON.stringify({ query, scenario_type: scenarioType }),
    });
  }
}

export const api = new ApiClient();
export { ApiError };
