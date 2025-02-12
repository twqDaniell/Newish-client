import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard/ProductCard.tsx";
import "./HomePage.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import NewProductPopup from "./ProductFormPopup/ProductFormPopup.tsx";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext.ts";
import { getPosts } from "../../services/posts-service.ts";
import { usePostContext } from "../../contexts/PostsContext.ts";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

const HomePage = () => {
  const { buyOrSell, user } = useAppContext();
  const navigate = useNavigate();
  const { buyPosts, setBuyPosts, sellPosts, setSellPosts, sellPage, setSellPage } = usePostContext();

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Separate pagination states for buy and sell
  const [buyPage, setBuyPage] = useState(1);
  const [buyTotalPages, setBuyTotalPages] = useState(1);
  const [sellTotalPages, setSellTotalPages] = useState(1);

  // Track which pages have been fetched for buy/sell
  const fetchedPagesRef = useRef({ buy: new Set(), sell: new Set() });
  const buyOrSellRef = useRef(buyOrSell);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (buyOrSell === "buy" && buyPosts.length === 0) {
      fetchedPagesRef.current.buy = new Set();
      buyOrSellRef.current = "buy";
      // setBuyPage(1);
      // setBuyTotalPages(1);
      setInitialLoading(true);
      setRefreshTrigger(prev => !prev);
    } else if (buyOrSell === "sell" && sellPosts.length === 0) {
      fetchedPagesRef.current.sell = new Set();
      buyOrSellRef.current = "sell";
      // setSellPage(1);
      // setSellTotalPages(1);
      setInitialLoading(true);
      setRefreshTrigger(prev => !prev);
    }
  }, [buyOrSell]);

  useEffect(() => {
    const fetchPosts = async () => {
      const currentPage = buyOrSell === "buy" ? buyPage : sellPage;
      const totalPages = buyOrSell === "buy" ? buyTotalPages : sellTotalPages;

      if (currentPage > totalPages || fetchedPagesRef.current[buyOrSell].has(currentPage)) {
        console.log(`Skipping page ${currentPage} for ${buyOrSell} (Already fetched or exceeds total pages)`);
        setInitialLoading(false);
        return;
      }

      setLoading(true);
      console.log(`Fetching page ${currentPage} for ${buyOrSell}`);

      try {
        const { request } = getPosts(currentPage, 8, buyOrSell === "buy" ? null : user._id);
        const response = await request;

        console.log(`Response for page ${currentPage}:`, response.data.posts);

        if (buyOrSell === "buy") {
          setBuyTotalPages(response.data.totalPages);
          setBuyPosts(prevPosts => {
            return [...prevPosts, ...response.data.posts].filter(
              (post, index, self) => index === self.findIndex(p => p._id === post._id)
            );
          });
        } else {
          setSellTotalPages(response.data.totalPages);
          setSellPosts(prevPosts => {
            return [...prevPosts, ...response.data.posts].filter(
              (post, index, self) => index === self.findIndex(p => p._id === post._id)
            );
          });
        }

        fetchedPagesRef.current[buyOrSell].add(currentPage);
      } catch (error) {
        console.error(`Failed to fetch page ${currentPage}:`, error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchPosts();
  }, [buyPage, sellPage, refreshTrigger]);

  useEffect(() => {
    setFilteredPosts(buyOrSell === "buy" ? buyPosts : sellPosts);
  }, [buyOrSell, buyPosts, sellPosts]);

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }

  useEffect(() => {
    const handleScroll = debounce(() => {
      console.log("Current buyOrSell inside handleScroll:", buyOrSell); // 🔹 Debugging Log
  
      const currentPage = buyOrSell === "buy" ? buyPage : sellPage;
      const totalPages = buyOrSell === "buy" ? buyTotalPages : sellTotalPages;
  
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        if (currentPage < totalPages && !loading) {
          if (buyOrSell === "buy") {
            setBuyPage(prevPage => prevPage + 1);
          } else {
            setSellPage(prevPage => prevPage + 1);
          }
        }
      }
    }, 300);
  
    // ✅ Remove old listener (ensures latest buyOrSell is used)
    window.removeEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);
  
    // ✅ Cleanup function to remove listener when component unmounts or `buyOrSell` changes
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [buyOrSell, buyPage, sellPage, buyTotalPages, sellTotalPages, loading]);
  

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [buyPage, sellPage, buyTotalPages, sellTotalPages, loading]);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleRefresh = () => {
    if (buyOrSell === "buy") {
      setBuyPage(1);
      setBuyTotalPages(1);
      setBuyPosts([]);
      fetchedPagesRef.current.buy = new Set();
    } else {
      setSellPage(1);
      setSellTotalPages(1);
      setSellPosts([]);
      fetchedPagesRef.current.sell = new Set();
    }
    setRefreshTrigger(prev => !prev);
    setInitialLoading(true);
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
        onClick={buyOrSell === "buy" ? handleRefresh : handleOpenPopup}
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
        {buyOrSell === "buy" ? <RefreshIcon sx={{ width: "50px", height: "50px" }} /> : <AddIcon sx={{ width: "50px", height: "50px" }} />}
      </Fab>

      <NewProductPopup open={popupOpen} onClose={handleClosePopup} isEdit={false} postToEdit={null} />
    </div>
  );
};

export default HomePage;
