/**
 * Utility for managing local image assets and fallbacks.
 */

export const PUBLIC_IMAGES = [
  '2962543.jpg',
  '2Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  '3Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  '493584.jpg',
  '4Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  '5Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  '6Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  '776717-lovebirds-wallpaper-1920x1080-for-full-hd.jpg',
  '7Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  'FGemini_Generated_Image_dx17y1dx17y1dx17.png',
  'Gemini_Generated_Image_19gho819gho819gh.png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (1).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (2).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (3).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (4).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (5).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (6).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (7).png',
  'Gemini_Generated_Image_2wzhlj2wzhlj2wzh.png',
  'Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  'Gemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  'OIP (2).jpg',
  'OIP (3).jpg',
  'OIP.jpg',
  'aGemini_Generated_Image_19gho819gho819gh.png',
  'bGemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  'cGemini_Generated_Image_19gho819gho819gh.png',
  'cGemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  'cat-7094808_1280.jpg',
  'e9a15fad-2221-4b54-b7d1-d560a9053d98.jpg',
  'f1Gemini_Generated_Image_dx17y1dx17y1dx17.png',
  'fGemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  'golden-retriever-cute-dogs.png',
  'make-realistic-colourful-fish-swimming-gracefully-tranquil-underwater-garden-photo-realist_1098360-2533.png',
  'pexels-diogo-miranda-2044514-20331914.jpg',
  'pexels-hnoody93-58997.jpg',
  'pet-bed-orthopedic.png',
  'popugai-pticy-zhivotnye-31997.jpg',
  'tGemini_Generated_Image_19gho819gho819gh.png',
  'white-hotot-rabbit-eating-grass-509265984-5c0da06546e0fb0001366ac0.jpg',
  'royal_canin_adult_dog_food.png',
  'taiyo_fish_food.png',
  'drools_ocean_fish.png',
  'erina_ep_shampoo.png',
  'veggie_sticks.png',
  'velvet_bed.png',
  'cooling_gel_mat.png',
  'digyton_drops.png',
  'farmina_dog_food.png',
  'pedigree_dog_food.png',
  'aquarium_tank.png',
  'bird_cage.png',
  'bird_flight_cage.png'
];

export const FALLBACK_IMAGES = {
  dog: '/images/Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  cat: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (7).png',
  bird: '/images/Gemini_Generated_Image_19gho819gho819gh.png',
  rabbit: '/images/fGemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  fish: '/images/FGemini_Generated_Image_dx17y1dx17y1dx17.png',
  food: '/images/493584.jpg',
  treats: '/images/2Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  toys: '/images/3Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  grooming: '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (5).png',
  health: '/images/Gemini_Generated_Image_xd5bcaxd5bcaxd5b.png',
  cleaning: '/images/5Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  accessories: '/images/6Gemini_Generated_Image_u7oiz0u7oiz0u7oi.png',
  bedding: '/images/pet-bed-orthopedic.png',
  cage: '/images/bird-cage-product.png',
  default: '/images/pexels-hnoody93-58997.jpg'
};

/**
 * Gets the most appropriate image for a pet.
 * @param {Object} pet - The pet object.
 * @returns {string} - The image URL.
 */
export const getPetImage = (pet) => {
  if (!pet) return FALLBACK_IMAGES.default;
  
  // 1. Check if pet already has images from API
  if (pet.images && pet.images.length > 0) {
    const primary = pet.images.find(img => img.is_primary) || pet.images[0];
    if (primary.image_url) {
      return normalizeImagePath(primary.image_url);
    }
  }

  // 2. Use type-based fallbacks
  const type = (pet.pet_type?.name || pet.pet_type || '').toString().toLowerCase();
  const name = (pet.name || '').toLowerCase();
  const breed = (pet.breed?.name || pet.breed || '').toString().toLowerCase();
  
  if (type.includes('dog') || name.includes('dog') || name.includes('puppy') || breed.includes('retriever') || breed.includes('labrador')) return FALLBACK_IMAGES.dog;
  if (type.includes('cat') || name.includes('cat') || name.includes('kitten') || breed.includes('persian') || breed.includes('siamese')) return FALLBACK_IMAGES.cat;
  if (type.includes('bird') || name.includes('bird') || name.includes('parrot') || name.includes('parakeet')) return FALLBACK_IMAGES.bird;
  if (type.includes('rabbit') || name.includes('rabbit') || name.includes('bunny')) return FALLBACK_IMAGES.rabbit;
  if (type.includes('fish') || name.includes('fish') || name.includes('betta') || name.includes('goldfish')) return FALLBACK_IMAGES.fish;

  return FALLBACK_IMAGES.default;
};

/**
 * Gets the most appropriate image for a product.
 * @param {Object} product - The product object.
 * @returns {string} - The image URL.
 */
export const getProductImage = (product) => {
  if (!product) return FALLBACK_IMAGES.food;

  // 1. Check if product already has images from API
  if (product.images && product.images.length > 0) {
    const primary = product.images.find(img => img.is_primary) || product.images[0];
    if (primary.image_url) {
      return normalizeImagePath(primary.image_url);
    }
  }

  // 2. Use highly specific keyword matching for names
  const name = (product.name || '').toLowerCase();
  const category = (product.category_name || product.category?.name || product.category_id || '').toString().toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const description = (product.short_description || '').toLowerCase();
  
  const combinedText = `${name} ${category} ${brand} ${description}`;

  // Priority 0: Exact/Highly Specific Name Matches (requested by user)
  const lowerName = name.toLowerCase();
  if (lowerName.includes('royal canin adult dog food')) return '/images/royal_canin_adult_dog_food.png';
  if (lowerName.includes('taiyo fish food')) return '/images/taiyo_fish_food.png';
  if (lowerName.includes('bird flight cage')) return '/images/bird_flight_cage.png';
  if (lowerName.includes('drools ocean fish')) return '/images/drools_ocean_fish.png';
  if (lowerName.includes('erina-ep shampoo') || lowerName.includes('erina ep shampoo')) return '/images/erina_ep_shampoo.png';
  if (lowerName.includes('veggie sticks')) return '/images/veggie_sticks.png';
  if (lowerName.includes('velvet bed')) return '/images/velvet_bed.png';
  if (lowerName.includes('cooling gel mat')) return '/images/cooling_gel_mat.png';
  if (lowerName.includes('digyton drops')) return '/images/digyton_drops.png';
  if (lowerName.includes('farmina n&d') || lowerName.includes('farmina')) return '/images/farmina_dog_food.png';
  if (lowerName.includes('pedigree adults') || lowerName.includes('pedigree')) return '/images/pedigree_dog_food.png';
  if (lowerName.includes('cage for birds') || lowerName.includes('bird cage')) return '/images/bird_cage.png';
  if (lowerName.includes('aquarium tank') || lowerName.includes('aquarium')) return '/images/aquarium_tank.png';

  // Species check
  const isDog = combinedText.includes('dog') || combinedText.includes('puppy') || combinedText.includes('pedigree') || combinedText.includes('drools') || combinedText.includes('royal canin') || combinedText.includes('farmina') || combinedText.includes('health up');
  const isCat = combinedText.includes('cat') || combinedText.includes('kitten') || combinedText.includes('whiskas') || combinedText.includes('siamese') || combinedText.includes('persian') || combinedText.includes('meow') || combinedText.includes('sheba');
  const isBird = combinedText.includes('bird') || combinedText.includes('parrot') || combinedText.includes('parakeet') || combinedText.includes('lovebird');
  const isFish = combinedText.includes('fish') || combinedText.includes('betta') || combinedText.includes('aquarium') || combinedText.includes('tank') || combinedText.includes('taiyo') || combinedText.includes('goldfish') || combinedText.includes('guppy');
  const isRabbit = combinedText.includes('rabbit') || combinedText.includes('bunny') || combinedText.includes('hamster') || combinedText.includes('veggie') || combinedText.includes('carrot');

  // Priority 1: Product-Focused Defaults (Avoid just showing the animal)
  
  // Food / Treats / Nutrition
  if (combinedText.includes('food') || combinedText.includes('treat') || combinedText.includes('sticks') || combinedText.includes('nutrition') || combinedText.includes('kibble') || combinedText.includes('grain')) {
    if (isCat) return '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (7).png';
    if (isFish) return '/images/FGemini_Generated_Image_dx17y1dx17y1dx17.png';
    if (isDog) return '/images/493584.jpg';
    if (isRabbit) return '/images/white-hotot-rabbit-eating-grass-509265984-5c0da06546e0fb0001366ac0.jpg';
    return FALLBACK_IMAGES.food;
  }

  // Grooming / Shampoo / Wash
  if (combinedText.includes('shampoo') || combinedText.includes('erina') || combinedText.includes('wash') || combinedText.includes('soap') || combinedText.includes('grooming') || combinedText.includes('brush')) {
    return FALLBACK_IMAGES.grooming;
  }

  // Health / Medicine / Drops
  if (combinedText.includes('drops') || combinedText.includes('digyton') || combinedText.includes('health') || combinedText.includes('medicine') || combinedText.includes('vitamin') || combinedText.includes('spray')) {
    return FALLBACK_IMAGES.health;
  }

  // Bedding / Bed / Mat
  if (combinedText.includes('bed') || combinedText.includes('mat') || combinedText.includes('cushion') || combinedText.includes('velvet') || combinedText.includes('orthopedic')) {
    return FALLBACK_IMAGES.bedding;
  }

  // Habitat / Cage / Tank
  if (combinedText.includes('cage') || combinedText.includes('aquarium') || combinedText.includes('tank') || combinedText.includes('house') || combinedText.includes('habitat')) {
    if (isBird) return '/images/bird-cage-product.png';
    if (isRabbit) return '/images/2962543.jpg';
    return FALLBACK_IMAGES.cage;
  }

  // Accessories / Collars / Leash
  if (combinedText.includes('collar') || combinedText.includes('leash') || combinedText.includes('harness') || combinedText.includes('belt') || combinedText.includes('accessories')) {
    return FALLBACK_IMAGES.accessories;
  }

  // Priority 2: Generic Product Fallbacks (Try to use product-related images even if generic)
  if (isCat) return '/images/Gemini_Generated_Image_2wzhlj2wzhlj2wzh (1).png'; // Cat bed/item
  if (isDog) return '/images/493584.jpg'; // Dog kibble
  if (isFish) return '/images/FGemini_Generated_Image_dx17y1dx17y1dx17.png'; // Fish item
  if (isBird) return '/images/popugai-pticy-zhivotnye-31997.jpg'; // Bird cage/perch
  if (isRabbit) return '/images/2962543.jpg'; // Rabbit item

  // Final Fallback for any product
  return FALLBACK_IMAGES.default;
};

/**
 * Gets a list of recommended images for a product based on its name and category.
 */
export const getRecommendedImages = (product) => {
  if (!product) return [];
  const name = (product.name || '').toLowerCase();
  const category = (product.category_name || product.category?.name || product.category_id || '').toString().toLowerCase();
  const combined = `${name} ${category}`.toLowerCase();

  const recommendations = new Set();

  // Keyword to image mappings
  const mappings = [
    { keys: ['dog', 'puppy', 'kibble', 'canin', 'pedigree', 'farmina'], images: ['royal_canin_adult_dog_food.png', 'pedigree_dog_food.png', 'farmina_dog_food.png', '493584.jpg'] },
    { keys: ['cat', 'kitten', 'meow', 'whiskas', 'drools'], images: ['drools_ocean_fish.png', 'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (7).png', 'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (1).png'] },
    { keys: ['fish', 'aqua', 'tank', 'taiyo', 'goldfish', 'betta'], images: ['taiyo_fish_food.png', 'aquarium_tank.png', 'FGemini_Generated_Image_dx17y1dx17y1dx17.png'] },
    { keys: ['bird', 'parrot', 'cage', 'flight', 'seed'], images: ['bird_flight_cage.png', 'bird_cage.png', 'bird-cage-product.png', 'Gemini_Generated_Image_19gho819gho819gh.png'] },
    { keys: ['rabbit', 'bunny', 'carrot', 'veggie'], images: ['veggie_sticks.png', 'white-hotot-rabbit-eating-grass-509265984-5c0da06546e0fb0001366ac0.jpg', '2962543.jpg'] },
    { keys: ['bed', 'mat', 'sleep', 'cushion', 'velvet', 'cooling'], images: ['velvet_bed.png', 'cooling_gel_mat.png', 'pet-bed-orthopedic.png'] },
    { keys: ['shampoo', 'wash', 'groom', 'erina', 'soap'], images: ['erina_ep_shampoo.png', 'Gemini_Generated_Image_2wzhlj2wzhlj2wzh (5).png'] },
    { keys: ['drops', 'health', 'medicine', 'digyton'], images: ['digyton_drops.png', 'Gemini_Generated_Image_xd5bcaxd5bcaxd5b.png'] },
  ];

  mappings.forEach(m => {
    if (m.keys.some(k => combined.includes(k))) {
      m.images.forEach(img => recommendations.add(img));
    }
  });

  return Array.from(recommendations).filter(img => PUBLIC_IMAGES.includes(img));
};

/**
 * Normalizes an image path to ensure it's valid for <img> tags.
 */
export const normalizeImagePath = (path) => {
  if (!path) return FALLBACK_IMAGES.default;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/images/${path}`;
};

/**
 * Global product sort order as requested by the user.
 */
export const PRODUCT_SORT_ORDER = [
  'Aquarium Tank',
  'Royal Canin Adult Dog Food',
  'Taiyo Fish Food',
  'Bird Flight Cage',
  'Drools Ocean Fish',
  'Erina-EP Shampoo',
  'Veggie Sticks',
  'Reversible Velvet Bed',
  'Cooling Gel Mat',
  'Digyton Drops',
  'Farmina N&D Grain Free Dog Food',
  'Pedigree Adult Dog Food',
  'Cage for Birds',
  'Whiskas Adult Cat Food'
];

/**
 * Sorts an array of products based on the PRODUCT_SORT_ORDER.
 * Products not in the list are placed at the end.
 */
export const sortProductsByOrder = (products) => {
  if (!Array.isArray(products)) return [];
  
  return [...products].sort((a, b) => {
    const indexA = PRODUCT_SORT_ORDER.findIndex(name => 
      a.name?.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(a.name?.toLowerCase())
    );
    const indexB = PRODUCT_SORT_ORDER.findIndex(name => 
      b.name?.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(b.name?.toLowerCase())
    );

    // If both are in the list, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only A is in the list, it comes first
    if (indexA !== -1) return -1;

    // If only B is in the list, it comes first
    if (indexB !== -1) return 1;

    // If neither is in the list, sort by ID (newest first) or name
    return parseInt(b.id || 0, 10) - parseInt(a.id || 0, 10);
  });
};

