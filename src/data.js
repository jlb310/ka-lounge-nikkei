// @ts-check
/**
 * Carta referencial del prototipo.
 * Platos, ingredientes, alérgenos y disponibilidad son contenido de ejemplo
 * para la demo: deben validarse con el local antes de cualquier uso real.
 */

/** @typedef {'gluten'|'crustaceos'|'moluscos'|'pescado'|'soya'|'huevo'|'lacteos'|'sesamo'|'frutos_secos'|'sulfitos'} AllergenId */
/** @typedef {'disponible'|'limitado'|'agotado'} Availability */

/**
 * @typedef {Object} Dish
 * @property {string} id
 * @property {string} name
 * @property {string} [jp] Nombre o guiño en japonés (decorativo)
 * @property {string} description
 * @property {string[]} ingredients
 * @property {AllergenId[]} allergens
 * @property {string} [allergenNote] Nota adicional (trazas, adaptaciones)
 * @property {Availability} availability
 * @property {string} [availabilityNote]
 * @property {boolean} [vegetarian]
 * @property {boolean} [spicy]
 */

/**
 * @typedef {Object} Cocktail
 * @property {string} id
 * @property {string} name
 * @property {string} base
 * @property {string} explanation Qué es y cómo se siente al tomarlo
 * @property {string[]} ingredients
 * @property {{ acidez: number, dulzor: number, intensidad: number }} profile Escala 1–5
 * @property {AllergenId[]} allergens
 * @property {string} [allergenNote]
 * @property {Availability} availability
 * @property {string} [availabilityNote]
 * @property {boolean} [alcoholFree]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} label
 * @property {string} kanji Ornamento visual
 * @property {string} intro
 * @property {'dish'|'cocktail'} kind
 * @property {(Dish|Cocktail)[]} items
 */

/** @type {Record<AllergenId, { label: string, short: string }>} */
export const ALLERGENS = {
  gluten: { label: 'Gluten', short: 'GL' },
  crustaceos: { label: 'Crustáceos', short: 'CR' },
  moluscos: { label: 'Moluscos', short: 'MO' },
  pescado: { label: 'Pescado', short: 'PE' },
  soya: { label: 'Soya', short: 'SO' },
  huevo: { label: 'Huevo', short: 'HU' },
  lacteos: { label: 'Lácteos', short: 'LA' },
  sesamo: { label: 'Sésamo', short: 'SE' },
  frutos_secos: { label: 'Frutos secos', short: 'FS' },
  sulfitos: { label: 'Sulfitos', short: 'SU' },
};

/** @type {Record<Availability, { label: string }>} */
export const AVAILABILITY = {
  disponible: { label: 'Disponible' },
  limitado: { label: 'Pocas unidades' },
  agotado: { label: 'Agotado hoy' },
};

/** @type {Category[]} */
export const MENU = [
  {
    id: 'entradas',
    label: 'Para empezar',
    kanji: '始',
    kind: 'dish',
    intro: 'Bocados para compartir mientras llega la primera ronda.',
    items: [
      {
        id: 'gyozas-aji',
        name: 'Gyozas de cerdo y ají amarillo',
        jp: '餃子',
        description: 'Selladas a la plancha, con un ponzu cítrico de ají amarillo para mojar.',
        ingredients: ['Masa de trigo', 'Cerdo', 'Repollo', 'Cebollín', 'Jengibre', 'Ponzu de ají amarillo'],
        allergens: ['gluten', 'soya', 'sesamo'],
        availability: 'disponible',
      },
      {
        id: 'edamame',
        name: 'Edamame tostado',
        jp: '枝豆',
        description: 'Vainas salteadas con sal de mar, limón de pica y un toque de togarashi.',
        ingredients: ['Edamame', 'Sal de mar', 'Limón de pica', 'Togarashi'],
        allergens: ['soya'],
        allergenNote: 'Apto vegetariano y sin gluten en su preparación.',
        availability: 'disponible',
        vegetarian: true,
        spicy: true,
      },
      {
        id: 'causa-atun',
        name: 'Causa Nikkei de atún picante',
        description: 'Papa amarilla prensada con limón y ají, coronada con atún en mayo spicy.',
        ingredients: ['Papa amarilla', 'Ají amarillo', 'Atún', 'Mayonesa spicy', 'Palta', 'Sésamo tostado'],
        allergens: ['pescado', 'huevo', 'sesamo'],
        availability: 'limitado',
        availabilityNote: 'Se prepara en tandas cortas.',
        spicy: true,
      },
    ],
  },
  {
    id: 'ceviches',
    label: 'Ceviches y tiraditos',
    kanji: '鮮',
    kind: 'dish',
    intro: 'Donde Lima y Tokio se encuentran: leche de tigre, soya y cítricos.',
    items: [
      {
        id: 'ceviche-nikkei',
        name: 'Ceviche Nikkei',
        description: 'Pesca del día en leche de tigre con soya, jengibre y aceite de sésamo.',
        ingredients: ['Pescado blanco del día', 'Leche de tigre', 'Soya', 'Jengibre', 'Cebolla morada', 'Camote glaseado', 'Choclo'],
        allergens: ['pescado', 'soya', 'sesamo', 'gluten'],
        allergenNote: 'La soya tradicional contiene gluten; consultar versión con tamari.',
        availability: 'disponible',
        availabilityNote: 'Sujeto a la pesca del día.',
      },
      {
        id: 'tiradito-maracuya',
        name: 'Tiradito de salmón y maracuyá',
        description: 'Láminas finas de salmón con salsa de maracuyá, ají limo y cebollín.',
        ingredients: ['Salmón', 'Maracuyá', 'Ají limo', 'Cebollín', 'Quinoa crocante'],
        allergens: ['pescado'],
        availability: 'disponible',
        spicy: true,
      },
      {
        id: 'ceviche-mixto',
        name: 'Ceviche mixto acevichado',
        description: 'Pescado, camarón y pulpo con salsa acevichada cremosa y toques de rocoto.',
        ingredients: ['Pescado', 'Camarón', 'Pulpo', 'Salsa acevichada', 'Rocoto', 'Cancha'],
        allergens: ['pescado', 'crustaceos', 'moluscos', 'huevo'],
        availability: 'agotado',
        availabilityNote: 'Vuelve con el próximo despacho de mariscos.',
        spicy: true,
      },
    ],
  },
  {
    id: 'rolls',
    label: 'Makis y rolls',
    kanji: '巻',
    kind: 'dish',
    intro: 'Diez cortes por roll. Arroz de sushi aliñado con vinagre de arroz.',
    items: [
      {
        id: 'acevichado-roll',
        name: 'Acevichado roll',
        jp: '巻き',
        description: 'Langostino furai y palta por dentro; por fuera, salmón y salsa acevichada gratinada.',
        ingredients: ['Arroz de sushi', 'Nori', 'Langostino en panko', 'Palta', 'Salmón', 'Salsa acevichada'],
        allergens: ['gluten', 'crustaceos', 'pescado', 'huevo', 'soya'],
        availability: 'disponible',
      },
      {
        id: 'furai-roll',
        name: 'Furai roll de queso y salmón',
        description: 'Roll apanado y frito, relleno de salmón, queso crema y cebollín. Con salsa tare.',
        ingredients: ['Arroz de sushi', 'Nori', 'Salmón', 'Queso crema', 'Cebollín', 'Panko', 'Salsa tare'],
        allergens: ['gluten', 'pescado', 'lacteos', 'huevo', 'soya'],
        availability: 'disponible',
      },
      {
        id: 'huerta-roll',
        name: 'Roll de la huerta',
        description: 'Espárrago tempura, pepino, palta y mango, envuelto en sésamo mixto.',
        ingredients: ['Arroz de sushi', 'Nori', 'Espárrago tempura', 'Pepino', 'Palta', 'Mango', 'Sésamo'],
        allergens: ['gluten', 'sesamo', 'soya'],
        allergenNote: 'Vegetariano. Se puede pedir sin tempura para evitar gluten.',
        availability: 'limitado',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'nigiris',
    label: 'Nigiris y sashimi',
    kanji: '握',
    kind: 'dish',
    intro: 'Cortes limpios para apreciar el producto. Dos piezas por nigiri.',
    items: [
      {
        id: 'nigiri-salmon-flameado',
        name: 'Nigiri de salmón flameado',
        jp: '炙り',
        description: 'Salmón sellado al soplete con salsa nikkei y un punto de ralladura de lima.',
        ingredients: ['Arroz de sushi', 'Salmón', 'Salsa nikkei', 'Lima'],
        allergens: ['pescado', 'soya', 'gluten'],
        availability: 'disponible',
      },
      {
        id: 'sashimi-mixto',
        name: 'Sashimi mixto (12 cortes)',
        jp: '刺身',
        description: 'Selección de salmón, atún y pesca blanca. Con wasabi, gari y soya aparte.',
        ingredients: ['Salmón', 'Atún', 'Pescado blanco', 'Wasabi', 'Jengibre encurtido'],
        allergens: ['pescado'],
        allergenNote: 'La soya va aparte: sin gluten si se omite.',
        availability: 'limitado',
        availabilityNote: 'Según corte disponible.',
      },
    ],
  },
  {
    id: 'calientes',
    label: 'Fondos calientes',
    kanji: '炎',
    kind: 'dish',
    intro: 'Wok, brasa y fuego alto para los platos de fondo.',
    items: [
      {
        id: 'chaufa-nikkei',
        name: 'Arroz chaufa Nikkei',
        description: 'Arroz salteado al wok con huevo, cebollín, kion y trozos de pollo a la brasa.',
        ingredients: ['Arroz', 'Pollo', 'Huevo', 'Cebollín', 'Kion (jengibre)', 'Salsa de ostión', 'Soya'],
        allergens: ['huevo', 'soya', 'gluten', 'moluscos'],
        allergenNote: 'La salsa de ostión contiene moluscos.',
        availability: 'disponible',
      },
      {
        id: 'pulpo-anticuchero',
        name: 'Pulpo anticuchero',
        description: 'Pulpo a la parrilla con marinada anticuchera, papas nativas y mayo de olivo.',
        ingredients: ['Pulpo', 'Ají panca', 'Papas nativas', 'Aceituna de botija', 'Mayonesa'],
        allergens: ['moluscos', 'huevo'],
        availability: 'disponible',
      },
      {
        id: 'saltado-tofu',
        name: 'Saltado de tofu y hongos',
        description: 'Tofu dorado, shiitake y verduras al wok con salsa de soya y vinagre de arroz.',
        ingredients: ['Tofu', 'Shiitake', 'Cebolla morada', 'Tomate', 'Soya', 'Vinagre de arroz', 'Arroz blanco'],
        allergens: ['soya', 'gluten'],
        allergenNote: 'Vegetariano y sin lácteos.',
        availability: 'disponible',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'postres',
    label: 'Postres',
    kanji: '甘',
    kind: 'dish',
    intro: 'Cierres dulces con sabores de los dos lados del Pacífico.',
    items: [
      {
        id: 'suspiro-matcha',
        name: 'Suspiro de matcha',
        jp: '抹茶',
        description: 'Manjar blanco suave con merengue de té matcha y polvo de canela.',
        ingredients: ['Leche', 'Huevo', 'Azúcar', 'Té matcha', 'Canela'],
        allergens: ['lacteos', 'huevo'],
        availability: 'disponible',
        vegetarian: true,
      },
      {
        id: 'mochi-lucuma',
        name: 'Mochi de lúcuma',
        jp: '餅',
        description: 'Masa de arroz glutinoso rellena de helado de lúcuma.',
        ingredients: ['Harina de arroz glutinoso', 'Helado de lúcuma', 'Fécula de maíz'],
        allergens: ['lacteos'],
        allergenNote: 'El arroz «glutinoso» no contiene gluten.',
        availability: 'agotado',
        vegetarian: true,
      },
    ],
  },
  {
    id: 'cocteles',
    label: 'Cócteles',
    kanji: '酒',
    kind: 'cocktail',
    intro: 'Cada trago explicado: de qué está hecho, qué esperar y cuán intenso es.',
    items: [
      {
        id: 'pisco-sour-nikkei',
        name: 'Pisco sour Nikkei',
        base: 'Pisco',
        explanation:
          'El clásico peruano con un giro: jarabe de jengibre y unas gotas de yuzu. Espuma sedosa por la clara de huevo, entrada ácida y final cálido de jengibre.',
        ingredients: ['Pisco', 'Limón de pica', 'Jarabe de jengibre', 'Yuzu', 'Clara de huevo', 'Amargo de angostura'],
        profile: { acidez: 4, dulzor: 2, intensidad: 3 },
        allergens: ['huevo'],
        allergenNote: 'Se puede pedir sin clara (con aquafaba).',
        availability: 'disponible',
      },
      {
        id: 'chilcano-maracuya',
        name: 'Chilcano de maracuyá',
        base: 'Pisco',
        explanation:
          'Trago largo y refrescante: pisco con ginger ale, limón y pulpa de maracuyá. Liviano, burbujeante, ideal para acompañar ceviches.',
        ingredients: ['Pisco', 'Ginger ale', 'Limón', 'Maracuyá', 'Hielo'],
        profile: { acidez: 3, dulzor: 3, intensidad: 2 },
        allergens: [],
        availability: 'disponible',
      },
      {
        id: 'matcha-highball',
        name: 'Matcha highball',
        base: 'Whisky japonés',
        explanation:
          'Whisky alargado con soda y un batido de té matcha. Herbal, seco y muy limpio: para quienes no buscan dulzor.',
        ingredients: ['Whisky japonés', 'Soda', 'Té matcha', 'Piel de limón'],
        profile: { acidez: 1, dulzor: 1, intensidad: 3 },
        allergens: ['gluten'],
        allergenNote: 'Destilado de cereales: consultar si hay celiaquía.',
        availability: 'limitado',
        availabilityNote: 'Stock acotado de whisky japonés.',
      },
      {
        id: 'sake-tonic',
        name: 'Sake tonic de pepino',
        base: 'Sake',
        explanation:
          'Sake con agua tónica, pepino y shiso. Baja graduación, aromático y floral: una buena puerta de entrada al sake.',
        ingredients: ['Sake', 'Agua tónica', 'Pepino', 'Hoja de shiso', 'Hielo'],
        profile: { acidez: 2, dulzor: 2, intensidad: 1 },
        allergens: ['sulfitos'],
        availability: 'disponible',
      },
      {
        id: 'limonada-kion',
        name: 'Limonada de kion y hierbabuena',
        base: 'Sin alcohol',
        explanation:
          'Limonada frapeada con jengibre fresco y hierbabuena. Picor suave del kion y mucha frescura; apta para toda la mesa.',
        ingredients: ['Limón', 'Jengibre fresco', 'Hierbabuena', 'Jarabe de caña', 'Hielo'],
        profile: { acidez: 4, dulzor: 3, intensidad: 1 },
        allergens: [],
        availability: 'disponible',
        alcoholFree: true,
      },
    ],
  },
];

/** Número público de referencia. El canal aún no está confirmado con el local. */
export const PHONE = {
  display: '+56 9 9396 9210',
  href: '#',
  label: 'Canal por confirmar',
};
