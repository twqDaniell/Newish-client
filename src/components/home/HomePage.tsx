import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import NewProductPopup from "./ProductFormPopup/ProductFormPopup.tsx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.ts";
import { getPosts } from "../../services/posts-service.ts";
import { usePostContext } from "../../contexts/PostsContext.ts";

const HomePage = () => {
  const { buyOrSell, user } = useAppContext();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { buyPosts, setBuyPosts, sellPosts, setSellPosts } = usePostContext();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Fetch posts based on buyOrSell
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || page > totalPages) return;

      setLoading(true);
      try {
        if (buyOrSell === "buy") {
          const { request } = getPosts(page, 8, null); // Fetch other users' posts
          const response = await request;
          setBuyPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
          setTotalPages(response.data.totalPages);
        } else if (buyOrSell === "sell") {
          const { request } = getPosts(page, 8, user._id); // Fetch current user's posts
          const response = await request;
          setSellPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, buyOrSell]);

  // Set filtered posts based on buyOrSell
  useEffect(() => {
    if (buyOrSell === "buy") {
      setFilteredPosts(buyPosts);
    } else if (buyOrSell === "sell") {
      setFilteredPosts(sellPosts);
    }
  }, [buyOrSell, buyPosts, sellPosts]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (page < totalPages && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading]);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="container">
      {filteredPosts.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}

      {loading && <p className="loading-text">Loading more posts...</p>}

      {buyOrSell === "sell" && (
        <Fab
          aria-label="add"
          onClick={handleOpenPopup}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "50px",
            width: "90px",
            height: "90px",
            background: "#ED83B7",
            color: "white",
          }}
        >
          <AddIcon sx={{ width: "50px", height: "50px" }} />
        </Fab>
      )}

      <NewProductPopup open={popupOpen} onClose={handleClosePopup} isEdit={false} postToEdit={null} />
    </div>
  );
};

export default HomePage;
