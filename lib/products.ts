export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  images: string[]
  stock: number
  features: string[]
  technicalSpecs?: string[]
  category?: string
  story?: string
  reviews: Review[]
}

export const products: Product[] = [
  {
    id: "tracker-anti-perte",
    name: "Tracker Anti-Perte de Cles Bluetooth",
    description: "Ne perdez plus jamais vos objets precieux. Fixez ce mini-tracker a vos cles, sac ou portefeuille et retrouvez-les en un clic depuis votre smartphone.",
    price: 3000,
    oldPrice: 5000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop"
    ],
    stock: 45,
    category: "Accessoires Tech",
    story: "Nous avons tous vecu ce moment de panique en cherchant nos cles. Ce petit tracker intelligent a ete concu pour mettre fin a ce stress quotidien.",
    features: [
      "Alarme sonore bidirectionnelle",
      "Localisation GPS via application mobile",
      "Batterie longue duree (pile incluse)",
      "Design ultra-leger et discret"
    ],
    technicalSpecs: [
      "Autonomie : jusqu'à 12 mois (pile incluse)",
      "Matériaux : ABS résistant et anneau en acier",
      "Dimensions : 38 × 38 × 7 mm",
      "Connexion : Bluetooth basse consommation"
    ],
    reviews: [
      {
        id: "r1",
        author: "Kouame Michel",
        rating: 5,
        comment: "Excellent produit ! Je ne perds plus mes cles maintenant.",
        date: "15 Mai 2026"
      },
      {
        id: "r2",
        author: "Aminata Diallo",
        rating: 4,
        comment: "Tres pratique, la batterie dure longtemps.",
        date: "12 Mai 2026"
      }
    ]
  },
  {
    id: "corde-combat-sans-fil",
    name: "Corde de Combat Sans Fil Premium",
    description: "Brulez un maximum de calories ou que vous soyez. Ideal pour le crossfit et le fitness a la maison, sans risque de casser les objets autour de vous.",
    price: 15000,
    oldPrice: 22000,
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop"
    ],
    stock: 20,
    category: "Sport & Fitness",
    story: "Concu pour les sportifs urbains qui veulent s'entrainer partout sans contrainte d'espace. Parfait pour les appartements et les voyages.",
    features: [
      "Balles lestees pour une sensation de resistance reelle",
      "Compteur digital integre (calories, sauts, temps)",
      "Poignees ergonomiques antiderapantes",
      "Livre avec sa pochette de transport"
    ],
    technicalSpecs: [
      "Autonomie : jusqu'à 30 heures d'entraînement",
      "Matériaux : poignées en ABS et câble en acier tressé",
      "Dimensions : poignées de 16 cm, câble réglable",
      "Poids : 620 g avec les deux balles lestées"
    ],
    reviews: [
      {
        id: "r3",
        author: "Jean-Pierre Kouassi",
        rating: 5,
        comment: "Parfait pour s'entrainer a la maison. Le compteur est tres precis !",
        date: "20 Mai 2026"
      },
      {
        id: "r4",
        author: "Fatou Bamba",
        rating: 5,
        comment: "J'ai perdu 5kg en 2 mois grace a cette corde. Recommande !",
        date: "18 Mai 2026"
      }
    ]
  }
]
