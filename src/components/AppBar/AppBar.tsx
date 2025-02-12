import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth-service.ts";
import { usePostContext } from "../../contexts/PostsContext.ts";
import { useAppContext } from "../../contexts/AppContext.ts";

const pages: string[] = ["Buy", "Sell", "Sustainability", "Profile"];
const settings: string[] = ["Profile", "Logout"];
const apiUrl: string | undefined =
  window.ENV?.BASE_API_URL || process.env.REACT_APP_BASE_API_URL;

const ResponsiveAppBar: React.FC = () => {
  const { buyOrSell, setBuyOrSell, setUser, user, setIsGoogle, setTips } =
    useAppContext();
  const { setBuyPosts, setSellPosts } = usePostContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<string>("Buy"); // Track active tab
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handlePageClick = (page: string): void => {
    setActiveTab(page); // Update the active tab
    if (page === "Profile") {
      navigate("/profile");
    } else if (page === "Sustainability") {
      navigate("/sustainability");
    } else {
      navigate("/home");
      setBuyOrSell(page.toLowerCase());
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const refreshToken: string | null = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      await authService.logout(refreshToken);

      // Clear user state and tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setBuyOrSell("buy");
      setBuyPosts([]);
      setSellPosts([]);
      setIsGoogle(false);
      setTips([]);

      // Navigate back to login
      navigate("/");
    } catch (error: any) {
      console.error("Failed to logout:", error.message || error);
    }
  };

  const handleSetting = (setting: string): (() => void) => {
    return (): void => {
      switch (setting) {
        case "Profile":
          navigate("/profile");
          handleCloseUserMenu();
          break;
        case "Logout":
          handleLogout();
          localStorage.removeItem("user");
          navigate("/");
          break;
        default:
          break;
      }
    };
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#F3E3E4", position: "fixed", zIndex: "100" }}
    >
      <div style={{ marginLeft: "15px", marginRight: "15px", maxWidth: "100%" }}>
        <Toolbar disableGutters>
          <img
            src={logo}
            alt="Logo"
            className="illustration"
            style={{ width: "120px", height: "40px", marginRight: "10px" }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page: string) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handlePageClick(page);
                    handleCloseNavMenu();
                  }}
                  selected={activeTab === page}
                >
                  <Typography sx={{ textAlign: "center", color: "#EE297B" }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page: string) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{
                  my: 2,
                  display: "block",
                  textTransform: "none",
                  fontSize: "16px",
                  color: "#EE297B", // Text color remains the same regardless of activeTab
                  backgroundColor:
                    activeTab === page ? "#FAF58C" : "transparent", // Highlight selected tab with background color
                  borderRadius: "8px", // Make it look like a tab
                  padding: "6px 12px", // Add some padding for better UX
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              flexGrow: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src={
                    user?.profilePicture?.startsWith("http")
                      ? user?.profilePicture
                      : `${apiUrl}/${user?.profilePicture?.replace(/\\/g, "/")}`
                  }
                  imgProps={{
                    referrerPolicy: "no-referrer", // Bypass CORS restrictions
                  }}
                />
              </IconButton>
            </Tooltip>
            <Typography sx={{ color: "#EE297B" }}>{user?.username}</Typography>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting: string) => (
                <MenuItem key={setting} onClick={handleSetting(setting)}>
                  <Typography>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </div>
    </AppBar>
  );
}

export default ResponsiveAppBar;
