export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  credit_balance: number;
}

export interface Gym {
  id: number;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
}
