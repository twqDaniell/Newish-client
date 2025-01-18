import React from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import products from "./ProductCard/testProducts.json";

const HomePage = () => {
  return (
    <div className="container">
        {products.map((product, index) => (
            <ProductCard key={index} product={product} />
        ))}
    </div>
  );
};

export default HomePage;