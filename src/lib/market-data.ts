
import { subDays, subMonths, format } from 'date-fns';

const allCropsList = [
  'Apple', 'Apricot', 'Barley', 'Basmati Rice', 'Beans', 'Bell Pepper', 'Bottle Gourd',
  'Brinjal', 'Broccoli', 'Cabbage', 'Carrot', 'Cauliflower', 'Cherry', 'Chilli',
  'Coriander', 'Corn', 'Cucumber', 'Fenugreek', 'Garlic', 'Ginger', 'Guava',
  'Jackfruit', 'Kiwi', 'Lemon', 'Lentil', 'Litchi', 'Mango', 'Millet', 'Mint',
  'Mustard', 'Okra', 'Onion', 'Peach', 'Pear', 'Peas', 'Plum', 'Pomegranate',
  'Potato', 'Pumpkin', 'Radish', 'Ridge Gourd', 'Soybean', 'Spinach', 'Strawberry',
  'Sugarcane', 'Tomato', 'Turmeric', 'Turnip', 'Walnut', 'Wheat'
];

type ChartData = { [key: string]: { [key: string]: { date: string, price: number }[] } };

function generatePrice(base: number, volatility: number) {
    return base + (Math.random() - 0.5) * volatility;
}

function generateChartData() {
    const data: ChartData = {};
    const basePrices: { [key: string]: number } = {
        'Apple': 130, 'Apricot': 90, 'Barley': 25, 'Basmati Rice': 80, 'Beans': 50, 'Bell Pepper': 60,
        'Bottle Gourd': 30, 'Brinjal': 35, 'Broccoli': 70, 'Cabbage': 20, 'Carrot': 40, 'Cauliflower': 25,
        'Cherry': 200, 'Chilli': 50, 'Coriander': 15, 'Corn': 20, 'Cucumber': 20, 'Fenugreek': 18,
        'Garlic': 100, 'Ginger': 120, 'Guava': 60, 'Jackfruit': 40, 'Kiwi': 150, 'Lemon': 40, 'Lentil': 70,
        'Litchi': 100, 'Mango': 80, 'Millet': 30, 'Mint': 15, 'Mustard': 60, 'Okra': 40, 'Onion': 40,
        'Peach': 100, 'Pear': 90, 'Peas': 50, 'Plum': 120, 'Pomegranate': 130, 'Potato': 20, 'Pumpkin': 15,
        'Radish': 20, 'Ridge Gourd': 35, 'Soybean': 50, 'Spinach': 20, 'Strawberry': 150, 'Sugarcane': 10,
        'Tomato': 50, 'Turmeric': 80, 'Turnip': 25, 'Walnut': 400, 'Wheat': 22,
    };

    const today = new Date();

    allCropsList.forEach(crop => {
        const basePrice = basePrices[crop] || 50;
        data[crop] = { "1W": [], "1M": [], "6M": [] };

        // 6 Months Data (Monthly)
        for (let i = 5; i >= 0; i--) {
            data[crop]["6M"].push({
                date: format(subMonths(today, i), 'MMM'),
                price: Math.round(generatePrice(basePrice - (i * 2), 15))
            });
        }

        // 1 Month Data (Weekly)
        for (let i = 3; i >= 0; i--) {
            data[crop]["1M"].push({
                date: `Wk ${4-i}`,
                price: Math.round(generatePrice(basePrice - (i * 1.5), 10))
            });
        }
        
         // 1 Week Data (Daily)
        for (let i = 6; i >= 0; i--) {
            data[crop]["1W"].push({
                date: format(subDays(today, i), 'EEE'),
                price: Math.round(generatePrice(basePrice, 8))
            });
        }
    });

    return data;
}


export const allChartData: ChartData = generateChartData();

export const cropColors: { [key: string]: string } = {
  Tomatoes: "hsl(var(--chart-1))",
  Onions: "hsl(var(--chart-2))",
  Potatoes: "hsl(var(--chart-3))",
  Apples: "hsl(var(--chart-4))",
  Mangoes: "hsl(var(--chart-5))",
  Wheat: "hsl(var(--destructive))",
  Carrot: "hsl(var(--chart-2))",
  Apple: "hsl(var(--chart-1))",
  Apricot: "hsl(var(--chart-2))",
  Barley: "hsl(var(--chart-3))",
  'Basmati Rice': "hsl(var(--chart-4))",
  Beans: "hsl(var(--chart-5))",
  'Bell Pepper': "hsl(var(--chart-1))",
  'Bottle Gourd': "hsl(var(--chart-2))",
  Brinjal: "hsl(var(--chart-3))",
  Broccoli: "hsl(var(--chart-4))",
  Cabbage: "hsl(var(--chart-5))",
  Cauliflower: "hsl(var(--chart-1))",
  Cherry: "hsl(var(--chart-2))",
  Chilli: "hsl(var(--chart-3))",
  Coriander: "hsl(var(--chart-4))",
  Corn: "hsl(var(--chart-5))",
  Cucumber: "hsl(var(--chart-1))",
  Fenugreek: "hsl(var(--chart-2))",
  Garlic: "hsl(var(--chart-3))",
  Ginger: "hsl(var(--chart-4))",
  Guava: "hsl(var(--chart-5))",
  Jackfruit: "hsl(var(--chart-1))",
  Kiwi: "hsl(var(--chart-2))",
  Lemon: "hsl(var(--chart-3))",
  Lentil: "hsl(var(--chart-4))",
  Litchi: "hsl(var(--chart-5))",
  Millet: "hsl(var(--chart-1))",
  Mint: "hsl(var(--chart-2))",
  Mustard: "hsl(var(--chart-3))",
  Okra: "hsl(var(--chart-4))",
  Peach: "hsl(var(--chart-5))",
  Pear: "hsl(var(--chart-1))",
  Peas: "hsl(var(--chart-2))",
  Plum: "hsl(var(--chart-3))",
  Pomegranate: "hsl(var(--chart-4))",
  Pumpkin: "hsl(var(--chart-5))",
  Radish: "hsl(var(--chart-1))",
  'Ridge Gourd': "hsl(var(--chart-2))",
  Soybean: "hsl(var(--chart-3))",
  Spinach: "hsl(var(--chart-4))",
  Strawberry: "hsl(var(--chart-5))",
  Sugarcane: "hsl(var(--chart-1))",
  Turmeric: "hsl(var(--chart-2))",
  Turnip: "hsl(var(--chart-3))",
  Walnut: "hsl(var(--chart-4))"
};


export type CropName = keyof typeof allChartData;
export type Timeframe = "1W" | "1M" | "6M";
