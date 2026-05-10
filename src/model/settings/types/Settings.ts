export interface Settings {
  _id: string;
  userId: string;
  inventory: {
    defaultMinStock: number;
  };
  createdAt: string;
  updatedAt: string;
}
