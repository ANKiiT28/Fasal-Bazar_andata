export type Crop = {
  id: string;
  name: string;
  variety: string;
  price: number;
  rating: number;
  state: string;
  city: string;
  imageUrl: string;
  isOrganic: boolean;
  freshness: 'fresh' | '1-day-old' | '2-days-old';
  status?: 'Available' | 'Sold Out';
  farmer: {
    name: string;
  };
};

export const priceReasons = {
    high: [
        'Premium organic quality, hand-picked.',
        'Export quality, superior taste.',
        'Hygenically packed, farm-to-door delivery.',
        'Rare heirloom variety, limited stock.'
    ],
    low: [
        'New farmer discount, special introductory price.',
        'Bulk harvest, passing savings to you.',
        'Clearing stock, grab it while it lasts!',
        'Good quality, minor cosmetic blemishes.'
    ],
    standard: [
        'Standard market price for fresh produce.',
        'Fairly priced based on quality and demand.',
        'Consistent quality at a competitive price.'
    ]
}

    

    