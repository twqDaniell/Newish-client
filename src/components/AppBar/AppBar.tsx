import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth-service.ts";
import { useAppContext } from "../../contexts/AppContext.ts";

const pages = ["Buy", "Sell", "Profile"];
const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const { buyOrSell, setBuyOrSell, setUser, user } = useAppContext();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {};

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageClick = (page: string) => {
    if (page === "Profile") {
      navigate("/profile");
      return;
    } else {
      navigate("/home");
      setBuyOrSell(page.toLowerCase());
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      await authService.logout(refreshToken);

      // Clear user state and tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);

      // Navigate back to login
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error.message || error);
    }
  };

  const handleSetting = (setting: string) => () => {
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

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#F3E3E4", position: "fixed", zIndex: "100" }}
    >
      <div
        style={{ marginLeft: "15px", marginRight: "15px", maxWidth: "100%" }}
      >
        <Toolbar disableGutters>
          <img
            src={logo} // Replace with your illustration URL
            alt="Illustration"
            className="illustration"
            style={{ width: "120px", height: "40px", marginRight: "10px" }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center", color: "#EE297B" }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handlePageClick(page);
                }}
                sx={{
                  my: 2,
                  color: "#EE297B",
                  display: "block",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              direction: "flex",
              flexDirection: "row",
              marginTop: "5px",
            }}
          >
            <div className="profileBar">
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    src={`http://localhost:3002/${user?.profilePicture.replace(
                      /\\/g,
                      "/"
                    )}`}
                  />
                </IconButton>
              </Tooltip>
              <Typography
                sx={{ color: "#EE297B", display: { xs: "none", md: "block" } }}
              >
                {user?.name}
              </Typography>
            </div>
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleSetting(setting)}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
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
