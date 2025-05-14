import React from "react";

export default function ShoppingPage() {
  const recommendedProducts = [
    {
      id: 1,
      name: "Reusable Water Bottle",
      image: "/products/water-bottle.jpg",
      description: "Eco-friendly bottle to keep you hydrated.",
    },
    {
      id: 2,
      name: "Solar Phone Charger",
      image: "/products/solar-charger.jpg",
      description: "Harness the sun&apos;s power for your devices.",
    },
    {
      id: 3,
      name: "Energy-Efficient LED Bulbs",
      image: "/products/led-bulbs.jpg",
      description: "Cut energy costs with these long-lasting bulbs.",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Rewards</h1>
      <p className="mb-4">
        RewMo helps you earn rewards on products that match your values and lifestyle. Browse below to see what&apos;s recommended for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
