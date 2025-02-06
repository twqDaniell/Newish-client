import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress"; // Import Loader
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
  const [loadAgainIndication, setLoadAgainIndication] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true); // Added initial loading state
  const navigate = useNavigate();
  const { buyPosts, setBuyPosts, sellPosts, setSellPosts } = usePostContext();
  const [fetchComplete, setFetchComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    setPage(1);
    setTotalPages(1);
    setLoadAgainIndication((prev) => prev + 1);
    setLoading(false);
    setInitialLoading(true); // Show loader when switching buy/sell

    if (buyOrSell === "buy") {
      setFilteredPosts([]);
      setBuyPosts([]);
    } else if (buyOrSell === "sell") {
      setFilteredPosts([]);
      setSellPosts([]);
    }
  }, [buyOrSell]);

  // Fetch posts based on buyOrSell
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || page > totalPages) {
        return;
      }
    
      setLoading(true); // UI-related state
      setFetchComplete(false); // Pagination-related state
      try {
        const { request } = getPosts(page, 8, buyOrSell === "buy" ? null : user._id);
        const response = await request;
    
        setTotalPages(response.data.totalPages);
    
        if (buyOrSell === "buy") {
          setBuyPosts((prevPosts) => [...prevPosts, ...response.data.posts]); // Append posts
        } else {
          setSellPosts((prevPosts) => [...prevPosts, ...response.data.posts]); // Append posts
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false); // For UI
        setFetchComplete(true); // Allow pagination to proceed
        setTimeout(() => setInitialLoading(false), 1000); // Hide the initial loader
      }
    };
    

    fetchPosts();
  }, [loadAgainIndication]);

  useEffect(() => {
    if (buyOrSell === "buy") {
      setFilteredPosts(buyPosts);
    } else if (buyOrSell === "sell") {
      setFilteredPosts(sellPosts);
    }
  }, [buyOrSell, buyPosts, sellPosts]);

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (page < totalPages && !loading && fetchComplete) {
        setPage((prevPage) => prevPage + 1);
        setLoadAgainIndication((prev) => prev + 1);
        setFetchComplete(false); // Reset fetchComplete for the next fetch
      }
      
    }
  }, 300 );

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

  // If still loading, show only the loader and hide everything else
  if (initialLoading) {
    return (
      <div className="loader-container">
        <CircularProgress size={100} thickness={5} sx={{ color: "#ED83B7" }} />
      </div>
    );
  }

  return (
    <div className="container">
      {filteredPosts.length > 0 ? filteredPosts.map((product, index) => (
        <ProductCard key={index} product={product} />
      )) : <h2>Nothing on sale yet</h2>}

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
