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
import RefreshIcon from "@mui/icons-material/Refresh";

interface Post {
  _id: string;
  [key: string]: any;
}

const HomePage: React.FC = () => {
  const { buyOrSell, user } = useAppContext();
  const navigate = useNavigate();
  const { buyPosts, setBuyPosts, sellPosts, setSellPosts, sellPage, setSellPage } = usePostContext();

  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  // Separate pagination states for buy and sell
  const [buyPage, setBuyPage] = useState<number>(1);
  const [buyTotalPages, setBuyTotalPages] = useState<number>(1);
  const [sellTotalPages, setSellTotalPages] = useState<number>(1);

  // Track which pages have been fetched for buy/sell
  const fetchedPagesRef = useRef<{ buy: Set<number>; sell: Set<number> }>({ buy: new Set(), sell: new Set() });
  const buyOrSellRef = useRef<string>(buyOrSell);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (buyOrSell === "buy" && buyPosts.length === 0) {
      fetchedPagesRef.current.buy.clear();
      buyOrSellRef.current = "buy";
      setInitialLoading(true);
      setRefreshTrigger(prev => !prev);
    } else if (buyOrSell === "sell" && sellPosts.length === 0) {
      fetchedPagesRef.current.sell.clear();
      buyOrSellRef.current = "sell";
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

  function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    const handleScroll = debounce(() => {
      console.log("Current buyOrSell inside handleScroll:", buyOrSell);

      const currentPage = buyOrSell === "buy" ? buyPage : sellPage;
      const totalPages = buyOrSell === "buy" ? buyTotalPages : sellTotalPages;

      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        if (currentPage < totalPages && !loading) {
          if (buyOrSell === "buy") {
            setBuyPage(prevPage => prevPage + 1);
          } else {
            setSellPage(prevPage => prevPage + 1);
          }
        }
      }
    }, 300);

    window.removeEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [buyOrSell, buyPage, sellPage, buyTotalPages, sellTotalPages, loading]);

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
      fetchedPagesRef.current.buy.clear();
    } else {
      setSellPage(1);
      setSellTotalPages(1);
      setSellPosts([]);
      fetchedPagesRef.current.sell.clear();
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
        filteredPosts.map((product) => <ProductCard key={product._id} product={product} />)
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
