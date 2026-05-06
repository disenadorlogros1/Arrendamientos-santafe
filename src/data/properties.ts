export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: string;
  size: string;
  reference: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  featured?: boolean;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Apartamento Moderno en Poblado",
    price: "$1'200,000",
    location: "Poblado",
    type: "Apartamento",
    size: "65 M²",
    reference: "Ref. V8676",
    image: "/propiedad-1.PNG",
    bedrooms: 2,
    bathrooms: 1,
    featured: true,
  },
  {
    id: 2,
    title: "Casa Familiar en Envigado",
    price: "$1'800,000",
    location: "Envigado",
    type: "Casa",
    size: "120 M²",
    reference: "Ref. V8677",
    image: "/propiedad-2.PNG",
    bedrooms: 3,
    bathrooms: 2,
    featured: true,
  },
  {
    id: 3,
    title: "Apartamento en Laureles",
    price: "$950,000",
    location: "Laureles",
    type: "Apartamento",
    size: "50 M²",
    reference: "Ref. V8678",
    image: "/propiedad-3.PNG",
    bedrooms: 1,
    bathrooms: 1,
    featured: true,
  },
  {
    id: 4,
    title: "Apartamento en Buenos Aires",
    price: "$850,000",
    location: "Buenos Aires",
    type: "Apartamento",
    size: "50 M²",
    reference: "Ref. V8679",
    image: "/propiedad-4.PNG",
    bedrooms: 2,
    bathrooms: 1,
    featured: true,
  },
  {
    id: 5,
    title: "Estudio Amueblado en Poblado",
    price: "$1'100,000",
    location: "Poblado",
    type: "Apartamento",
    size: "38 M²",
    reference: "Ref. V8680",
    image: "https://picsum.photos/seed/prop5/600/400",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 6,
    title: "Casa en Sabaneta",
    price: "$2'100,000",
    location: "Sabaneta",
    type: "Casa",
    size: "150 M²",
    reference: "Ref. V8681",
    image: "https://picsum.photos/seed/prop6/600/400",
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: 7,
    title: "Apartamento en Bello",
    price: "$780,000",
    location: "Bello",
    type: "Apartamento",
    size: "55 M²",
    reference: "Ref. V8682",
    image: "https://picsum.photos/seed/prop7/600/400",
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: 8,
    title: "Apartamento en Envigado Centro",
    price: "$920,000",
    location: "Envigado",
    type: "Apartamento",
    size: "48 M²",
    reference: "Ref. V8683",
    image: "https://picsum.photos/seed/prop8/600/400",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: 9,
    title: "Casa en La Strada",
    price: "$3'500,000",
    location: "La Strada",
    type: "Casa",
    size: "200 M²",
    reference: "Ref. V8684",
    image: "https://picsum.photos/seed/prop9/600/400",
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: 10,
    title: "Apartamento en Itagüí",
    price: "$680,000",
    location: "Itagüí",
    type: "Apartamento",
    size: "45 M²",
    reference: "Ref. V8685",
    image: "https://picsum.photos/seed/prop10/600/400",
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: 11,
    title: "Penthouse en El Poblado",
    price: "$4'200,000",
    location: "Poblado",
    type: "Apartamento",
    size: "130 M²",
    reference: "Ref. V8686",
    image: "https://picsum.photos/seed/prop11/600/400",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: 12,
    title: "Casa en Copacabana",
    price: "$1'500,000",
    location: "Copacabana",
    type: "Casa",
    size: "100 M²",
    reference: "Ref. V8687",
    image: "https://picsum.photos/seed/prop12/600/400",
    bedrooms: 3,
    bathrooms: 2,
  },
];

export type PageType =
  | "home"
  | "propiedades"
  | "consignacion"
  | "hipotecas"
  | "servicios"
  | "institucional";

export const navItems: { label: string; page: PageType }[] = [
  { label: "Propiedades", page: "propiedades" },
  { label: "Consignación", page: "consignacion" },
  { label: "Hipotecas", page: "hipotecas" },
  { label: "Servicios", page: "servicios" },
  { label: "Institucional", page: "institucional" },
];
