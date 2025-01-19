import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import { getPosts, Post } from "../../services/posts-service.ts";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import NewProductPopup from "./NewProduct/NewProductPopup.tsx";

const HomePage = () => {
  const [products, setProducts] = useState<Post[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { request } = getPosts(); // object returned from getPosts
      const response = await request; // now you're awaiting the actual promise
      setProducts(response.data);
    };

    fetchData();
  }, []);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="container">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
      <Fab
        aria-label="add"
        onClick={handleOpenPopup}
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
          width: "90px",
          height: "90px",
          background: "#EE297B",
          color: "white",
        }}
      >
        <AddIcon sx={{ width: "50px", height: "50px" }} />
      </Fab>

      <NewProductPopup open={popupOpen} onClose={handleClosePopup} />
    </div>
  );
};

export default HomePage;
