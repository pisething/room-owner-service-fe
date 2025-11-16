export interface Room {
  // ---- Identifiers & Ownership ----
  id?: string;
  ownerId: string;

  // ---- Basic Info ----
  name: string;
  description?: string;

  // ---- Pricing ----
  price?: number;
  currencyCode: string; // e.g. "USD", "KHR"

  // ---- Property Details ----
  floor?: number;
  roomSize?: number; // square meters
  roomType: RoomType; // SINGLE, DOUBLE, STUDIO
  propertyType: PropertyType; // APARTMENT, HOUSE, etc.

  // ---- Address ----
  address: Address;

  // ---- Amenities ----
  hasFan?: boolean;
  hasAirConditioner?: boolean;
  hasParking?: boolean;
  hasPrivateBathroom?: boolean;
  hasBalcony?: boolean;
  hasKitchen?: boolean;
  hasFridge?: boolean;
  hasWashingMachine?: boolean;
  hasTV?: boolean;
  hasWiFi?: boolean;
  hasElevator?: boolean;

  // ---- Room Rules ----
  maxOccupants?: number;
  isPetFriendly?: boolean;
  isSmokingAllowed?: boolean;
  isSharedRoom?: boolean;
  genderPreference?: GenderPreference;

  // ---- Additional Info ----
  distanceToCenter?: number;
  isUtilityIncluded?: boolean;
  depositRequired?: boolean;
  depositAmount?: number;
  minStayMonths?: number;
  contactPhone: string;

  // ---- Media ----
  photoUrls?: string[];
  videoUrl?: string;
  verifiedListing?: boolean;

  // ---- Availability ----
  status: RoomStatus;
  availableFrom?: string; // ISO string from backend
  availableTo?: string;

  // ---- Audit ----
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;

  // ---- Extra ----
  extraAttributes?: Record<string, any>;
}

// ---------------- Enums ----------------
export type RoomType = 'SINGLE' | 'DOUBLE' | 'STUDIO';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL';
export type GenderPreference = 'MALE' | 'FEMALE' | 'ANY';
export type RoomStatus = 'AVAILABLE' | 'RENTED' | 'HIDDEN';

// ---------------- Nested Types ----------------
export interface Address {
  provinceCode?: string;
  districtCode?: string;
  communeCode?: string;
  villageCode?: string;

  provinceName?: string;
  districtName?: string;
  communeName?: string;
  villageName?: string;

  line1?: string;
  line2?: string;
  postalCode?: string;

  nearbyLandmarks?: string[];
  geo?: GeoLocation;
}

export interface GeoLocation {
  latitude?: number;
  longitude?: number;
}