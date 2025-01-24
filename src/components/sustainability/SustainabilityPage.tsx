import React, { useEffect, useState } from "react";
import { Container, Box, Typography, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import EcoIcon from "@mui/icons-material/Recycling";
import Alert from "@mui/material/Alert";
import "./SustainabilityPage.css";
import { useAppContext } from "../../contexts/AppContext.ts";

const SustainabilityPage = () => {
  const { tips, setTips } = useAppContext();
  const [loading, setLoading] = useState(tips.length == 0 ? true : false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/sustainability-tips");
        if (!response.ok) {
          throw new Error("Failed to fetch sustainability tips");
        }
        const data = await response.json();
        setTips(data.tips);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!tips.length) fetchTips();
  }, []);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading tips...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ marginTop: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="sustainability-tips-container">
      <Box className="header">
        <Typography variant="h4" className="title" gutterBottom>
          🌍 Sustainability Tips
        </Typography>
        <Typography variant="subtitle1" className="subtitle">
          Learn how your small actions can make a big difference.
        </Typography>
      </Box>

      <List className="tips-list">
        {tips.map((tip, index) => (
          <ListItem key={index} className="tip-item">
            <ListItemIcon>
              <EcoIcon className="eco-icon" />
            </ListItemIcon>
            <ListItemText primary={tip} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SustainabilityPage;
