// Mock product data (swap with a real API later)
const CATEGORIES = [
  { id: "all", name: "All", icon: "🛒" },
  { id: "fruits", name: "Fruits & Veg", icon: "🥦" },
  { id: "dairy", name: "Dairy & Bread", icon: "🥛" },
  { id: "snacks", name: "Snacks", icon: "🍪" },
  { id: "drinks", name: "Drinks", icon: "🧃" },
  { id: "instant", name: "Instant Food", icon: "🍜" },
  { id: "care", name: "Personal Care", icon: "🧴" },
];

const PRODUCTS = [
  { id: 1, name: "Fresh Bananas", unit: "6 pcs", price: 39, mrp: 49, cat: "fruits", emoji: "🍌", mins: 8 },
  { id: 2, name: "Red Apples", unit: "4 pcs", price: 119, mrp: 149, cat: "fruits", emoji: "🍎", mins: 8 },
  { id: 3, name: "Tomatoes", unit: "500 g", price: 29, mrp: 35, cat: "fruits", emoji: "🍅", mins: 8 },
  { id: 4, name: "Onions", unit: "1 kg", price: 45, mrp: 55, cat: "fruits", emoji: "🧅", mins: 8 },
  { id: 5, name: "Potatoes", unit: "1 kg", price: 38, mrp: 45, cat: "fruits", emoji: "🥔", mins: 8 },
  { id: 6, name: "Carrots", unit: "500 g", price: 32, mrp: 40, cat: "fruits", emoji: "🥕", mins: 8 },
  { id: 7, name: "Green Grapes", unit: "500 g", price: 89, mrp: 110, cat: "fruits", emoji: "🍇", mins: 9 },
  { id: 8, name: "Broccoli", unit: "1 pc", price: 59, mrp: 75, cat: "fruits", emoji: "🥦", mins: 9 },

  { id: 9, name: "Toned Milk", unit: "500 ml", price: 29, mrp: 30, cat: "dairy", emoji: "🥛", mins: 7 },
  { id: 10, name: "Brown Bread", unit: "400 g", price: 48, mrp: 55, cat: "dairy", emoji: "🍞", mins: 7 },
  { id: 11, name: "Farm Eggs", unit: "6 pcs", price: 54, mrp: 60, cat: "dairy", emoji: "🥚", mins: 7 },
  { id: 12, name: "Salted Butter", unit: "100 g", price: 62, mrp: 68, cat: "dairy", emoji: "🧈", mins: 7 },
  { id: 13, name: "Cheese Slices", unit: "10 slices", price: 135, mrp: 150, cat: "dairy", emoji: "🧀", mins: 8 },
  { id: 14, name: "Curd Cup", unit: "400 g", price: 40, mrp: 45, cat: "dairy", emoji: "🥣", mins: 7 },

  { id: 15, name: "Choco Cookies", unit: "120 g", price: 30, mrp: 35, cat: "snacks", emoji: "🍪", mins: 9 },
  { id: 16, name: "Potato Chips", unit: "90 g", price: 20, mrp: 20, cat: "snacks", emoji: "🥔", mins: 9 },
  { id: 17, name: "Salted Popcorn", unit: "60 g", price: 45, mrp: 55, cat: "snacks", emoji: "🍿", mins: 9 },
  { id: 18, name: "Dark Chocolate", unit: "80 g", price: 149, mrp: 180, cat: "snacks", emoji: "🍫", mins: 9 },
  { id: 19, name: "Mixed Nuts", unit: "200 g", price: 199, mrp: 249, cat: "snacks", emoji: "🥜", mins: 10 },

  { id: 20, name: "Orange Juice", unit: "1 L", price: 110, mrp: 125, cat: "drinks", emoji: "🧃", mins: 8 },
  { id: 21, name: "Cold Coffee", unit: "200 ml", price: 55, mrp: 65, cat: "drinks", emoji: "☕", mins: 8 },
  { id: 22, name: "Sparkling Water", unit: "750 ml", price: 60, mrp: 70, cat: "drinks", emoji: "💧", mins: 8 },
  { id: 23, name: "Green Tea Bags", unit: "25 bags", price: 145, mrp: 170, cat: "drinks", emoji: "🍵", mins: 10 },
  { id: 24, name: "Cola", unit: "750 ml", price: 40, mrp: 40, cat: "drinks", emoji: "🥤", mins: 8 },

  { id: 25, name: "Instant Noodles", unit: "4 pack", price: 56, mrp: 64, cat: "instant", emoji: "🍜", mins: 9 },
  { id: 26, name: "Pasta", unit: "500 g", price: 85, mrp: 99, cat: "instant", emoji: "🍝", mins: 9 },
  { id: 27, name: "Frozen Peas", unit: "500 g", price: 79, mrp: 95, cat: "instant", emoji: "🫛", mins: 10 },
  { id: 28, name: "Ready Poha", unit: "200 g", price: 49, mrp: 55, cat: "instant", emoji: "🍚", mins: 9 },
  { id: 29, name: "Tomato Ketchup", unit: "500 g", price: 99, mrp: 115, cat: "instant", emoji: "🍅", mins: 9 },

  { id: 30, name: "Hand Wash", unit: "250 ml", price: 89, mrp: 105, cat: "care", emoji: "🧼", mins: 10 },
  { id: 31, name: "Toothpaste", unit: "150 g", price: 92, mrp: 105, cat: "care", emoji: "🪥", mins: 10 },
  { id: 32, name: "Shampoo", unit: "180 ml", price: 169, mrp: 199, cat: "care", emoji: "🧴", mins: 10 },
];

const COUPONS = {
  FIRST20: { label: "20% off up to ₹100", apply: (sub) => Math.min(Math.round(sub * 0.2), 100), min: 149 },
  FRESH50: { label: "₹50 off on orders above ₹299", apply: () => 50, min: 299 },
};