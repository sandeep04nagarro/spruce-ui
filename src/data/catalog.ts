export type Tint = 'pink' | 'cream' | 'lime' | 'peach' | 'lilac' | 'sky' | 'mint';

export const TINT_BG: Record<Tint, string> = {
  pink: 'bg-p-pink',
  cream: 'bg-p-cream',
  lime: 'bg-p-lime',
  peach: 'bg-p-peach',
  lilac: 'bg-p-lilac',
  sky: 'bg-p-sky',
  mint: 'bg-p-mint',
};

export const TINT_HEX: Record<Tint, string> = {
  pink: '#ffe3e6',
  cream: '#fff1cc',
  lime: '#e3f6cd',
  peach: '#ffe4d2',
  lilac: '#ebe5ff',
  sky: '#dceeff',
  mint: '#d6ede1',
};

export type CategoryId = 'fruits' | 'vegetables' | 'bakery' | 'dairy' | 'meat' | 'pantry' | 'drinks' | 'sweets';

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
  img: string;
  /** extra art for the collection cards */
  art: string[];
  tint: Tint;
  count: number;
  from: number;
}

export const CATEGORIES: Category[] = [
  { id: 'fruits', name: 'Fresh Fruits', short: 'Fruits', img: 'apple', art: ['basket', 'apple', 'banana'], tint: 'pink', count: 48, from: 1.99 },
  { id: 'vegetables', name: 'Farm Vegetables', short: 'Veggies', img: 'broccoli', art: ['leafy-green', 'carrot', 'tomato'], tint: 'lime', count: 62, from: 0.99 },
  { id: 'bakery', name: 'Bakery & Snacks', short: 'Bakery', img: 'bread', art: ['bread', 'croissant', 'baguette'], tint: 'cream', count: 36, from: 2.2 },
  { id: 'dairy', name: 'Dairy & Eggs', short: 'Dairy', img: 'egg', art: ['milk', 'egg', 'cheese'], tint: 'sky', count: 29, from: 1.89 },
  { id: 'meat', name: 'Meat & Fish', short: 'Meat', img: 'meat', art: ['meat', 'fish', 'shrimp'], tint: 'peach', count: 24, from: 4.49 },
  { id: 'pantry', name: 'Pantry & Oils', short: 'Pantry', img: 'honey', art: ['honey', 'jar', 'rice'], tint: 'cream', count: 51, from: 1.19 },
  { id: 'drinks', name: 'Beverages', short: 'Drinks', img: 'juice', art: ['juice', 'soda', 'coffee'], tint: 'lilac', count: 33, from: 1.25 },
  { id: 'sweets', name: 'Sweets & Treats', short: 'Treats', img: 'doughnut', art: ['doughnut', 'cupcake', 'cookie'], tint: 'pink', count: 22, from: 2.99 },
];

export interface Product {
  id: string;
  name: string;
  img: string;
  unit: string;
  price: number;
  oldPrice?: number;
  category: CategoryId;
  tint: Tint;
  rating: number;
  reviews: number;
  badge?: 'New' | 'Hot' | 'Organic';
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  origin: string;
  desc?: string;
}

type Row = [
  id: string,
  name: string,
  unit: string,
  price: number,
  tint: Tint,
  kcal: number,
  macros: [number, number, number],
  extra?: Partial<Pick<Product, 'oldPrice' | 'badge' | 'desc' | 'img'>>,
];

const ROWS: Record<CategoryId, Row[]> = {
  fruits: [
    ['apple', 'Natural Red Apple', '1 kg', 4.99, 'pink', 52, [0.3, 14, 0.2], { oldPrice: 5.99, badge: 'Organic', desc: 'Crisp, honey-sweet apples hand-picked at peak ripeness from family orchards in the Hudson Valley. Perfect for snacking, baking or slicing into a fresh salad.' }],
    ['strawberry', 'Sweet Strawberries', '250 g', 3.99, 'pink', 32, [0.7, 8, 0.3], { badge: 'New' }],
    ['banana', 'Organic Bananas', '6 pcs', 2.99, 'cream', 89, [1.1, 23, 0.3], { badge: 'Organic' }],
    ['mango', 'Alphonso Mango', '2 pcs', 5.99, 'peach', 60, [0.8, 15, 0.4], { badge: 'Hot', oldPrice: 7.49 }],
    ['grapes', 'Seedless Grapes', '500 g', 4.29, 'lilac', 69, [0.7, 18, 0.2]],
    ['avocado', 'Hass Avocado', '2 pcs', 3.49, 'lime', 160, [2, 9, 15]],
    ['green-apple', 'Granny Smith Apple', '1 kg', 4.49, 'lime', 58, [0.4, 14, 0.2]],
    ['watermelon', 'Mini Watermelon', '1 pc', 5.49, 'lime', 30, [0.6, 8, 0.2]],
    ['pineapple', 'Golden Pineapple', '1 pc', 3.79, 'cream', 50, [0.5, 13, 0.1]],
    ['peach', 'Juicy Peaches', '4 pcs', 4.79, 'peach', 39, [0.9, 10, 0.3]],
    ['cherries', 'Dark Cherries', '300 g', 6.49, 'pink', 63, [1.1, 16, 0.2], { oldPrice: 7.99 }],
    ['blueberries', 'Wild Blueberries', '125 g', 3.99, 'sky', 57, [0.7, 14, 0.3]],
    ['lemon', 'Amalfi Lemons', '4 pcs', 1.99, 'cream', 29, [1.1, 9, 0.3]],
    ['tangerine', 'Mandarins', '1 kg', 3.29, 'peach', 53, [0.8, 13, 0.3]],
    ['kiwi', 'Kiwi Fruit', '4 pcs', 2.49, 'lime', 61, [1.1, 15, 0.5]],
  ],
  vegetables: [
    ['bell-pepper', 'Red Bell Pepper', '1 kg', 3.88, 'pink', 31, [1, 6, 0.3], { desc: 'Thick-walled, sweet red peppers grown in sun-soaked greenhouses. Roast them, stuff them, or crunch them raw.' }],
    ['broccoli', 'Broccoli Crown', '1 pc', 2.19, 'lime', 34, [2.8, 7, 0.4], { badge: 'Organic' }],
    ['carrot', 'Baby Carrots', '500 g', 1.49, 'peach', 41, [0.9, 10, 0.2]],
    ['tomato', 'Vine Tomatoes', '500 g', 2.89, 'pink', 18, [0.9, 3.9, 0.2], { oldPrice: 3.49 }],
    ['leafy-green', 'Romaine Lettuce', '1 head', 2.49, 'lime', 17, [1.2, 3.3, 0.3]],
    ['eggplant', 'Eggplant', '1 pc', 1.79, 'lilac', 25, [1, 6, 0.2]],
    ['cucumber', 'English Cucumber', '1 pc', 1.29, 'lime', 15, [0.7, 3.6, 0.1]],
    ['potato', 'Russet Potatoes', '2 kg', 3.49, 'cream', 77, [2, 17, 0.1]],
    ['onion', 'Red Onions', '1 kg', 1.99, 'lilac', 40, [1.1, 9, 0.1]],
    ['garlic', 'Garlic Bulbs', '3 pcs', 1.49, 'cream', 149, [6.4, 33, 0.5]],
    ['mushroom', 'Cremini Mushrooms', '250 g', 2.99, 'peach', 22, [3.1, 3.3, 0.3], { badge: 'New' }],
    ['corn', 'Sweet Corn', '2 pcs', 1.99, 'cream', 86, [3.2, 19, 1.2]],
    ['hot-pepper', 'Red Chillies', '100 g', 0.99, 'pink', 40, [1.9, 9, 0.4]],
    ['ginger', 'Fresh Ginger', '200 g', 1.29, 'cream', 80, [1.8, 18, 0.8]],
  ],
  bakery: [
    ['bread', 'Sourdough Loaf', '800 g', 4.5, 'cream', 265, [9, 49, 3.2], { badge: 'Hot' }],
    ['croissant', 'Butter Croissants', '4 pcs', 4.99, 'peach', 406, [8, 45, 21]],
    ['baguette', 'French Baguette', '1 pc', 2.2, 'cream', 274, [9, 56, 1.6]],
    ['bagel', 'Sesame Bagels', '6 pcs', 3.99, 'cream', 257, [10, 50, 1.6]],
    ['pretzel', 'Soft Pretzels', '2 pcs', 2.99, 'peach', 338, [8, 69, 3]],
    ['cookie', 'Choc-chip Cookies', '12 pcs', 3.49, 'cream', 488, [5, 64, 24]],
  ],
  dairy: [
    ['egg', 'Free-range Eggs', '12 pcs', 4.2, 'sky', 155, [13, 1.1, 11], { badge: 'Organic' }],
    ['milk', 'Whole Milk', '1 L', 1.89, 'sky', 61, [3.2, 4.8, 3.3]],
    ['cheese', 'Aged Cheddar', '200 g', 4.99, 'cream', 403, [25, 1.3, 33]],
    ['butter', 'Salted Butter', '250 g', 3.29, 'cream', 717, [0.9, 0.1, 81]],
  ],
  meat: [
    ['meat', 'Ribeye Steak', '400 g', 12.99, 'peach', 291, [24, 0, 22], { badge: 'Hot' }],
    ['poultry', 'Chicken Drumsticks', '1 kg', 6.49, 'peach', 172, [28, 0, 5.7]],
    ['fish', 'Atlantic Salmon', '300 g', 9.99, 'sky', 208, [20, 0, 13], { oldPrice: 11.99 }],
    ['shrimp', 'Tiger Prawns', '250 g', 8.49, 'pink', 99, [24, 0.2, 0.3]],
    ['bacon', 'Smoked Bacon', '200 g', 4.49, 'pink', 541, [37, 1.4, 42]],
  ],
  pantry: [
    ['honey', 'Wildflower Honey', '350 g', 6.99, 'cream', 304, [0.3, 82, 0]],
    ['jar', 'Olive Oil Extra Virgin', '500 ml', 8.99, 'lime', 884, [0, 0, 100]],
    ['rice', 'Basmati Rice', '2 kg', 5.49, 'sky', 130, [2.7, 28, 0.3]],
    ['beans', 'Red Kidney Beans', '1 kg', 2.79, 'peach', 127, [8.7, 23, 0.5]],
    ['canned', 'Chickpeas (can)', '400 g', 1.19, 'sky', 139, [7, 23, 2]],
    ['olive', 'Kalamata Olives', '200 g', 3.99, 'lime', 115, [0.8, 6, 11]],
    ['salt', 'Flaky Sea Salt', '250 g', 1.49, 'sky', 0, [0, 0, 0]],
  ],
  drinks: [
    ['juice', 'Fresh Orange Juice', '1 L', 3.49, 'peach', 45, [0.7, 10, 0.2], { badge: 'New' }],
    ['soda', 'Cola Classic', '330 ml', 1.25, 'pink', 42, [0, 10.6, 0]],
    ['coffee', 'Cold Brew Coffee', '250 ml', 3.99, 'cream', 5, [0.3, 0, 0]],
    ['bubble-tea', 'Brown Sugar Boba', '1 cup', 4.5, 'lilac', 290, [3, 60, 5]],
    ['coconut', 'Coconut Water', '1 pc', 2.99, 'lime', 19, [0.7, 3.7, 0.2]],
  ],
  sweets: [
    ['doughnut', 'Glazed Donuts', '4 pcs', 4.99, 'pink', 452, [4.9, 51, 25]],
    ['cupcake', 'Berry Cupcakes', '4 pcs', 5.49, 'pink', 305, [3.5, 53, 10]],
    ['chocolate', 'Dark Chocolate 70%', '100 g', 2.99, 'peach', 598, [7.8, 46, 43]],
    ['ice-cream', 'Vanilla Soft Serve', '500 ml', 4.99, 'lilac', 207, [3.5, 24, 11]],
    ['pancakes', 'Fluffy Pancake Mix', '500 g', 3.29, 'cream', 227, [6, 28, 10]],
  ],
};

const ORIGINS: Record<CategoryId, string> = {
  fruits: 'Hudson Valley Orchards',
  vegetables: 'Green Valley Farms',
  bakery: 'Daily Bakehouse',
  dairy: 'Meadow Creek Dairy',
  meat: 'Riverside Butchery',
  pantry: 'The Good Pantry Co.',
  drinks: 'Squeeze & Co.',
  sweets: 'Sugar Loft',
};

const defaultDesc = (name: string, cat: CategoryId) =>
  `${name} sourced daily from ${ORIGINS[cat]}. Packed in compostable packaging and kept cold from the farm to your door, so it arrives as fresh as the moment it was picked.`;

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const PRODUCTS: Product[] = (Object.keys(ROWS) as CategoryId[]).flatMap((category) =>
  ROWS[category].map(([id, name, unit, price, tint, kcal, [protein, carbs, fat], extra]) => {
    const h = hash(id);
    return {
      id,
      name,
      img: extra?.img ?? id,
      unit,
      price,
      oldPrice: extra?.oldPrice,
      badge: extra?.badge,
      category,
      tint,
      kcal,
      protein,
      carbs,
      fat,
      rating: 4.3 + (h % 7) / 10,
      reviews: 40 + (h % 260),
      origin: ORIGINS[category],
      desc: extra?.desc ?? defaultDesc(name, category),
    } satisfies Product;
  }),
);

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
export const product = (id: string) => BY_ID.get(id) ?? PRODUCTS[0];
export const category = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
export const productsIn = (id: CategoryId) => PRODUCTS.filter((p) => p.category === id);

export const FLASH_DEALS = ['mango', 'cherries', 'fish', 'apple', 'tomato'].map(product);
export const POPULAR = ['apple', 'bell-pepper', 'banana', 'egg', 'bread', 'avocado'].map(product);
export const PAIRS_WITH = ['honey', 'cheese', 'croissant', 'juice'].map(product);
export const TRENDING = ['Avocado', 'Sourdough', 'Strawberries', 'Salmon', 'Cold brew'];

export interface Store {
  id: string;
  name: string;
  img: string;
  eta: string;
  pickup: string;
  dist: string;
  locations: number;
  tags: string[];
  /** position on the illustrated map, 0..1 */
  x: number;
  y: number;
}

export const STORES: Store[] = [
  { id: 'pluck', name: 'Pluck Supermarket', img: 'store', eta: 'Delivery by 10:00am', pickup: 'Ready by 1:00pm', dist: '0.8 mi', locations: 5, tags: ['In-store prices', 'Low prices'], x: 0.62, y: 0.4 },
  { id: 'farm', name: 'Green Valley Farms', img: 'seedling', eta: 'Delivery by 11:30am', pickup: 'Ready by 12:30pm', dist: '1.6 mi', locations: 2, tags: ['Organic', 'Local'], x: 0.22, y: 0.38 },
  { id: 'bake', name: 'Daily Bakehouse', img: 'croissant', eta: 'Delivery by 9:30am', pickup: 'Ready in 15 min', dist: '0.4 mi', locations: 3, tags: ['Baked at 6am'], x: 0.32, y: 0.62 },
  { id: 'sea', name: 'Harbor Fish Market', img: 'fish', eta: 'Delivery by 2:00pm', pickup: 'Ready by 3:00pm', dist: '2.3 mi', locations: 1, tags: ['Catch of the day'], x: 0.8, y: 0.64 },
];

export const PROMO_CODE = 'PLUCK20';
