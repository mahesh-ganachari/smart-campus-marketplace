export type Category = 'Books' | 'Electronics' | 'Lab Equipment';

export interface Profile {
  id: string;
  full_name: string;
  roll_number: string;
  mobile_number?: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  image_url?: string | null;
  created_at: string;
  seller?: Profile;
}
