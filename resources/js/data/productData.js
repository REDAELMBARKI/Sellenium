
// import  { useState } from "react";

// const [product , setProdcutData] = useState([]);
export const variants = [
  {
    id: 1,
    color: { id: 1, name: "Midnight Black", hex: "#1a1a1a" },
    sizes: [
      { id: 1, name: "Standard" },
      { id: 2, name: "Large" },
    ],
    materials: [ 
      { id: 1, name: "Premium Leather" },
      { id: 2, name: "Memory Foam" },
    ],
    fits: [
      { id: 1, name: "Over-Ear" },
      { id: 2, name: "On-Ear" },
    ],
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1649774/pexels-photo-1649774.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    stock: 25,
  },
  {
    id: 2,
    color: { id: 2, name: "Pearl White", hex: "#f8f8f8" },
    sizes: [{ id: 1, name: "Standard" }],
    materials: [{ id: 1, name: "Premium Leather" }],
    fits: [{ id: 1, name: "Over-Ear" }],
    images: [
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    stock: 12,
  },
  {
    id: 3,
    color: { id: 3, name: "Ocean Blue", hex: "#2563eb" },
    sizes: [
      { id: 1, name: "Standard" },
      { id: 2, name: "Large" },
    ],
    materials: [
      { id: 2, name: "Memory Foam" },
      { id: 3, name: "Fabric" },
    ],
    fits: [{ id: 1, name: "Over-Ear" }],
    images: [
      "https://images.pexels.com/photos/1649774/pexels-photo-1649774.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    stock: 8,
  },
  {
    id: 4,
    color: { id: 4, name: "Rose Gold", hex: "#e11d48" },
    sizes: [{ id: 1, name: "Standard" }],
    materials: [{ id: 1, name: "Premium Leather" }],
    fits: [{ id: 2, name: "On-Ear" }],
    images: [
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    stock: 0,
  },
];

export const reviews = [
  // {
  //   id: 1,
  //   username: "AudioPhile_92",
  //   rating: 5,
  //   comment:
  //     "Absolutely amazing sound quality! The noise cancellation is top-notch and the battery life is exactly as advertised. Worth every penny.",
  //   date: "2024-01-15",
  // },
  // {
  //   id: 2,
  //   username: "MusicLover",
  //   rating: 4.5,
  //   comment:
  //     "Great headphones with excellent build quality. The comfort is outstanding for long listening sessions. Only minor complaint is the carrying case could be better.",
  //   date: "2024-01-10",
  // },
  // {
  //   id: 3,
  //   username: "TechReviewer",
  //   rating: 4,
  //   comment:
  //     "Solid choice for wireless headphones. Good sound quality and the connectivity is stable. Price point is fair for the features offered.",
  //   date: "2024-01-05",
  // },
  // {
  //   id: 4,
  //   username: "CommuteMaster",
  //   rating: 5,
  //   comment:
  //     "Perfect for my daily commute. The noise cancellation blocks out all the train noise and the battery lasts all week. Highly recommend!",
  //   date: "2023-12-28",
  // },
];

export const relatedProducts = [
  // {
  //   id: 2,
  //   name: "Wireless Earbuds Pro",
  //   price: 199.99,
  //   image:
  //     "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
  // },
  // {
  //   id: 3,
  //   name: "Studio Monitor Headphones",
  //   price: 349.99,
  //   image:
  //     "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400",
  // },
  // {
  //   id: 4,
  //   name: "Gaming Headset Elite",
  //   price: 249.99,
  //   image:
  //     "https://images.pexels.com/photos/1649774/pexels-photo-1649774.jpeg?auto=compress&cs=tinysrgb&w=400",
  // },
  // {
  //   id: 5,
  //   name: "Portable Speaker",
  //   price: 129.99,
  //   image:
  //     "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400",
  // },
];
