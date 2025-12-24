export interface Property {
  id: number;
  title: string;
  description: string;
  price_per_day: number;
  address: string;
  cleaning_fee: number;
  max_guests: number;
  photo_url: string | null;
  owner_id: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price_per_day: number;
  address: string;
  cleaning_fee: number;
  max_guests: number;
  photo_url: string;
}
