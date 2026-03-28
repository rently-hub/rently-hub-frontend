export interface RentalInfo {
  rental_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  guest_name: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price_per_day: number;
  address: string;
  cleaning_fee: number;
  max_guests: number;
  photo_url: string | null;
  ical_url: string | null;
  owner_id: number;
  status: "Disponivel" | "Ocupada";
  current_rental?: RentalInfo | null;
  sync_token?: string | null;
  export_url?: string | null;
  platform_fee_percentage: number;
  property_type: 'seasonal' | 'fixed';
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price_per_day: number;
  address: string;
  cleaning_fee: number;
  max_guests: number;
  photo_url: string;
  ical_url: string;
  platform_fee_percentage: number;
  property_type: 'seasonal' | 'fixed';
}

export interface Rental {
  id: number;
  property_id: number;
  start_date: string;
  end_date: string;
  guest_count: number;
  total_price: number;
  status: string;
  platform_source: string;
  is_external?: boolean;
  is_paid?: boolean;
  paid_at?: string | null;
  external_uid?: string;
  property?: Property;
}

export interface Expense {
  id: number;
  property_id: number;
  expense_title: string;
  category: string;
  amount: number;
  pay_date: string;
  description?: string;
  property?: Property;
}
