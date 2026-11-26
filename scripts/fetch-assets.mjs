// Downloads the 3D illustrations used by the prototype from Microsoft's
// Fluent Emoji set (MIT licensed) into public/img/3d so the app runs offline.
// Usage: npm run fetch:assets
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'img', '3d');
const BASE = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets';

/** local slug -> Fluent emoji folder name */
const ASSETS = {
  apple: 'Red apple', 'green-apple': 'Green apple', banana: 'Banana', strawberry: 'Strawberry',
  grapes: 'Grapes', watermelon: 'Watermelon', pineapple: 'Pineapple', lemon: 'Lemon',
  tangerine: 'Tangerine', peach: 'Peach', cherries: 'Cherries', mango: 'Mango', avocado: 'Avocado',
  blueberries: 'Blueberries', kiwi: 'Kiwi fruit', coconut: 'Coconut', pear: 'Pear',
  broccoli: 'Broccoli', carrot: 'Carrot', tomato: 'Tomato', 'bell-pepper': 'Bell pepper',
  eggplant: 'Eggplant', cucumber: 'Cucumber', 'leafy-green': 'Leafy green', potato: 'Potato',
  onion: 'Onion', garlic: 'Garlic', mushroom: 'Mushroom', corn: 'Ear of corn', 'hot-pepper': 'Hot pepper',
  ginger: 'Ginger root', 'pea-pod': 'Pea pod', beans: 'Beans', olive: 'Olive',
  bread: 'Bread', baguette: 'Baguette bread', croissant: 'Croissant', bagel: 'Bagel', pretzel: 'Pretzel',
  cookie: 'Cookie', doughnut: 'Doughnut', pancakes: 'Pancakes', cupcake: 'Cupcake',
  egg: 'Egg', milk: 'Glass of milk', cheese: 'Cheese wedge', butter: 'Butter',
  meat: 'Cut of meat', poultry: 'Poultry leg', fish: 'Fish', shrimp: 'Shrimp', bacon: 'Bacon',
  honey: 'Honey pot', rice: 'Cooked rice', canned: 'Canned food', jar: 'Jar', salt: 'Salt',
  juice: 'Beverage box', soda: 'Cup with straw', coffee: 'Hot beverage', 'bubble-tea': 'Bubble tea',
  'ice-cream': 'Soft ice cream', chocolate: 'Chocolate bar', salad: 'Green salad', herb: 'Herb',
  seedling: 'Seedling', leaf: 'Leaf fluttering in wind',
  basket: 'Basket', cart: 'Shopping cart', bags: 'Shopping bags', truck: 'Delivery truck',
  scooter: 'Motor scooter', package: 'Package', gift: 'Wrapped gift', party: 'Party popper',
  'money-bag': 'Money bag', coin: 'Coin', crown: 'Crown', gem: 'Gem stone', ticket: 'Ticket',
  star: 'Glowing star', heart: 'Red heart', fire: 'Fire', sparkles: 'Sparkles', pin: 'Round pushpin',
  house: 'House', store: 'Convenience store', stopwatch: 'Stopwatch', bell: 'Bell',
  phone: 'Mobile phone', card: 'Credit card', trophy: 'Trophy', megaphone: 'Megaphone', lock: 'Locked',
  envelope: 'Envelope', clipboard: 'Clipboard', receipt: 'Receipt', calendar: 'Spiral calendar',
  label: 'Label', woman: 'Woman', man: 'Man', person: 'Person', wave: 'Waving hand',
  'thumbs-up': 'Thumbs up', 'star-struck': 'Star-struck', 'heart-eyes': 'Smiling face with heart-eyes',
  partying: 'Partying face',
};

const fileStem = (name) => name.toLowerCase().replace(/[\s]+/g, '_');

function candidates(folder) {
  const enc = encodeURIComponent(folder);
  const stem = fileStem(folder);
  return [
    `${BASE}/${enc}/3D/${stem}_3d.png`,
    `${BASE}/${enc}/Default/3D/${stem}_3d_default.png`,
  ];
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchOne(slug, folder) {
  const dest = join(OUT, `${slug}.png`);
  if (await exists(dest)) return 'cached';
  for (const url of candidates(folder)) {
    const res = await fetch(url);
    if (res.ok) {
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return 'ok';
    }
  }
  throw new Error(`not found: ${folder}`);
}

await mkdir(OUT, { recursive: true });
const entries = Object.entries(ASSETS);
const failures = [];
let done = 0;
await Promise.all(
  entries.map(async ([slug, folder]) => {
    try {
      await fetchOne(slug, folder);
    } catch (e) {
      failures.push(`${slug} (${folder}): ${e.message}`);
    }
    done++;
  }),
);
console.log(`Fetched ${done - failures.length}/${entries.length} assets into ${OUT}`);
if (failures.length) {
  console.log('Failed:\n  ' + failures.join('\n  '));
  process.exitCode = 1;
}
