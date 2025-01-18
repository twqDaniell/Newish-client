import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import loginIllustration from "../../../assets/login_illustration.png";
import "./ProductCard.css";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function ProductCard({ product }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: '#fff9fa' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={product.productName}
        subheader={product.dateAdded}
      />
      <CardMedia
        component="img"
        height="194"
        image={loginIllustration}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {product.text}
        </Typography>
        <Typography variant="body2" sx={{ color: '#000000' }} className='price'>
          {product.price} $
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <div className='likeConunt'>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{product.likes}</Typography>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
        </div>
        <div className='likeConunt'>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{product.comments}</Typography>
            <IconButton aria-label="add to favorites">
                <CommentIcon />
            </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
