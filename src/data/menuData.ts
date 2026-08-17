export type ItemBadge = "BESTSELLER" | "POPULAR" | "SIGNATURE" | "CHEF'S SPECIAL";

export type MenuItem = {
  name: string;
  price: number;
  isVeg: boolean;
  badge?: ItemBadge;
  description?: string;
  tags?: string[];
  imageKey?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  chunkGroup: string; // e.g. "Starters", "Soups", "Noodles", "Rice", "Sizzlers", "Fries & More", "Pasta", "Salads", "Panini & Grills", "Toast & Bao", "Sandwich & Burger", "Pizza", "Momos", "Coffee", "Shakes & Mocktails", "Desserts"
  imageKey: string;
  items: MenuItem[];
};

export type MenuSection = {
  id: string;
  label: string;
  eyebrow: string;
  icon: string;
  description: string;
  chunks: string[]; // List of unique chunk groups for subcategory tabs
  categories: MenuCategory[];
};

export type FeaturedItem = {
  name: string;
  price: number;
  isVeg: boolean;
  badge: ItemBadge;
  description: string;
  categoryName: string;
  sectionId: string;
  imageKey: string;
  tags: string[];
};

export type QuickCraving = {
  id: string;
  label: string;
  icon: string;
  imageKey: string;
  targetType: "section" | "category";
  targetId: string;
  maxPrice?: number;
  dietary?: "veg" | "non-veg";
  description?: string;
};

export type StaticPairing = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accentIcon: string;
  items: {
    name: string;
    price: number;
    isVeg: boolean;
    categoryName: string;
    sectionId: string;
    tagline: string;
  }[];
};

// 1. RAW MENU SECTIONS WITH PSYCHOLOGY-INFORMED CHUNKING & BADGES
export const menuSectionsData: MenuSection[] = [
  {
    id: "asian-kitchen",
    label: "Asian Kitchen",
    eyebrow: "Wok-Fired Specials",
    icon: "🔥",
    description: "Wok-tossed starters, fragrant soups, handcrafted noodles, claypot rice & sizzling hot plates.",
    chunks: ["All", "Starters", "Soups", "Noodles", "Rice", "Sizzlers", "More"],
    categories: [
      {
        id: "veg-starters",
        name: "Veg Starters",
        chunkGroup: "Starters",
        imageKey: "starters",
        items: [
          { name: "Chilli Paneer", price: 170, isVeg: true, badge: "BESTSELLER", description: "Crispy cottage cheese tossed in spicy soy-chilli gravy with peppers.", tags: ["paneer", "cottage cheese", "spicy", "chilli", "starter", "chinese"] },
          { name: "Veg Manchurian", price: 150, isVeg: true, badge: "POPULAR", tags: ["chinese", "crispy", "starter", "gravy", "manchurian"] },
          { name: "Honey Chilli Potato", price: 160, isVeg: true, badge: "POPULAR", tags: ["potato", "sweet spicy", "chilli", "starter", "fries"] },
          { name: "Crispy Veg", price: 160, isVeg: true, tags: ["chinese", "crispy", "starter", "fried"] },
          { name: "Crispy Corn", price: 160, isVeg: true, tags: ["crispy", "corn", "starter", "snack"] },
          { name: "Chilli Mushroom", price: 170, isVeg: true, tags: ["mushroom", "spicy", "chilli", "starter"] },
          { name: "Paneer 65", price: 170, isVeg: true, tags: ["paneer", "cottage cheese", "spicy", "starter", "curry leaf"] },
          { name: "Garlic Paneer", price: 180, isVeg: true, tags: ["paneer", "garlic", "cottage cheese", "starter"] },
          { name: "Devil's Paneer", price: 190, isVeg: true, badge: "SIGNATURE", description: "Extra spicy wok-glazed paneer with bird's eye chilli heat.", tags: ["paneer", "very spicy", "hot", "cottage cheese", "starter"] },
        ],
      },
      {
        id: "non-veg-starters",
        name: "Non-Veg Starters",
        chunkGroup: "Starters",
        imageKey: "starters",
        items: [
          { name: "Chilli Chicken", price: 180, isVeg: false, badge: "BESTSELLER", description: "Classic street-style juicy chicken bites in soy chilli sauce.", tags: ["chicken", "spicy", "chilli", "starter", "poultry"] },
          { name: "Chicken Lollipop", price: 230, isVeg: false, badge: "BESTSELLER", description: "Crispy drummettes tossed in signature schezwan glaze.", tags: ["chicken", "wings", "drumstick", "crispy", "starter"] },
          { name: "Devil's Chicken", price: 240, isVeg: false, badge: "SIGNATURE", description: "Fiery wok-tossed chicken with intense chili infusion.", tags: ["chicken", "very spicy", "hot", "starter"] },
          { name: "Crispy Chicken", price: 200, isVeg: false, badge: "POPULAR", tags: ["chicken", "crispy", "fried", "starter"] },
          { name: "Chicken 65", price: 190, isVeg: false, tags: ["chicken", "spicy", "crispy", "starter", "poultry"] },
          { name: "Garlic Chicken", price: 200, isVeg: false, tags: ["chicken", "garlic", "starter"] },
          { name: "Black Pepper Chicken", price: 200, isVeg: false, tags: ["chicken", "pepper", "spicy", "starter"] },
        ],
      },
      {
        id: "asian-soups",
        name: "Asian Soups",
        chunkGroup: "Soups",
        imageKey: "soup",
        items: [
          { name: "Veg Manchow Soup", price: 120, isVeg: true, badge: "POPULAR", tags: ["soup", "crispy noodles", "spicy", "warm", "healthy"] },
          { name: "Chicken Manchow Soup", price: 130, isVeg: false, badge: "BESTSELLER", tags: ["soup", "chicken", "spicy", "crispy noodles", "warm"] },
          { name: "Veg Hot n Sour", price: 120, isVeg: true, tags: ["soup", "spicy", "tangy", "warm", "healthy"] },
          { name: "Chicken Hot n Sour", price: 130, isVeg: false, tags: ["soup", "chicken", "spicy", "tangy", "warm"] },
          { name: "Tomato Soup", price: 120, isVeg: true, tags: ["soup", "tomato", "classic", "warm", "healthy"] },
          { name: "Veg Clear Soup", price: 120, isVeg: true, tags: ["soup", "clear", "healthy", "diet", "light", "warm"] },
          { name: "Lemon Coriander Soup", price: 120, isVeg: true, tags: ["soup", "lemon", "coriander", "healthy", "vitamin c", "light"] },
          { name: "Sweet Corn Soup", price: 120, isVeg: true, tags: ["soup", "corn", "sweet", "creamy", "warm", "healthy"] },
        ],
      },
      {
        id: "veg-noodles",
        name: "Veg Noodles",
        chunkGroup: "Noodles",
        imageKey: "noodles",
        items: [
          { name: "Hakka Noodles", price: 160, isVeg: true, badge: "BESTSELLER", tags: ["noodles", "hakka", "chowmein", "chinese"] },
          { name: "Veg Schezwan Noodles", price: 160, isVeg: true, badge: "POPULAR", tags: ["noodles", "schezwan", "spicy", "chowmein"] },
          { name: "Exotic Veg Noodles", price: 150, isVeg: true, tags: ["noodles", "chowmein", "veggies", "chinese"] },
          { name: "Veg Manchurian Noodles", price: 160, isVeg: true, tags: ["noodles", "manchurian", "chowmein"] },
          { name: "Veg Burnt Garlic Noodles", price: 160, isVeg: true, tags: ["noodles", "garlic", "chowmein"] },
          { name: "Chilli Garlic Noodles", price: 170, isVeg: true, tags: ["noodles", "chilli", "garlic", "spicy"] },
          { name: "Lemon Paneer Noodles", price: 180, isVeg: true, tags: ["noodles", "lemon", "paneer", "tangy"] },
          { name: "Veg Shanghai Noodles", price: 190, isVeg: true, tags: ["noodles", "shanghai", "crispy", "spicy"] },
          { name: "Overloaded Veg Noodles", price: 190, isVeg: true, tags: ["noodles", "loaded", "extra veggies"] },
          { name: "Coconut Veg Noodles", price: 200, isVeg: true, tags: ["noodles", "coconut", "thai", "creamy"] },
        ],
      },
      {
        id: "non-veg-noodles",
        name: "Non-Veg Noodles",
        chunkGroup: "Noodles",
        imageKey: "noodles",
        items: [
          { name: "Chicken Hakka Noodles", price: 170, isVeg: false, badge: "BESTSELLER", description: "Wok-charred thin noodles tossed with succulent chicken slivers.", tags: ["noodles", "chicken", "hakka", "chowmein"] },
          { name: "Chicken Schezwan Noodles", price: 180, isVeg: false, badge: "POPULAR", tags: ["noodles", "chicken", "schezwan", "spicy"] },
          { name: "Exotic Chicken Noodles", price: 170, isVeg: false, tags: ["noodles", "chicken", "chowmein"] },
          { name: "Chicken Burnt Garlic Noodles", price: 180, isVeg: false, tags: ["noodles", "chicken", "garlic"] },
          { name: "Lemon Chicken Noodles", price: 190, isVeg: false, tags: ["noodles", "chicken", "lemon", "tangy"] },
          { name: "Chicken Shanghai Noodles", price: 210, isVeg: false, tags: ["noodles", "chicken", "shanghai", "spicy"] },
          { name: "Overloaded Chicken Noodles", price: 210, isVeg: false, tags: ["noodles", "chicken", "loaded", "extra chicken"] },
          { name: "Coconut Chicken Noodles", price: 230, isVeg: false, tags: ["noodles", "chicken", "coconut", "thai", "creamy"] },
        ],
      },
      {
        id: "veg-rice",
        name: "Veg Rice",
        chunkGroup: "Rice",
        imageKey: "rice",
        items: [
          { name: "Exotic Veg Fried Rice", price: 150, isVeg: true, badge: "POPULAR", tags: ["rice", "fried rice", "chinese", "veggies", "pulao"] },
          { name: "Asian Pot Rice", price: 220, isVeg: true, badge: "SIGNATURE", description: "Claypot style wok rice served with sizzling oriental mushroom gravy.", tags: ["rice", "pot rice", "claypot", "gravy", "biryani"] },
          { name: "Veg Schezwan Rice", price: 160, isVeg: true, tags: ["rice", "schezwan", "spicy", "fried rice"] },
          { name: "Veg Manchurian Rice", price: 160, isVeg: true, tags: ["rice", "manchurian", "fried rice"] },
          { name: "Veg Burnt Garlic Rice", price: 170, isVeg: true, tags: ["rice", "garlic", "fried rice"] },
          { name: "Veg Singapore Rice", price: 170, isVeg: true, tags: ["rice", "singapore", "curry", "spicy"] },
          { name: "Veg Cocktail Rice", price: 190, isVeg: true, tags: ["rice", "cocktail", "special", "fried rice"] },
          { name: "Paneer Fried Rice", price: 200, isVeg: true, tags: ["rice", "paneer", "cottage cheese", "fried rice"] },
        ],
      },
      {
        id: "non-veg-rice",
        name: "Non-Veg Rice",
        chunkGroup: "Rice",
        imageKey: "rice",
        items: [
          { name: "Chicken Fried Rice", price: 170, isVeg: false, badge: "BESTSELLER", tags: ["rice", "chicken", "fried rice", "poultry"] },
          { name: "Chicken Asian Pot Rice", price: 240, isVeg: false, badge: "SIGNATURE", description: "Slow-simmered Asian pot rice topped with aromatic chicken gravy.", tags: ["rice", "chicken", "pot rice", "claypot", "biryani"] },
          { name: "Chicken Schezwan Rice", price: 190, isVeg: false, tags: ["rice", "chicken", "schezwan", "spicy"] },
          { name: "Chicken Burnt Garlic Rice", price: 190, isVeg: false, tags: ["rice", "chicken", "garlic"] },
          { name: "Chicken Singapore Rice", price: 200, isVeg: false, tags: ["rice", "chicken", "singapore", "spicy"] },
          { name: "Chicken Cocktail Rice", price: 210, isVeg: false, tags: ["rice", "chicken", "cocktail", "special"] },
        ],
      },
      {
        id: "sizzlers",
        name: "Hot Sizzlers",
        chunkGroup: "Sizzlers",
        imageKey: "sizzlers",
        items: [
          { name: "Chicken Angara Sizzler", price: 340, isVeg: false, badge: "SIGNATURE", description: "Smoking hot platter with spiced grilled chicken, butter rice, fries & fiery sauce.", tags: ["sizzler", "chicken", "angara", "spicy", "smoking", "platter"] },
          { name: "Paneer Hot Pan Sizzler", price: 320, isVeg: true, badge: "POPULAR", tags: ["sizzler", "paneer", "hot pan", "cottage cheese", "smoking", "platter"] },
          { name: "Afghani Chicken Sizzler", price: 350, isVeg: false, badge: "POPULAR", tags: ["sizzler", "chicken", "afghani", "creamy", "smoking", "platter"] },
          { name: "Veg Hot Pan Sizzler", price: 300, isVeg: true, tags: ["sizzler", "hot pan", "smoking", "platter", "rice", "fries"] },
        ],
      },
      {
        id: "asian-more",
        name: "Fries, Maggi & Combos",
        chunkGroup: "More",
        imageKey: "combo",
        items: [
          { name: "Peri Peri Fries", price: 140, isVeg: true, badge: "BESTSELLER", tags: ["fries", "peri peri", "spicy", "chips", "potato", "snack"] },
          { name: "Veg Fried Rice + Chilli Paneer", price: 210, isVeg: true, badge: "BESTSELLER", description: "Complete meal combo of fragrant fried rice & sizzling chilli paneer.", tags: ["combo", "meal", "fried rice", "chilli paneer", "chinese combo", "lunch", "dinner"] },
          { name: "Chicken Rice + Chilli Chicken", price: 230, isVeg: false, badge: "BESTSELLER", description: "Wholesome combo bowl with classic chicken fried rice and chilli chicken.", tags: ["combo", "meal", "chicken rice", "chilli chicken", "chinese combo", "lunch", "dinner"] },
          { name: "Cheese Mayo Fries", price: 160, isVeg: true, badge: "POPULAR", tags: ["fries", "cheese", "cheesy", "mayo", "loaded fries", "snack"] },
          { name: "Salted Fries", price: 120, isVeg: true, tags: ["fries", "french fries", "chips", "potato", "snack", "finger food"] },
          { name: "Cheese Maggi", price: 90, isVeg: true, badge: "POPULAR", tags: ["maggi", "cheese", "cheesy", "noodles", "snack"] },
          { name: "Cheese Corn Maggi", price: 100, isVeg: true, tags: ["maggi", "cheese", "corn", "cheesy", "snack"] },
          { name: "Peri Peri Maggi", price: 80, isVeg: true, tags: ["maggi", "peri peri", "spicy", "noodles", "snack"] },
          { name: "Vegetable Masala Maggi", price: 70, isVeg: true, tags: ["maggi", "noodles", "masala", "comfort food", "snack"] },
          { name: "Veg American Chop Suey", price: 180, isVeg: true, tags: ["chop suey", "crispy noodles", "sweet tangy", "gravy"] },
          { name: "Chinese Chop Suey", price: 180, isVeg: true, tags: ["chop suey", "crispy noodles", "white gravy", "chinese"] },
          { name: "Chicken American Chop Suey", price: 200, isVeg: false, tags: ["chop suey", "chicken", "crispy noodles", "sweet tangy"] },
          { name: "Chicken Chinese Chop Suey", price: 200, isVeg: false, tags: ["chop suey", "chicken", "crispy noodles", "white gravy"] },
        ],
      },
    ],
  },
  {
    id: "continental",
    label: "Continental",
    eyebrow: "Gourmet Kitchen",
    icon: "🍝",
    description: "Handcrafted pasta, crisp salads, artisanal grilled plates and warm toasted panini.",
    chunks: ["All", "Pasta", "Starters & Soups", "Salads", "Grilled & Panini"],
    categories: [
      {
        id: "veg-pasta",
        name: "Veg Pasta",
        chunkGroup: "Pasta",
        imageKey: "pasta",
        items: [
          { name: "Pink Sauce Pasta", price: 220, isVeg: true, badge: "BESTSELLER", description: "Penne tossed in silky tomato-cream blush sauce with Italian herbs.", tags: ["pasta", "pink sauce", "mixed sauce", "italian", "penne", "macaroni", "creamy"] },
          { name: "Alfredo Pasta", price: 220, isVeg: true, badge: "POPULAR", tags: ["pasta", "alfredo", "white sauce", "creamy", "cheese", "cheesy", "italian"] },
          { name: "American Macaroni Cheese Pasta", price: 270, isVeg: true, badge: "SIGNATURE", description: "Ultra-rich three-cheese macaroni baked to creamy perfection.", tags: ["pasta", "mac and cheese", "macaroni", "cheese", "cheesy", "creamy"] },
          { name: "Arrabbiata Pasta", price: 230, isVeg: true, tags: ["pasta", "arrabbiata", "red sauce", "spicy", "tomato", "italian"] },
          { name: "Pesto Pasta", price: 250, isVeg: true, tags: ["pasta", "pesto", "basil", "herbs", "italian", "green sauce"] },
          { name: "Aglio Olio Peperoncino Pasta", price: 270, isVeg: true, tags: ["pasta", "aglio olio", "olive oil", "garlic", "chilli flakes", "italian"] },
        ],
      },
      {
        id: "non-veg-pasta",
        name: "Non-Veg Pasta",
        chunkGroup: "Pasta",
        imageKey: "pasta",
        items: [
          { name: "Chicken Pink Sauce Pasta", price: 240, isVeg: false, badge: "BESTSELLER", description: "Tender chicken chunks folded into rich tomato-cream sauce with parmesan.", tags: ["pasta", "chicken", "pink sauce", "mixed sauce", "italian"] },
          { name: "Chicken Alfredo Pasta", price: 240, isVeg: false, badge: "POPULAR", tags: ["pasta", "chicken", "alfredo", "white sauce", "cheesy"] },
          { name: "Chicken Arrabbiata Pasta", price: 250, isVeg: false, tags: ["pasta", "chicken", "arrabbiata", "red sauce", "spicy", "tomato"] },
          { name: "Chicken Pesto Pasta", price: 280, isVeg: false, tags: ["pasta", "chicken", "pesto", "basil", "italian"] },
          { name: "Chicken Macaroni Cheese Pasta", price: 290, isVeg: false, tags: ["pasta", "chicken", "mac and cheese", "cheese", "cheesy"] },
          { name: "Chicken Aglio Olio Peperoncino Pasta", price: 290, isVeg: false, tags: ["pasta", "chicken", "aglio olio", "garlic", "olive oil"] },
        ],
      },
      {
        id: "continental-starters-soups",
        name: "Continental Starters & Soups",
        chunkGroup: "Starters & Soups",
        imageKey: "starters",
        items: [
          { name: "Korean Fried Chicken", price: 200, isVeg: false, badge: "BESTSELLER", description: "Ultra-crispy double-fried chicken glazed in sweet-spicy gochujang.", tags: ["chicken", "korean", "kfc", "crunchy", "sweet spicy", "starter"] },
          { name: "Lotus Stem Fries", price: 160, isVeg: true, badge: "SIGNATURE", description: "Crispy sliced lotus root tossed in honey chilli and sesame.", tags: ["lotus stem", "crispy", "fries", "honey chilli", "starter", "snack"] },
          { name: "Thecha Chicken", price: 170, isVeg: false, badge: "SIGNATURE", description: "Fiery green chilli garlic thecha tossed chicken morsels.", tags: ["chicken", "thecha", "spicy", "green chilli", "maharashtrian", "starter"] },
          { name: "Fried Chicken Wings", price: 180, isVeg: false, badge: "POPULAR", tags: ["chicken", "wings", "crispy", "fried", "starter", "finger food"] },
          { name: "Salted Pepper Crispy Corn", price: 160, isVeg: true, tags: ["corn", "crispy corn", "salt pepper", "snack", "starter"] },
          { name: "Chilli Garlic Chicken", price: 170, isVeg: false, tags: ["chicken", "chilli garlic", "spicy", "starter"] },
          { name: "Teriyaki Spicy Chicken", price: 190, isVeg: false, tags: ["chicken", "teriyaki", "sweet spicy", "japanese", "starter"] },
          { name: "Broccoli Spinach Soup", price: 180, isVeg: true, tags: ["soup", "broccoli", "spinach", "healthy", "greens", "diet", "creamy"] },
          { name: "Tibetan Thupka", price: 180, isVeg: true, badge: "POPULAR", tags: ["soup", "thupka", "thukpa", "tibetan", "noodles soup", "ramen", "warm"] },
          { name: "Chicken Broccoli Spinach Soup", price: 200, isVeg: false, tags: ["soup", "chicken", "broccoli", "spinach", "healthy", "diet"] },
          { name: "Chicken Tibetan Thupka", price: 200, isVeg: false, badge: "POPULAR", tags: ["soup", "chicken", "thupka", "thukpa", "noodles soup", "ramen"] },
        ],
      },
      {
        id: "salads",
        name: "Fresh Salads",
        chunkGroup: "Salads",
        imageKey: "salad",
        items: [
          { name: "Chicken Caesar Salad", price: 250, isVeg: false, badge: "BESTSELLER", tags: ["salad", "chicken", "caesar", "lettuce", "healthy", "high protein", "diet"] },
          { name: "Caesar Salad", price: 200, isVeg: true, badge: "POPULAR", tags: ["salad", "caesar", "lettuce", "croutons", "healthy", "diet", "greens"] },
          { name: "Apple Pear Feta Salad", price: 270, isVeg: true, badge: "SIGNATURE", description: "Crisp orchard fruits, mixed greens, candied walnuts & Greek feta.", tags: ["salad", "apple", "pear", "feta cheese", "fruit salad", "healthy", "gourmet"] },
          { name: "Benzaline Salad", price: 220, isVeg: true, tags: ["salad", "benzaline", "exotic veggies", "healthy", "diet"] },
          { name: "Chicken Benzaline Salad", price: 250, isVeg: false, tags: ["salad", "chicken", "benzaline", "healthy", "high protein"] },
          { name: "Chicken Apple Pear Feta Salad", price: 300, isVeg: false, tags: ["salad", "chicken", "apple", "pear", "feta cheese", "high protein"] },
        ],
      },
      {
        id: "grilled-panini",
        name: "Grilled Plates & Panini",
        chunkGroup: "Grilled & Panini",
        imageKey: "grill",
        items: [
          { name: "PMT Panini", price: 190, isVeg: true, badge: "BESTSELLER", description: "Paneer, sauteed mushroom & sun-dried tomato pressed with melted mozzarella.", tags: ["panini", "sandwich", "paneer", "mushroom", "tomato", "cheese", "grilled bread"] },
          { name: "Grilled Chicken", price: 270, isVeg: false, badge: "POPULAR", tags: ["grilled", "chicken", "steak", "bbq", "healthy", "high protein", "keto"] },
          { name: "Exotic Veggies Stuffed Chicken", price: 290, isVeg: false, badge: "SIGNATURE", description: "Succulent chicken breast stuffed with herb-roasted veggies & jus.", tags: ["grilled", "chicken", "stuffed", "exotic veggies", "gourmet", "platter"] },
          { name: "Butter Pepper Grilled Chicken", price: 270, isVeg: false, tags: ["grilled", "chicken", "butter pepper", "steak", "gourmet"] },
          { name: "Cajun Spicy Cheese Panini", price: 220, isVeg: true, tags: ["panini", "cajun", "spicy", "cheese", "cheesy", "sandwich"] },
          { name: "Garden Fresh Panini", price: 220, isVeg: true, tags: ["panini", "veggies", "healthy", "sandwich", "cheese"] },
          { name: "Roasted Chicken Panini", price: 260, isVeg: false, badge: "POPULAR", tags: ["panini", "chicken", "roasted chicken", "sandwich", "cheese"] },
        ],
      },
    ],
  },
  {
    id: "cafe-bites",
    label: "Cafe Bites",
    eyebrow: "Handheld Cravings",
    icon: "🍔",
    description: "Crispy toasts, soft steamed bao, loaded grilled sandwiches, juicy burgers, thin-crust pizza & hot momos.",
    chunks: ["All", "Toast & Bao", "Sandwiches", "Burgers", "Pizza", "Momos"],
    categories: [
      {
        id: "toast-bao",
        name: "Toasts & Bao Buns",
        chunkGroup: "Toast & Bao",
        imageKey: "toast",
        items: [
          { name: "Cheese Garlic Toast", price: 140, isVeg: true, badge: "BESTSELLER", tags: ["toast", "garlic bread", "cheese", "cheesy", "garlic toast", "snack"] },
          { name: "Fire Cracker Cottage Cheese Bao", price: 200, isVeg: true, badge: "SIGNATURE", description: "Fluffy steamed lotus buns stuffed with spicy glazed paneer.", tags: ["bao", "bun", "dimsum", "dumpling", "paneer", "spicy", "cottage cheese"] },
          { name: "Naga Chilli Pepper Toast", price: 140, isVeg: true, badge: "SIGNATURE", description: "Artisan sourdough toast with spicy Naga chilli cheese crust.", tags: ["toast", "naga chilli", "spicy", "hot", "bread", "snack"] },
          { name: "Smoky Spicy Chicken Toast", price: 150, isVeg: false, badge: "POPULAR", tags: ["toast", "chicken", "smoky", "spicy", "bread", "snack"] },
          { name: "Teriyaki Chicken Bao", price: 200, isVeg: false, tags: ["bao", "bun", "chicken", "teriyaki", "dimsum", "dumpling"] },
          { name: "Grilled Sambal Chicken Bao", price: 250, isVeg: false, tags: ["bao", "bun", "chicken", "sambal", "spicy", "dumpling"] },
          { name: "Devil Chicken Bao", price: 250, isVeg: false, badge: "SIGNATURE", tags: ["bao", "bun", "chicken", "very spicy", "hot", "dumpling"] },
        ],
      },
      {
        id: "sandwiches",
        name: "Loaded Sandwiches",
        chunkGroup: "Sandwiches",
        imageKey: "sandwich",
        items: [
          { name: "Tandoori Paneer Sandwich", price: 160, isVeg: true, badge: "BESTSELLER", tags: ["sandwich", "paneer", "tandoori", "spicy", "cottage cheese", "grilled"] },
          { name: "Tandoori Chicken Sandwich", price: 170, isVeg: false, badge: "BESTSELLER", tags: ["sandwich", "chicken", "tandoori", "spicy", "grilled"] },
          { name: "Chicken Junglee Sandwich", price: 200, isVeg: false, badge: "SIGNATURE", description: "Our triple-decker signature sandwich loaded with shredded chicken & house mayo.", tags: ["sandwich", "chicken", "junglee", "loaded", "special"] },
          { name: "Veg Club Sandwich", price: 100, isVeg: true, badge: "POPULAR", tags: ["sandwich", "club sandwich", "grilled", "classic", "veggies", "snack"] },
          { name: "Cheese Corn Sandwich", price: 130, isVeg: true, tags: ["sandwich", "cheese", "corn", "cheesy", "grilled", "snack"] },
          { name: "Peri Peri Paneer Sandwich", price: 160, isVeg: true, tags: ["sandwich", "peri peri", "paneer", "spicy", "cottage cheese"] },
          { name: "Cheese Chicken Sandwich", price: 170, isVeg: false, tags: ["sandwich", "chicken", "cheese", "cheesy", "grilled"] },
          { name: "Peri Peri Chicken Sandwich", price: 170, isVeg: false, tags: ["sandwich", "chicken", "peri peri", "spicy"] },
          { name: "Chicken Saute Sandwich", price: 190, isVeg: false, tags: ["sandwich", "chicken", "saute", "gourmet", "grilled"] },
        ],
      },
      {
        id: "burgers",
        name: "Burgers",
        chunkGroup: "Burgers",
        imageKey: "burger",
        items: [
          { name: "Crunchy Chicken Burger", price: 170, isVeg: false, badge: "BESTSELLER", description: "Crispy fried chicken fillet topped with coleslaw and spicy house dip.", tags: ["burger", "chicken", "crispy chicken", "patty", "crunchy"] },
          { name: "Spicy Chipotle Burger", price: 170, isVeg: true, badge: "POPULAR", tags: ["burger", "chipotle", "spicy", "patty", "mexican"] },
          { name: "OG Chicken Burger", price: 200, isVeg: false, badge: "POPULAR", tags: ["burger", "chicken", "original", "loaded", "patty"] },
          { name: "Chicken Steak Burger", price: 200, isVeg: false, badge: "SIGNATURE", tags: ["burger", "chicken steak", "grilled chicken", "patty", "gourmet"] },
          { name: "Veg Burger", price: 130, isVeg: true, tags: ["burger", "patty", "bun", "classic", "crispy patty", "snack"] },
        ],
      },
      {
        id: "pizza",
        name: "Pizza",
        chunkGroup: "Pizza",
        imageKey: "pizza",
        items: [
          { name: "Margherita Pizza", price: 190, isVeg: true, badge: "BESTSELLER", description: "San Marzano style tomato base, fresh basil & melted pure mozzarella.", tags: ["pizza", "margherita", "cheese", "mozzarella", "tomato basil", "classic", "pie"] },
          { name: "My Way 4 Way", price: 250, isVeg: false, badge: "SIGNATURE", description: "Chef's masterpiece: four quadrants of paneer, chicken, exotic veggies & pepperoni style bites.", tags: ["pizza", "four seasons", "assorted toppings", "loaded", "chicken", "paneer", "chef special"] },
          { name: "Farmhouse Garden Pizza", price: 190, isVeg: true, badge: "POPULAR", tags: ["pizza", "farmhouse", "garden fresh", "veggies", "cheese", "italian", "pie"] },
          { name: "Tandoori Chicken Pizza", price: 200, isVeg: false, badge: "POPULAR", tags: ["pizza", "chicken", "tandoori", "spicy", "cheese"] },
          { name: "Broccoli Spinach Pizza", price: 190, isVeg: true, tags: ["pizza", "broccoli", "spinach", "healthy", "cheese", "pie"] },
          { name: "Peri Peri Paneer Pizza", price: 200, isVeg: true, tags: ["pizza", "peri peri", "paneer", "spicy", "cheese", "cottage cheese"] },
          { name: "Roasted Garlic Mushroom Pizza", price: 200, isVeg: true, tags: ["pizza", "garlic", "mushroom", "cheese", "gourmet"] },
          { name: "Peri Peri Chicken Pizza", price: 200, isVeg: false, tags: ["pizza", "chicken", "peri peri", "spicy", "cheese"] },
          { name: "OG Chicken Pizza", price: 200, isVeg: false, tags: ["pizza", "chicken", "classic chicken", "cheese", "pie"] },
        ],
      },
      {
        id: "momos",
        name: "Momos",
        chunkGroup: "Momos",
        imageKey: "momos",
        items: [
          { name: "Chicken Steamed Momo", price: 170, isVeg: false, badge: "BESTSELLER", description: "Juicy minced chicken steamed in thin wrappers with fiery sesame dip.", tags: ["momos", "chicken", "dumpling", "dimsum", "steamed", "spicy chutney"] },
          { name: "Chicken Butter Chilli Garlic", price: 170, isVeg: false, badge: "BESTSELLER", description: "Pan-tossed dumplings in fragrant burnt garlic chili butter.", tags: ["momos", "chicken", "dumpling", "butter chilli garlic", "spicy"] },
          { name: "Veg Steamed Momo", price: 150, isVeg: true, badge: "POPULAR", tags: ["momos", "dumpling", "dimsum", "steamed", "tibetan", "spicy chutney"] },
          { name: "Veg Butter Chilli Garlic Momo", price: 150, isVeg: true, badge: "POPULAR", tags: ["momos", "dumpling", "butter chilli garlic", "spicy", "pan fried"] },
        ],
      },
    ],
  },
  {
    id: "drinks-desserts",
    label: "Drinks & Desserts",
    eyebrow: "Finish Strong",
    icon: "☕",
    description: "Artisan espresso brews, velvety frappes, thick ice-cream blends, coolers & hot sizzling brownies.",
    chunks: ["All", "Hot Coffee", "Cold Coffee", "Shakes", "Mocktails", "Desserts"],
    categories: [
      {
        id: "hot-coffee",
        name: "Hot Brews & Cocoa",
        chunkGroup: "Hot Coffee",
        imageKey: "coffee",
        items: [
          { name: "Hazelnut Hot Coffee", price: 90, isVeg: true, badge: "BESTSELLER", description: "Freshly pulled espresso with velvety steamed milk and roasted hazelnut.", tags: ["coffee", "hazelnut", "flavored coffee", "hot coffee", "latte", "cappuccino", "drink"] },
          { name: "Cadbury Hot Chocolate", price: 120, isVeg: true, badge: "BESTSELLER", description: "Rich molten Cadbury chocolate blended with creamy warm milk.", tags: ["hot chocolate", "chocolate", "cadbury", "cocoa", "sweet", "warm", "drink"] },
          { name: "Dalgona Coffee", price: 70, isVeg: true, badge: "POPULAR", tags: ["coffee", "dalgona", "whipped coffee", "hot coffee", "sweet", "drink"] },
          { name: "Espresso", price: 50, isVeg: true, tags: ["coffee", "hot coffee", "espresso", "caffeine", "black coffee", "shot", "beverage", "drink"] },
          { name: "Black Coffee", price: 60, isVeg: true, tags: ["coffee", "hot coffee", "black coffee", "americano", "caffeine", "diet", "keto", "drink"] },
          { name: "Tiramisu Hot Coffee", price: 90, isVeg: true, tags: ["coffee", "tiramisu", "flavored coffee", "hot coffee", "dessert coffee", "drink"] },
        ],
      },
      {
        id: "cold-coffee",
        name: "Chilled Frappes & Cold Brew",
        chunkGroup: "Cold Coffee",
        imageKey: "coffee",
        items: [
          { name: "Classic Cold Coffee", price: 110, isVeg: true, badge: "BESTSELLER", description: "Our cafe favorite thick blended cold coffee with creamy froth.", tags: ["coffee", "cold coffee", "iced coffee", "frappe", "beverage", "caffeine", "drink", "cold"] },
          { name: "The Big Sip", price: 200, isVeg: true, badge: "SIGNATURE", description: "Giant loaded frappe topped with ice cream, chocolate drizzle & wafer.", tags: ["coffee", "cold coffee", "giant shake", "thick frappe", "loaded coffee", "drink"] },
          { name: "Hazelnut Cold Coffee", price: 140, isVeg: true, badge: "POPULAR", tags: ["coffee", "hazelnut", "cold coffee", "frappe", "flavored coffee", "drink"] },
          { name: "Tiramisu Cold Coffee", price: 130, isVeg: true, badge: "POPULAR", tags: ["coffee", "tiramisu", "cold coffee", "iced coffee", "dessert coffee", "drink"] },
          { name: "Cold Brew", price: 130, isVeg: true, tags: ["coffee", "cold brew", "iced black coffee", "caffeine", "refreshing", "keto", "drink"] },
          { name: "Mochaccino", price: 160, isVeg: true, tags: ["coffee", "mochaccino", "mocha", "chocolate coffee", "cold coffee", "frappe", "drink"] },
        ],
      },
      {
        id: "shakes",
        name: "Thick Gourmet Shakes",
        chunkGroup: "Shakes",
        imageKey: "shakes",
        items: [
          { name: "Oreo Blend", price: 150, isVeg: true, badge: "BESTSELLER", description: "Crunchy Oreo cookies blended into rich vanilla and chocolate cream.", tags: ["shakes", "milkshake", "oreo", "cookie", "chocolate", "thick shake", "sweet", "drink"] },
          { name: "Brownie Blast", price: 170, isVeg: true, badge: "BESTSELLER", description: "Fudgy brownie blended into thick chocolate milkshake with dark chips.", tags: ["shakes", "milkshake", "brownie", "chocolate", "loaded", "thick shake", "dessert", "sweet", "drink"] },
          { name: "Ferrero Rocher Blend", price: 200, isVeg: true, badge: "SIGNATURE", description: "Premium Italian hazelnut chocolate shake topped with crushed wafers.", tags: ["shakes", "milkshake", "ferrero rocher", "hazelnut", "chocolate", "gourmet", "drink"] },
          { name: "Chocolate Box", price: 200, isVeg: true, badge: "SIGNATURE", tags: ["shakes", "milkshake", "chocolate", "triple chocolate", "overloaded", "sweet", "drink"] },
          { name: "Kit-Kat Blend", price: 170, isVeg: true, badge: "POPULAR", tags: ["shakes", "milkshake", "kit-kat", "chocolate", "wafer", "thick shake", "sweet", "drink"] },
          { name: "Alphonso King", price: 170, isVeg: true, tags: ["shakes", "milkshake", "mango", "alphonso", "fruit shake", "sweet", "summer", "drink"] },
          { name: "Strawberry Shake", price: 150, isVeg: true, tags: ["shakes", "milkshake", "strawberry", "fruit shake", "pink", "sweet", "drink"] },
        ],
      },
      {
        id: "mocktails-beverages",
        name: "Coolers & Beverages",
        chunkGroup: "Mocktails",
        imageKey: "mocktail",
        items: [
          { name: "Virgin Mojito", price: 110, isVeg: true, badge: "BESTSELLER", description: "Crushed fresh mint, lime wedges, simple syrup & sparkling soda.", tags: ["mocktail", "mojito", "mint", "lemon", "cooler", "refreshing", "cold drink", "soda", "drink"] },
          { name: "Blue Heaven", price: 120, isVeg: true, badge: "POPULAR", tags: ["mocktail", "blue curacao", "cooler", "refreshing", "summer drink", "drink"] },
          { name: "Sunrise Mojito", price: 140, isVeg: true, tags: ["mocktail", "sunrise", "mojito", "citrus", "layered drink", "refreshing", "cooler", "drink"] },
          { name: "Paloma", price: 140, isVeg: true, tags: ["mocktail", "paloma", "grapefruit", "citrus", "tangy", "cooler", "refreshing", "drink"] },
          { name: "Red Bull", price: 150, isVeg: true, tags: ["red bull", "energy drink", "caffeine", "cold drink", "soda", "drink"] },
          { name: "Diet Coke", price: 70, isVeg: true, tags: ["coke", "diet coke", "soda", "cold drink", "zero calorie", "carbonated", "drink"] },
          { name: "Packed Water", price: 10, isVeg: true, tags: ["water", "mineral water", "packaged water", "drink", "cold"] },
        ],
      },
      {
        id: "desserts",
        name: "Artisan Desserts",
        chunkGroup: "Desserts",
        imageKey: "dessert",
        items: [
          { name: "Hot Sizzling Brownie", price: 170, isVeg: true, badge: "BESTSELLER", description: "Warm gooey chocolate walnut brownie on a hot iron skillet with vanilla scoop & molten fudge.", tags: ["dessert", "brownie", "sizzling brownie", "hot chocolate", "cake", "ice cream", "sweet", "chocolate"] },
          { name: "Chocolate Ice Cream", price: 130, isVeg: true, badge: "POPULAR", tags: ["dessert", "ice cream", "chocolate", "sweet", "sundae", "cold"] },
          { name: "Vanilla Ice Cream", price: 120, isVeg: true, tags: ["dessert", "ice cream", "vanilla", "sweet", "sundae", "cold"] },
        ],
      },
    ],
  },
];

// 2. SOCIAL PROOF: ⭐ MOST ORDERED ITEMS (5-8 Genuine Top Items Max as required by Point 3)
export const mostOrderedItems: FeaturedItem[] = [
  {
    name: "Chicken Steamed Momo",
    price: 170,
    isVeg: false,
    badge: "BESTSELLER",
    description: "Juicy spiced minced chicken dumplings with hot red chutney.",
    categoryName: "Momos",
    sectionId: "cafe-bites",
    imageKey: "momos",
    tags: ["momos", "chicken", "bestseller"],
  },
  {
    name: "Margherita Pizza",
    price: 190,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Stone-baked crisp crust with pure mozzarella & fresh basil.",
    categoryName: "Pizza",
    sectionId: "cafe-bites",
    imageKey: "pizza",
    tags: ["pizza", "cheese", "margherita"],
  },
  {
    name: "Chilli Paneer",
    price: 170,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Crispy wok-tossed cottage cheese in rich soy-garlic sauce.",
    categoryName: "Veg Starters",
    sectionId: "asian-kitchen",
    imageKey: "starters",
    tags: ["paneer", "starter", "chinese"],
  },
  {
    name: "Chicken Hakka Noodles",
    price: 170,
    isVeg: false,
    badge: "BESTSELLER",
    description: "Street-style wok noodles tossed with tender chicken shreds.",
    categoryName: "Non-Veg Noodles",
    sectionId: "asian-kitchen",
    imageKey: "noodles",
    tags: ["noodles", "chicken", "hakka"],
  },
  {
    name: "Pink Sauce Pasta",
    price: 220,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Creamy blush pasta infused with parmesan & aromatic herbs.",
    categoryName: "Veg Pasta",
    sectionId: "continental",
    imageKey: "pasta",
    tags: ["pasta", "pink sauce", "italian"],
  },
  {
    name: "Classic Cold Coffee",
    price: 110,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Thick creamy frappe brewed fresh for maximum refreshment.",
    categoryName: "Cold Coffee",
    sectionId: "drinks-desserts",
    imageKey: "coffee",
    tags: ["coffee", "cold coffee", "frappe"],
  },
  {
    name: "Hot Sizzling Brownie",
    price: 170,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Sizzling cast-iron brownie with cold vanilla & melted chocolate.",
    categoryName: "Desserts",
    sectionId: "drinks-desserts",
    imageKey: "dessert",
    tags: ["brownie", "dessert", "chocolate"],
  },
  {
    name: "Peri Peri Fries",
    price: 140,
    isVeg: true,
    badge: "BESTSELLER",
    description: "Golden crispy potato fries dusted in zesty spicy peri peri.",
    categoryName: "Fries",
    sectionId: "asian-kitchen",
    imageKey: "bites",
    tags: ["fries", "peri peri", "snack"],
  },
];

// 3. GUIDED CHOICE: 🔥 HOUSE FAVOURITES (Signature & Chef Specials - Point 4 & 7)
export const houseFavourites: FeaturedItem[] = [
  {
    name: "Devil's Chicken",
    price: 240,
    isVeg: false,
    badge: "SIGNATURE",
    description: "Our spiciest wok-tossed chicken specialty with fiery red chili glaze.",
    categoryName: "Non-Veg Starters",
    sectionId: "asian-kitchen",
    imageKey: "starters",
    tags: ["chicken", "spicy", "signature"],
  },
  {
    name: "My Way 4 Way Pizza",
    price: 250,
    isVeg: false,
    badge: "SIGNATURE",
    description: "Chef's gourmet 4-quadrant pizza loaded with assorted meats & paneer.",
    categoryName: "Pizza",
    sectionId: "cafe-bites",
    imageKey: "pizza",
    tags: ["pizza", "loaded", "signature"],
  },
  {
    name: "The Big Sip",
    price: 200,
    isVeg: true,
    badge: "SIGNATURE",
    description: "Giant overloaded frappe crowned with ice cream & crisp chocolate wafers.",
    categoryName: "Cold Coffee",
    sectionId: "drinks-desserts",
    imageKey: "coffee",
    tags: ["coffee", "giant shake", "signature"],
  },
  {
    name: "Chicken Angara Sizzler",
    price: 340,
    isVeg: false,
    badge: "SIGNATURE",
    description: "Smoking iron platter with spicy barbecue chicken, herb rice & crispy fries.",
    categoryName: "Sizzlers",
    sectionId: "asian-kitchen",
    imageKey: "sizzlers",
    tags: ["sizzler", "chicken", "angara"],
  },
  {
    name: "PMT Panini",
    price: 190,
    isVeg: true,
    badge: "SIGNATURE",
    description: "Artisan pressed sourdough loaded with paneer, mushroom, tomato & mozzarella.",
    categoryName: "Panini",
    sectionId: "continental",
    imageKey: "bites",
    tags: ["panini", "paneer", "gourmet"],
  },
  {
    name: "Fire Cracker Cottage Cheese Bao",
    price: 200,
    isVeg: true,
    badge: "SIGNATURE",
    description: "Pillowy steamed bao buns stuffed with spicy glazed cottage cheese.",
    categoryName: "Bao",
    sectionId: "cafe-bites",
    imageKey: "bao",
    tags: ["bao", "paneer", "dimsum"],
  },
];
export const streetHeatFavourites = houseFavourites;

// 4. QUICK INTENT SHORTCUTS: "WHAT ARE YOU CRAVING?" (Specific Item Categories)
export const quickCravingShortcuts: QuickCraving[] = [
  {
    id: "craving-coffee",
    label: "Coffee",
    icon: "☕",
    imageKey: "coffee",
    targetType: "category",
    targetId: "hot-coffee",
    description: "Hot brews & frappes",
  },
  {
    id: "craving-pizza",
    label: "Pizza",
    icon: "🍕",
    imageKey: "pizza",
    targetType: "category",
    targetId: "pizza",
    description: "Fresh stone-baked pies",
  },
  {
    id: "craving-noodles",
    label: "Noodles",
    icon: "🍜",
    imageKey: "noodles",
    targetType: "category",
    targetId: "veg-noodles",
    description: "Wok-tossed noodles",
  },
  {
    id: "craving-pasta",
    label: "Pasta",
    icon: "🍝",
    imageKey: "pasta",
    targetType: "category",
    targetId: "veg-pasta",
    description: "Pink, alfredo & mac",
  },
  {
    id: "craving-sandwich",
    label: "Sandwich",
    icon: "🥪",
    imageKey: "sandwich",
    targetType: "category",
    targetId: "sandwiches",
    description: "Loaded grilled sandwiches",
  },
  {
    id: "craving-momos",
    label: "Momos",
    icon: "🥟",
    imageKey: "momos",
    targetType: "category",
    targetId: "momos",
    description: "Steamed & tossed dumplings",
  },
];


// 5. STATIC CONTEXTUAL PAIRINGS (Psychology Principle #9)
export const staticPairings: Record<string, StaticPairing> = {
  afterCoffee: {
    id: "pairing-coffee",
    eyebrow: "Perfect With Your Coffee",
    title: "PAIR WITH YOUR CUP ☕",
    subtitle: "Crisp artisanal bites and warm desserts that elevate your brew.",
    accentIcon: "☕",
    items: [
      { name: "Hot Sizzling Brownie", price: 170, isVeg: true, categoryName: "Desserts", sectionId: "drinks-desserts", tagline: "Warm molten chocolate paired with rich espresso" },
      { name: "Cheese Garlic Toast", price: 140, isVeg: true, categoryName: "Toasts", sectionId: "cafe-bites", tagline: "Crisp toasted bread loaded with melted cheese" },
      { name: "PMT Panini", price: 190, isVeg: true, categoryName: "Panini", sectionId: "continental", tagline: "Pressed paneer, mushroom & tomato sandwich" },
    ],
  },
  afterPizza: {
    id: "pairing-pizza",
    eyebrow: "Better Together",
    title: "PAIR IT WITH 🍕",
    subtitle: "Chilled coolers and golden fries to complete your cafe meal.",
    accentIcon: "🍕",
    items: [
      { name: "Classic Cold Coffee", price: 110, isVeg: true, categoryName: "Cold Coffee", sectionId: "drinks-desserts", tagline: "Thick creamy frappe to balance savory slices" },
      { name: "Virgin Mojito", price: 110, isVeg: true, categoryName: "Mocktails", sectionId: "drinks-desserts", tagline: "Refreshing mint-lime fizz cooler" },
      { name: "Peri Peri Fries", price: 140, isVeg: true, categoryName: "Fries", sectionId: "asian-kitchen", tagline: "Golden crispy fries dusted in fiery spices" },
    ],
  },
  afterDinner: {
    id: "pairing-dinner",
    eyebrow: "Sweet Ending",
    title: "FINISH STRONG 🍰",
    subtitle: "A meal at The Fire Point is never complete without a sweet sendoff.",
    accentIcon: "🍨",
    items: [
      { name: "Hot Sizzling Brownie", price: 170, isVeg: true, categoryName: "Desserts", sectionId: "drinks-desserts", tagline: "Cast-iron brownie sizzling in hot fudge" },
      { name: "Chocolate Ice Cream", price: 130, isVeg: true, categoryName: "Desserts", sectionId: "drinks-desserts", tagline: "Double chocolate cold scoop" },
      { name: "The Big Sip", price: 200, isVeg: true, categoryName: "Cold Coffee", sectionId: "drinks-desserts", tagline: "Giant loaded frappe dessert in a glass" },
    ],
  },
};

// 6. CATEGORY ARTWORK MAPPING
export const categoryImages: Record<string, string> = {
  starters: "/category-images/starters.svg",
  soup: "/category-images/soup.svg",
  noodles: "/category-images/noodles.svg",
  rice: "/category-images/rice.svg",
  sizzlers: "/category-images/sizzlers.svg",
  combo: "/category-images/combo.svg",
  pasta: "/category-images/pasta.svg",
  salad: "/category-images/salad.svg",
  grill: "/category-images/grill.svg",
  bites: "/category-images/bites.svg",
  toast: "/category-images/toast.svg",
  bao: "/category-images/bao.svg",
  sandwich: "/category-images/sandwich.svg",
  burger: "/category-images/burger.svg",
  pizza: "/category-images/pizza.svg",
  momos: "/category-images/momos.svg",
  coffee: "/category-images/coffee.svg",
  shakes: "/category-images/shakes.svg",
  mocktail: "/category-images/mocktail.svg",
  drinks: "/category-images/drinks.svg",
  dessert: "/category-images/dessert.svg",
};

// 7. POPULAR QUICK SEARCH KEYWORDS
export const popularQuickSearches = [
  "Pizza",
  "Noodles",
  "Cold Coffee",
  "Momos",
  "Chilli Paneer",
  "Pasta",
  "Burger",
  "Brownie",
  "Sizzler",
  "Mocktail",
  "Spicy",
];

// 8. SYNONYM DICTIONARY (For intelligent search & related concepts)
export const synonymDictionary: Record<string, string[]> = {
  // Asian & Chinese
  dumpling: ["momo", "momos", "bao"],
  dumplings: ["momo", "momos", "bao"],
  dimsum: ["momo", "momos", "bao"],
  dimsums: ["momo", "momos", "bao"],
  chowmein: ["noodles", "hakka"],
  ramen: ["noodles", "thupka", "soup"],
  soupy: ["soup", "thupka"],
  pulao: ["rice", "fried rice"],
  biryani: ["rice", "pot rice", "fried rice"],
  starter: ["starters", "crispy", "bites", "toast", "fries", "wings", "lollipop"],
  starters: ["starters", "crispy", "bites", "toast", "fries", "wings", "lollipop"],
  appetizer: ["starters", "crispy", "bites", "toast", "fries", "wings"],
  appetizers: ["starters", "crispy", "bites", "toast", "fries", "wings"],
  snack: ["bites", "fries", "maggi", "toast", "sandwich", "burger", "momos", "starters"],
  snacks: ["bites", "fries", "maggi", "toast", "sandwich", "burger", "momos", "starters"],

  // Italian & Continental
  pasta: ["pasta", "penne", "macaroni", "spaghetti", "pink sauce", "alfredo", "arrabbiata", "pesto", "aglio olio"],
  pastas: ["pasta", "penne", "macaroni", "spaghetti"],
  spaghetti: ["pasta", "noodles", "aglio olio"],
  macaroni: ["pasta", "macaroni cheese"],
  penne: ["pasta"],
  italian: ["pasta", "pizza", "aglio olio", "panini"],
  "white sauce": ["alfredo", "pasta"],
  "red sauce": ["arrabbiata", "pasta", "tomato"],
  "mixed sauce": ["pink sauce", "pasta"],
  slice: ["pizza"],
  pie: ["pizza"],

  // Quick Bites & Bakery
  bun: ["burger", "bao"],
  patty: ["burger"],
  bread: ["toast", "sandwich", "panini", "garlic toast"],
  "finger food": ["fries", "wings", "crispy veg", "crispy corn"],
  chips: ["french fries", "fries", "potato"],
  potato: ["potato", "fries", "honey chilli potato"],
  potatoes: ["potato", "fries", "honey chilli potato"],

  // Drinks, Coffee & Coolers
  drink: ["coffee", "shakes", "mocktail", "beverages", "coke", "water", "red bull", "cold coffee", "hot coffee"],
  drinks: ["coffee", "shakes", "mocktail", "beverages", "coke", "water", "red bull", "cold coffee", "hot coffee"],
  beverage: ["coffee", "shakes", "mocktail", "beverages", "coke", "water", "red bull"],
  beverages: ["coffee", "shakes", "mocktail", "beverages", "coke", "water", "red bull"],
  "cold drink": ["diet coke", "red bull", "mocktail", "cold coffee", "shakes"],
  "cold drinks": ["diet coke", "red bull", "mocktail", "cold coffee", "shakes"],
  refreshing: ["mocktail", "mojito", "cold brew", "cold coffee", "paloma", "blue heaven"],
  refreshment: ["mocktail", "mojito", "cold brew", "cold coffee", "paloma", "blue heaven"],
  juice: ["mocktail", "mojito", "paloma", "blue heaven", "alphonso king"],
  soda: ["diet coke", "coke", "red bull", "mocktail", "mojito"],
  coolers: ["mocktail", "virgin mojito", "blue heaven", "sunrise mojito", "paloma"],
  cooler: ["mocktail", "virgin mojito", "blue heaven", "sunrise mojito", "paloma"],
  cocktail: ["mocktail", "mojito", "paloma", "blue heaven"],
  cocktails: ["mocktail", "mojito", "paloma", "blue heaven"],
  caffeine: ["coffee", "espresso", "cold brew", "dalgona", "hazelnut", "tiramisu", "mochaccino", "red bull"],
  chai: ["coffee", "hot chocolate"],
  tea: ["coffee", "hot chocolate"],
  latte: ["hot coffee", "cold coffee", "hazelnut", "tiramisu", "mochaccino"],
  cappuccino: ["hot coffee", "cold coffee", "espresso", "hazelnut"],
  frappe: ["cold coffee", "the big sip", "mochaccino", "shakes"],
  milkshake: ["shakes", "blend", "oreo", "kit-kat", "brownie blast", "strawberry", "alphonso"],
  milkshakes: ["shakes", "blend", "oreo", "kit-kat", "brownie blast", "strawberry", "alphonso"],
  smoothie: ["shakes", "alphonso king", "strawberry shake"],
  energy: ["red bull"],
  water: ["packed water"],
  chocolate: ["cadbury hot chocolate", "hot chocolate", "chocolate ice cream", "hot sizzling brownie", "brownie blast", "chocolate box", "ferrero rocher", "kit-kat", "oreo"],
  cocoa: ["hot chocolate", "chocolate ice cream", "brownie", "chocolate box"],

  // Sweets & Desserts
  sweet: ["dessert", "ice cream", "brownie", "shakes", "chocolate", "hot chocolate"],
  sweets: ["dessert", "ice cream", "brownie", "shakes", "chocolate", "hot chocolate"],
  dessert: ["vanilla ice cream", "chocolate ice cream", "hot sizzling brownie", "shakes", "brownie"],
  desserts: ["vanilla ice cream", "chocolate ice cream", "hot sizzling brownie", "shakes", "brownie"],
  "ice cream": ["vanilla ice cream", "chocolate ice cream", "hot sizzling brownie"],
  icecream: ["vanilla ice cream", "chocolate ice cream", "hot sizzling brownie"],
  cake: ["hot sizzling brownie", "brownie blast"],
  sundae: ["hot sizzling brownie", "ice cream"],

  // Taste, Spiciness & Ingredients
  spicy: ["chilli", "schezwan", "devil", "peri peri", "thecha", "naga chilli", "cajun", "spicy chipotle", "angara"],
  spices: ["chilli", "schezwan", "devil", "peri peri", "thecha", "naga chilli", "cajun"],
  hot: ["chilli", "schezwan", "devil", "hot pan", "hot chocolate", "hot coffee", "hot sizzling brownie", "hot n sour"],
  cheesy: ["cheese", "cheese mayo fries", "cheese maggi", "cheese garlic toast", "cheese corn sandwich", "macaroni cheese", "margherita", "pmt panini"],
  cheese: ["cheese", "paneer", "cottage cheese", "cheese garlic toast", "cheese mayo fries", "cheese maggi", "macaroni cheese", "margherita"],
  paneer: ["cottage cheese", "paneer 65", "chilli paneer", "garlic paneer", "devil's paneer", "lemon paneer", "paneer fried rice", "paneer hot pan", "tandoori paneer", "peri peri paneer"],
  "cottage cheese": ["paneer", "bao", "chilli paneer"],
  chicken: ["non veg", "chicken", "lollipop", "wings", "angara", "afghani", "thecha", "teriyaki", "sambal"],
  poultry: ["chicken"],
  meat: ["chicken"],
  "non veg": ["chicken", "wings", "lollipop", "non veg"],
  nonveg: ["chicken", "wings", "lollipop", "non veg"],
  veg: ["veg", "paneer", "mushroom", "corn", "broccoli", "spinach"],
  vegetarian: ["veg", "paneer", "mushroom", "corn", "broccoli", "spinach"],
  healthy: ["salad", "soup", "broccoli", "spinach", "apple pear feta", "caesar salad", "benzaline salad", "clear soup", "lemon coriander"],
  diet: ["salad", "soup", "diet coke", "clear soup", "apple pear feta"],
  greens: ["salad", "soup", "broccoli", "spinach", "garden fresh"],
  salad: ["caesar salad", "benzaline salad", "apple pear feta salad"],
  fruit: ["apple pear feta", "alphonso king", "strawberry shake"],
  mango: ["alphonso king"],
  strawberry: ["strawberry shake"],
  garlic: ["garlic paneer", "garlic chicken", "burnt garlic", "chilli garlic", "cheese garlic toast", "roasted garlic mushroom"],
  mushroom: ["chilli mushroom", "roasted garlic mushroom pizza"],
  corn: ["crispy corn", "sweet corn soup", "cheese corn maggi", "salted pepper crispy corn", "cheese corn sandwich"],
  oreo: ["oreo blend"],
  kitkat: ["kit-kat blend"],
  ferrero: ["ferrero rocher blend"],
};
