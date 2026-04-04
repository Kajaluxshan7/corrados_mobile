import { config } from "../config";
import type {
  PrimaryCategory,
  MenuCategory,
  MenuItem,
  Special,
  Event,
  PartyMenu,
  StoryCategory,
  OpeningHours,
  NewsletterSubscribeResponse,
} from "../types";

const BASE_URL = config.apiBaseUrl;

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Network error: Unable to connect to server`);
  }
}

// ──────────────────────────────────────────────
// Menu API
// ──────────────────────────────────────────────

export const menuApi = {
  getPrimaryCategories: () =>
    request<PrimaryCategory[]>("/menu/primary-categories"),

  getCategories: (primaryCategoryId: string) =>
    request<MenuCategory[]>(
      `/menu/categories?primaryCategoryId=${primaryCategoryId}`,
    ),

  getCategoryItems: (categoryId: string) =>
    request<MenuItem[]>(`/menu/categories/${categoryId}/items`),

  getItemById: (id: string) => request<MenuItem>(`/menu/items/${id}`),
};

// ──────────────────────────────────────────────
// Specials API
// ──────────────────────────────────────────────

export const specialsApi = {
  getActive: () => request<Special[]>("/specials/active"),
};

// ──────────────────────────────────────────────
// Events API
// ──────────────────────────────────────────────

export const eventsApi = {
  getActive: () => request<Event[]>("/events/active"),

  getUpcoming: () => request<Event[]>("/events/upcoming"),
};

// ──────────────────────────────────────────────
// Party Menu API
// ──────────────────────────────────────────────

export const partyMenuApi = {
  getAll: () => request<PartyMenu[]>("/party-menu"),

  getById: (id: string) => request<PartyMenu>(`/party-menu/${id}`),
};

// ──────────────────────────────────────────────
// Stories API
// ──────────────────────────────────────────────

export const storiesApi = {
  getCategories: () => request<StoryCategory[]>("/stories/categories"),
};

// ──────────────────────────────────────────────
// Opening Hours API
// ──────────────────────────────────────────────

export const openingHoursApi = {
  getAll: () => request<OpeningHours[]>("/opening-hours"),
};

// ──────────────────────────────────────────────
// Newsletter API
// ──────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (email: string) =>
    request<NewsletterSubscribeResponse>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

// ──────────────────────────────────────────────
// Image URL Helper
// ──────────────────────────────────────────────

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
