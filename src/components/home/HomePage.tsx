import React, { useEffect, useState, useRef } from "react";
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
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

const HomePage = () => {
  const { buyOrSell, user } = useAppContext();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Show loader initially
  const navigate = useNavigate();
  const { buyPosts, setBuyPosts, sellPosts, setSellPosts } = usePostContext();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Ref to track which pages have been fetched per mode.
  const fetchedPagesRef = useRef({ buy: new Set(), sell: new Set() });

  useEffect(() => {
    setBuyPosts([]);
    setSellPosts([]);
    setPage(1);
    setTotalPages(1);
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // When switching between buy and sell, reset pagination if no posts exist.
  useEffect(() => {
    if (buyOrSell === "buy") {
      if (buyPosts.length === 0) {
        fetchedPagesRef.current.buy = new Set();
        setPage(1);
        setTotalPages(1);
        setInitialLoading(true);
        setBuyPosts([]);
      }
    } else if (buyOrSell === "sell") {
      if (sellPosts.length === 0) {
        fetchedPagesRef.current.sell = new Set();
        setPage(1);
        setTotalPages(1);
        setInitialLoading(true);
        setSellPosts([]);
      }
    }
  }, [buyOrSell]);

  // Fetch posts when the current page or mode (buyOrSell) changes.
  useEffect(() => {
    const fetchPosts = async () => {
      // If page exceeds total pages or already fetched, do nothing.
      if (page > totalPages || fetchedPagesRef.current[buyOrSell].has(page)) {
        setInitialLoading(false);
        return;
      }
      setLoading(true);

      try {
        const { request } = getPosts(page, 8, buyOrSell === "buy" ? null : user._id);
        const response = await request;
        setTotalPages(response.data.totalPages);
        if (buyOrSell === "buy") {
          setBuyPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        } else {
          setSellPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        }
        // Mark this page as fetched.
        fetchedPagesRef.current[buyOrSell].add(page);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchPosts();
  }, [page, buyOrSell, refreshTrigger]);

  // Update filteredPosts when context arrays change.
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
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (page < totalPages && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  }, 300);

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

  // Refresh button handler for the buy page.
  const handleRefresh = () => {
    if (buyOrSell === "buy") {
      setPage(1);
      setTotalPages(1);
      setBuyPosts([]);
      fetchedPagesRef.current.buy = new Set();
      setRefreshTrigger(prev => !prev);
      setInitialLoading(true);
    }
  };

  if (initialLoading) {
    return (
      <div className="loader-container">
        <CircularProgress size={100} thickness={5} sx={{ color: "#ED83B7" }} />
      </div>
    );
  }

  return (
    <div className="container">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
      ) : (
        <h2>Nothing on sale yet</h2>
      )}

      {loading && <p className="loading-text">Loading more posts...</p>}

        <Fab
          aria-label="add"
          onClick={ buyOrSell == 'buy' ? handleRefresh : handleOpenPopup}
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
          {( buyOrSell == 'buy' ? <RefreshIcon sx={{ width: "50px", height: "50px" }} />
          : <AddIcon sx={{ width: "50px", height: "50px" }} /> )}
        </Fab>

      <NewProductPopup open={popupOpen} onClose={handleClosePopup} isEdit={false} postToEdit={null} />
    </div>
  );
};

export default HomePage;
