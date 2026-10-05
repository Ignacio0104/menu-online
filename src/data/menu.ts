export type Variant = { label: string; price: number };
export type Option = { label: string; choices: string[] };
export type Product = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  variants: Variant[];
  options?: Option[];
};

export type Category = { id: string; name: string; products: Product[] };

// Foodish solo tiene estas categorías, así que se asignan por parecido.
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=480&h=360&fit=crop&auto=format&q=70`;

const POOLS = {
  pizza: [
    "1565299624946-b28f40a0ae38",
    "1513104890138-7c749659a591",
    "1574071318508-1cdbab80d002",
  ],
  burger: [
    "1568901346375-23c9450c58cd",
    "1550547660-d9450f859349",
    "1553979459-d2229ba7433b",
    "1561758033-d89a9ad46330",
  ],
  meat: [
    "1504674900247-0877df9cc836",
    "1555939594-58d7cb561ad1",
    "1544025162-d76694265947",
    "1432139555190-58524dae6a55",
  ],
  salad: [
    "1546069901-ba9599a7e63c",
    "1512621776951-a57141f2eefd",
    "1540189549336-e6e99c3679fe",
  ],
  fries: [
    "1573080496219-bb080dd4f877",
    "1630384060421-cb20d0e0649d",
    "1576107232684-1279f390859f",
  ],
  pasta: [
    "1473093295043-cdd812d0e601",
    "1621996346565-e3dbc646d9a9",
    "1567620905732-2d1ec7ab7445",
  ],
  brunch: ["1482049016688-2d3e1b311543", "1484723091739-30a097e8f929"],
  dessert: [
    "1565958011703-44f9829ba187",
    "1488477181946-6428a0291777",
    "1578985545062-69928b1d9587",
  ],
  wrap: ["1626700051175-6818013e1d4f", "1565299585323-38d6b0865b47"],
} as const;

const MOCK_CATEGORY: Record<string, keyof typeof POOLS> = {
  milanesas: "meat",
  sandwiches: "burger",
  empanadas: "meat",
  pizzas: "pizza",
  verduras: "salad",
  ensaladas: "salad",
  tortillas: "brunch",
  picoteamos: "fries",
  picada: "meat",
  tartas: "pasta",
  wraps: "wrap",
  postres: "dessert",
};

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const mockImage = (categoryId: string, productId: string) => {
  const pool = POOLS[MOCK_CATEGORY[categoryId] ?? "burger"];
  return U(pool[hash(productId) % pool.length]);
};
const v = (label: string, price: number): Variant => ({ label, price });
const one = (price: number): Variant[] => [v("Único", price)];

const TIPO_MILA: Option[] = [
  { label: "Tipo", choices: ["Carne", "Pollo", "Cerdo", "Pescado"] },
];
const mila = (
  id: string,
  name: string,
  description: string,
  uno: number,
  tres: number,
): Product => ({
  id: `mila-${id}`,
  name,
  description,
  variants: [v("Una", uno), v("Tres", tres)],
  options: TIPO_MILA,
});

const BASE_VEG: Option[] = [
  { label: "Base", choices: ["Soja", "Calabaza", "Berenjena"] },
];
const veg = (id: string, name: string, description: string): Product => ({
  id: `veg-${id}`,
  name,
  description,
  variants: one(9500),
  options: BASE_VEG,
});

const emp = (
  id: string,
  name: string,
  unidad: number,
  docena: number,
): Product => ({
  id: `emp-${id}`,
  name: `Empanada de ${name}`,
  variants: [v("Unidad", unidad), v("Docena", docena)],
});

const simple = (
  id: string,
  name: string,
  price: number,
  description?: string,
): Product => ({
  id,
  name,
  description,
  variants: one(price),
});

const dual = (id: string, name: string, a: number, b: number): Product => ({
  id,
  name,
  variants: [v("Chica", a), v("Grande", b)],
});

const rawMenu: Category[] = [
  {
    id: "milanesas",
    name: "Milanesas",
    products: [
      mila(
        "clasica",
        "Clásica",
        "Rebozada con pan rallado y avena",
        13600,
        40000,
      ),
      mila("caballo", "A caballo", "Con huevos fritos", 16400, 47700),
      mila(
        "napolitana",
        "Napolitana",
        "Salsa de tomate, jamón, muzzarella y rodajas de tomate",
        17800,
        51900,
      ),
      mila(
        "5quesos",
        "5 Quesos",
        "Provolone, muzzarella, parmesano, cheddar y roquefort",
        19900,
        58200,
      ), // TODO: precio
      mila(
        "fugazzeta",
        "Fugazzeta",
        "Cebolla, queso fresco y parmesano gratinado",
        17800,
        51900,
      ),
      mila(
        "florentina",
        "Florentina",
        "Acelga, salsa blanca y queso fresco",
        17800,
        51900,
      ),
      mila(
        "capresse",
        "Capresse",
        "Salsa de tomate, muzzarella, tomate fresco, albahaca y aceituna negra",
        17800,
        51900,
      ),
      mila(
        "calabresa",
        "Calabresa",
        "Salsa de tomate, muzzarella y cantimpalo",
        19800,
        57900,
      ),
      mila(
        "parmesana",
        "Parmesana",
        "Salsa de tomate, parmesano, crudo, muzzarella y rúcula",
        19900,
        58200,
      ),
      mila(
        "provolone",
        "Provolone",
        "Salsa de tomate, provolone y queso fresco",
        21400,
        62700,
      ),
      mila(
        "roquefort",
        "Roquefort",
        "Salsa de tomate, queso fresco y roquefort",
        22400,
        65700,
      ),
      mila(
        "suiza",
        "Suiza",
        "Salsa blanca con queso sardo, muzzarella y provolone",
        17800,
        51900,
      ),
      mila(
        "bandfilena",
        "Bandfileña",
        "Salsa portuguesa, muzzarella, panceta y huevo",
        22400,
        65700,
      ),
      mila(
        "panceta-cheddar",
        "Panceta y cheddar",
        "Panceta, cebolla y queso cheddar",
        23700,
        69600,
      ),
    ],
  },
  {
    id: "sandwiches",
    name: "Sándwiches",
    products: [
      {
        id: "sandwich-mila",
        name: "Sándwich de milanesa",
        description: "Elegí el agregado y la cantidad",
        options: TIPO_MILA,
        variants: [
          v("Solo x1", 7900),
          v("Solo x3", 12900),
          v("+ Lechuga y tomate x1", 8900),
          v("+ Lechuga y tomate x3", 14700),
          v("+ Napolitano x1", 10700),
          v("+ Napolitano x3", 16800),
          v("+ Completo (J, Q, L, T, H) x1", 10700),
          v("+ Completo (J, Q, L, T, H) x3", 16800),
          v("+ Panceta y cheddar x1", 14300),
          v("+ Panceta y cheddar x3", 23800),
          v("+ Fugazzeta x1", 10700),
          v("+ Fugazzeta x3", 16800),
        ],
      },
    ],
  },
  {
    id: "empanadas",
    name: "Empanadas",
    products: [
      // TODO: confirmar qué sabor corresponde a cada precio
      emp("verdura", "verdura", 1600, 17700),
      emp("capresse", "capresse", 1600, 17700),
      emp("cebolla-queso", "cebolla y queso", 1600, 17700),
      emp("humita", "humita", 1600, 17700),
      emp("jamon-queso", "jamón y queso", 2000, 22500),
      emp("carne-suave", "carne suave", 2000, 22500),
      emp("pollo", "pollo", 2000, 22500),
      emp("carne-cuchillo", "carne cortada a cuchillo frita", 2600, 29700),
      emp("atun", "atún", 2600, 29700),
    ],
  },
  {
    id: "pizzas",
    name: "Pizzas",
    products: [
      // TODO: confirmar qué sabor corresponde a cada precio
      simple("pizza-muzza", "Muzzarella", 4500),
      simple("pizza-huevo", "Huevo", 4900),
      simple("pizza-jamon", "Jamón", 4900),
      simple("pizza-fugazzeta", "Fugazzeta", 5500),
      simple("pizza-calabresa", "Calabresa", 5900),
      simple("pizza-jamon-morron", "Jamón y morrón", 5900),
      simple("pizza-roquefort", "Roquefort", 6000),
      simple("pizza-florentina", "Florentina", 6000),
      simple("pizza-provolone", "Provolone", 6900),
      simple("pizza-rucula-crudo", "Rúcula y crudo", 6900),
    ],
  },
  {
    id: "verduras",
    name: "Soja, calabaza o berenjena",
    products: [
      veg("al-toque", "Al toque", "Queso fresco, rodajas de tomate y orégano"),
      veg("fugazzeta", "Fugazzeta", "Cebolla dorada, queso fresco y orégano"),
      veg(
        "florentina",
        "Florentina",
        "Acelga, salsa blanca, muzzarella y parmesano gratinado",
      ),
      veg(
        "capresse",
        "Capresse",
        "Muzzarella, tomate, albahaca y aceituna negra",
      ),
    ],
  },
  {
    id: "ensaladas",
    name: "Ensaladas",
    products: [
      simple(
        "ens-caesar",
        "Caesar",
        9000,
        "Lechuga, blanco de ave, croutons, parmesano y salsa caesar",
      ),
      simple(
        "ens-mediterranea",
        "Mediterránea",
        7400,
        "Rúcula, aceituna negra, cherry, muzzarella y berenjenas asadas",
      ),
      {
        id: "ens-salpicon",
        name: "Salpicón",
        description: "Lechuga, tomate, zanahoria, choclo, huevo y arvejas",
        variants: [
          v("Sola", 5500),
          v("+ Pollo", 9800),
          v("+ Jamón y queso", 9800),
          v("+ Atún", 13800),
        ],
      },
    ],
  },
  {
    id: "tortillas",
    name: "Tortillas",
    products: [
      simple("tort-papa", "Tortilla de papa", 7500),
      simple("tort-espanola", "Tortilla a la española", 10500),
    ],
  },
  {
    id: "picoteamos",
    name: "¿Picoteamos?",
    products: [
      dual("pico-cheddar", "Papas fritas con cheddar", 9300, 11900),
      dual(
        "pico-cheddar-panceta",
        "Papas fritas con cheddar y panceta",
        10800,
        13600,
      ),
      {
        id: "pico-croquetas",
        name: "Croquetas de acelga",
        variants: [
          v("Unidad", 1500),
          v("Media docena", 5000),
          v("Docena", 8000),
        ], // TODO: confirmar
      },
      dual("pico-papas", "Papas fritas", 6200, 8900),
      dual("pico-provenzal", "Papas fritas provenzal", 7200, 9900),
      dual("pico-ensalada", "Ensalada 3 gustos", 3500, 5500),
      dual("pico-pure", "Puré de calabaza o papa", 3500, 5500),
    ],
  },
  {
    id: "picada",
    name: "Picada gourmet",
    products: [
      simple(
        "picada-gourmet",
        "Picada gourmet para 4",
        69900,
        "10 bombitas de papa con jamón y queso, 10 bastoncitos de muzzarella, 10 croquetitas de verdura, 10 aros de cebolla, bandeja de papas rústicas, 10 salchichitas, 4 figacitas de milanesa (napolitana y fugazzeta), 4 figacitas de suprema (napolitana y fugazzeta) y 2 dips de salsa",
      ),
    ],
  },
  {
    id: "tartas",
    name: "Tartas",
    products: [
      simple("tarta-verdura", "Verdura y queso", 5500),
      simple("tarta-jamon", "Jamón, queso, tomate y huevo", 6000),
      simple("tarta-puerro", "Puerro y queso", 5500),
      simple("tarta-calabaza", "Calabaza y queso", 5500),
    ],
  },
  {
    id: "wraps",
    name: "Wraps",
    products: [
      simple(
        "wrap-veg",
        "Vegetariano",
        5500,
        "Salteado de vegetales, salsa teriyaki y queso",
      ),
      simple(
        "wrap-pollo",
        "Pollo",
        6900,
        "Salteado de vegetales, pollo y salsa barbacoa",
      ),
      simple("wrap-capresse", "Capresse", 6000),
    ],
  },
  {
    id: "postres",
    name: "¿Y de postre?",
    products: [
      simple("postre-chocotorta", "Chocotorta", 8500),
      simple("postre-tiramisu", "Tiramisú", 8500),
      simple("postre-oreo", "Postre Oreo", 8500),
      simple("postre-budin", "Budín de pan", 4000),
      simple("postre-flan", "Flan casero", 4000),
      simple("postre-frutas", "Ensalada de frutas", 4000), // TODO: precio
    ],
  },
];

export const menu: Category[] = rawMenu.map((c) => ({
  ...c,
  products: c.products.map((p) => ({
    ...p,
    image: p.image ?? mockImage(c.id, p.id),
  })),
}));
