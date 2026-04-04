// ──────────────────────────────────────────────
// Menu Types
// ──────────────────────────────────────────────

export interface MeasurementType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuItemMeasurement {
  id: string;
  price: number;
  isAvailable: boolean;
  sortOrder: number;
  measurementTypeEntity: MeasurementType;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  preparationTime?: number;
  allergens: string[];
  dietaryInfo: string[];
  isAvailable: boolean;
  imageUrls: string[];
  sortOrder: number;
  categoryId: string;
  hasMeasurements: boolean;
  measurements?: MenuItemMeasurement[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  primaryCategoryId: string;
  menuItems?: MenuItem[];
}

export interface PrimaryCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  categories?: MenuCategory[];
}

// ──────────────────────────────────────────────
// Specials Types
// ──────────────────────────────────────────────

export type SpecialType =
  | "daily"
  | "game_time"
  | "day_time"
  | "chef"
  | "seasonal";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type SpecialCategory = "regular" | "late_night";

export interface Special {
  id: string;
  title: string;
  description?: string;
  type: SpecialType;
  dayOfWeek?: DayOfWeek;
  specialCategory?: SpecialCategory;
  displayStartDate?: string;
  displayEndDate?: string;
  specialStartDate?: string;
  specialEndDate?: string;
  isActive: boolean;
  imageUrls: string[];
  sortOrder: number;
}

// ──────────────────────────────────────────────
// Events Types
// ──────────────────────────────────────────────

export type EventType =
  | "live_music"
  | "sports_viewing"
  | "trivia_night"
  | "karaoke"
  | "private_party"
  | "special_event";

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  displayStartDate?: string;
  displayEndDate?: string;
  eventStartDate: string;
  eventEndDate?: string;
  isActive: boolean;
  imageUrls: string[];
  ticketLink?: string;
}

// ──────────────────────────────────────────────
// Party Menu Types
// ──────────────────────────────────────────────

export type PartyMenuType = "cocktail" | "party";
export type SectionType = "fixed" | "choice" | "family_style" | "variety";

export interface PartyMenuSectionItem {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  isAvailable: boolean;
  sortOrder: number;
}

export interface PartyMenuSection {
  id: string;
  title: string;
  sectionType: SectionType;
  instruction?: string;
  sortOrder: number;
  items: PartyMenuSectionItem[];
}

export interface PartyMenu {
  id: string;
  name: string;
  menuType: PartyMenuType;
  pricePerPerson: number;
  minimumGuests?: number;
  maximumGuests?: number;
  description?: string;
  isActive: boolean;
  imageUrls: string[];
  sortOrder: number;
  sections: PartyMenuSection[];
}

// ──────────────────────────────────────────────
// Stories Types
// ──────────────────────────────────────────────

export interface Story {
  id: string;
  categoryId: string;
  imageUrls: string[];
  isActive: boolean;
  sortOrder: number;
  category?: StoryCategory;
}

export interface StoryCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  stories: Story[];
}

// ──────────────────────────────────────────────
// Opening Hours Types
// ──────────────────────────────────────────────

export interface OpeningHours {
  id: string;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosedNextDay: boolean;
  isOpen: boolean;
  isActive: boolean;
  specialNote?: string;
}

// ──────────────────────────────────────────────
// Newsletter Types
// ──────────────────────────────────────────────

export interface NewsletterSubscribeResponse {
  message: string;
  promoCode?: string;
}

// ──────────────────────────────────────────────
// Navigation Types
// ──────────────────────────────────────────────

export type RootTabParamList = {
  HomeTab: undefined;
  MenuTab: undefined;
  SpecialsTab: undefined;
  EventsTab: undefined;
  MoreTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type MenuStackParamList = {
  MenuCategories: undefined;
  MenuSubCategories: { primaryCategoryId: string; title: string };
  MenuItems: { categoryId: string; title: string };
  MenuItemDetail: { item: MenuItem };
};

export type SpecialsStackParamList = {
  Specials: undefined;
  SpecialDetail: { special: Special };
};

export type EventsStackParamList = {
  Events: undefined;
  EventDetail: { event: Event };
};

export type MoreStackParamList = {
  MoreMenu: undefined;
  About: undefined;
  Contact: undefined;
  PartyMenus: undefined;
  PartyMenuDetail: { partyMenu: PartyMenu };
  Gallery: undefined;
  Stories: undefined;
  StoryViewer: { stories: Story[]; initialIndex: number };
  OpeningHours: undefined;
  Newsletter: undefined;
};
