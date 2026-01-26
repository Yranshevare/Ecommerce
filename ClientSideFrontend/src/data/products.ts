export interface Product {
    id: string;
    name: string;
    price: string;
    images: string[];
    category: string;
    description: string;
    discount: string;
    specification: { [key: string]: string };
}

export const products: Product[] = [
    {
        id: "6974bcf4e04c80fd6988fbce",
        name: "Sofa Cover",
        price: "1000",
        images: [
            "http://res.cloudinary.com/diy78udll/image/upload/v1769258213/gkzsxzwkn6xpviteqhne.jpg",
            "http://res.cloudinary.com/diy78udll/image/upload/v1769258212/ibbapbhmkiwzv5ip4eia.jpg",
        ],
        category: "sofa-covers",
        description: "High quality sofa cover",
        discount: "5",
        specification: {
            color: "White",
            material: "Cotton",
            size: "Double",
        },
    },
    {
        id: "2",
        name: "Linen Pillow Cover Duo",
        price: "45",
        images: ["/product-2.jpg"],
        category: "pillow-covers",
        description: "Soft linen pillow cover set",
        discount: "0",
        specification: {
            material: "Linen",
            size: "Single",
            color: "Beige",
        },
    },
    {
        id: "3",
        name: "Premium Sofa Slipcover",
        price: "149",
        images: ["/product-3.jpg"],
        category: "sofa-covers",
        description: "Premium cotton sofa slipcover",
        discount: "40",
        specification: {
            material: "Cotton",
            size: "Double",
            color: "Cream",
        },
    },
    {
        id: "4",
        name: "Luxury Duvet Cover Set",
        price: "129",
        images: ["/product-4.jpg"],
        category: "bedsheets",
        description: "Luxury cotton duvet cover set",
        discount: "0",
        specification: {
            material: "Cotton",
            size: "King",
            color: "White",
        },
    },
    {
        id: "5",
        name: "Soft Gray Cotton Sheets",
        price: "95",
        images: ["/product-5.jpg"],
        category: "bedsheets",
        description: "Soft and breathable cotton bedsheets",
        discount: "0",
        specification: {
            material: "Cotton",
            size: "Queen",
            color: "Gray",
        },
    },
    {
        id: "6",
        name: "Sage Green Pillow Cover",
        price: "35",
        images: ["/product-6.jpg"],
        category: "pillow-covers",
        description: "Elegant sage green pillow cover",
        discount: "10",
        specification: {
            material: "Linen",
            size: "Single",
            color: "Sage",
        },
    },
    {
        id: "7",
        name: "Taupe Sofa Cover",
        price: "165",
        images: ["/product-7.jpg"],
        category: "sofa-covers",
        description: "Durable taupe colored sofa cover",
        discount: "0",
        specification: {
            material: "Cotton",
            size: "Double",
            color: "Taupe",
        },
    },
    {
        id: "8",
        name: "Striped Pillow Cover Set",
        price: "55",
        images: ["/product-8.jpg"],
        category: "pillow-covers",
        description: "Striped cotton pillow cover set",
        discount: "0",
        specification: {
            material: "Cotton",
            size: "Single",
            color: "Beige",
        },
    },
    {
        id: "9",
        name: "Egyptian Cotton King Sheet",
        price: "159",
        images: ["/product-1.jpg"],
        category: "bedsheets",
        description: "Premium Egyptian cotton bedsheet",
        discount: "40",
        specification: {
            material: "Cotton",
            size: "King",
            color: "Cream",
        },
    },
    {
        id: "10",
        name: "Velvet Pillow Cover",
        price: "42",
        images: ["/product-2.jpg"],
        category: "pillow-covers",
        description: "Soft velvet pillow cover",
        discount: "0",
        specification: {
            material: "Satin",
            size: "Single",
            color: "Beige",
        },
    },
    {
        id: "11",
        name: "Linen Sofa Protector",
        price: "135",
        images: ["/product-3.jpg"],
        category: "sofa-covers",
        description: "Linen sofa protector for daily use",
        discount: "0",
        specification: {
            material: "Linen",
            size: "Double",
            color: "Cream",
        },
    },
    {
        id: "12",
        name: "Satin Bedsheet Set",
        price: "175",
        images: ["/product-4.jpg"],
        category: "bedsheets",
        description: "Smooth satin bedsheet set",
        discount: "0",
        specification: {
            material: "Satin",
            size: "Queen",
            color: "White",
        },
    },
];

export const categories = [
    { slug: "bedsheets", label: "Bedsheets", description: "Soft, breathable sheets for restful nights" },
    { slug: "pillow-covers", label: "Pillow Covers", description: "Elegant designs for every bedroom style" },
    { slug: "sofa-covers", label: "Sofa Covers", description: "Protect and refresh your living space" },
];

export const materials = ["Cotton", "Linen", "Satin"] as const;
export const sizes = ["Single", "Double", "Queen", "King"] as const;
export const colors = ["Cream", "White", "Beige", "Gray", "Sage", "Taupe"] as const;
