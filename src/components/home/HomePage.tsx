import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import { getPosts, Post } from "../../services/posts-service.ts";

const HomePage = () => {
  const [products, setProducts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { request } = getPosts();    // object returned from getPosts
      const response = await request;    // now you're awaiting the actual promise
      setProducts(response.data);
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