export interface ChargingStation {
  id?: string;
  lngLat: [number, number];
  name: string;
  status: string;
  type: string;
  power: string;
  rating: number;
  reviews: number;
  connectors: number;
  connectorTypes: string[];
  address: string;
  hours: string;
  brand: string;
  price?: number;
  isFavorite?: boolean;
  image_url?: string;
  amenities: {
    restaurant: boolean;
    wifi: boolean;
    bathroom: boolean;
    parking: boolean;
    shop: boolean;
  };
}

export interface ChargingHistory {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  duration: string;
  energy: number;
  cost: number;
}

export interface UserReview {
  id: string;
  stationId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
