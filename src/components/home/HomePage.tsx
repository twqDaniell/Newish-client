import React, { useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import products from "./ProductCard/testProducts.json";
import { getPosts } from "../../services/posts-service.ts";

const HomePage = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { request } = getPosts();    // object returned from getPosts
    const response = await request;    // now you're awaiting the actual promise
    console.log(response.data);
    }
    
    fetchData();
  }, []);

  return (
    <div className="container">
        {products.map((product, index) => (
            <ProductCard key={index} product={product} />
        ))}
    </div>
  );
};

export default HomePage;