export interface Settings {
  _id: string;
  userId: string;
  inventory: {
    defaultMinStock: number;
  };
  currency: string;
  createdAt: string;
  updatedAt: string;
}
