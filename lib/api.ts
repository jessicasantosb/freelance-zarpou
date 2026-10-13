/**
 * Cliente HTTP unificado para comunicação com a API FastAPI da Zarpou Viagens.
 * Gerencia tokens de autenticação Bearer (Admin, Cliente e B2B Empresa),
 * serialização JSON e tratamento amigável de erros.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return localStorage.getItem("zarpou-admin-token") || null;
  }
  if (path.startsWith("/empresas") || path.startsWith("/corporativo")) {
    return (
      localStorage.getItem("zarpou-company-token") ||
      localStorage.getItem("zarpou-admin-token") ||
      null
    );
  }
  return (
    localStorage.getItem("zarpou-admin-token") ||
    localStorage.getItem("zarpou-customer-token") ||
    localStorage.getItem("zarpou-company-token") ||
    null
  );
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (!options.skipAuth) {
    const token = options.token || getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let message = "Erro inesperado ao comunicar com o servidor.";
    if (typeof data === "object" && data !== null) {
      const errorObj = data as { detail?: string | Array<{ msg?: string }>; message?: string };
      if (typeof errorObj.detail === "string") {
        message = errorObj.detail;
      } else if (Array.isArray(errorObj.detail) && errorObj.detail[0]?.msg) {
        message = errorObj.detail[0].msg;
      } else if (errorObj.message) {
        message = errorObj.message;
      }
    } else if (typeof data === "string" && data.length > 0) {
      message = data;
    }
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),
};

export interface UploadResult {
  success: boolean;
  url: string;
  provider: "aws_s3" | "cloudflare_r2" | "supabase" | "local" | string;
  filename: string;
  folder: string;
  size: number;
  contentType: string;
}

export async function uploadFile(
  file: File,
  folder: string = "banners"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/storage/upload?folder=${encodeURIComponent(folder)}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = "Falha no upload da imagem.";
    try {
      const errData = await response.json();
      if (typeof errData?.detail === "string") {
        errorMsg = errData.detail;
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
