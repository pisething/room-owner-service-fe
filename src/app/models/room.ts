import { GenderPreference, PropertyType, RoomType } from "./enum";
import { RoomLocation } from "./room-location";

export interface Room {
    id?: string;
    name: string;
    price?: number;               // price per month
    floor?: number;
    roomSize?: number;            // square meters

    location?: RoomLocation;

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

    maxOccupants?: number;
    isPetFriendly?: boolean;
    isSmokingAllowed?: boolean;
    isSharedRoom?: boolean;
    genderPreference?: GenderPreference;

    roomType?: RoomType;
    propertyType?: PropertyType;

    distanceToCenter?: number;
    nearbyLandmarks?: string[];

    isUtilityIncluded?: boolean;
    depositRequired?: boolean;
    minStayMonths?: number;

    hasPhotos?: boolean;
    photoCount?: number;
    hasVideoTour?: boolean;

    verifiedListing?: boolean;

    availableFrom?: string;   // ISO string
    availableTo?: string;     // ISO string

    createdAt?: string;
    lastUpdated?: string;

    extraAttributes?: Record<string, any>; 


}

 