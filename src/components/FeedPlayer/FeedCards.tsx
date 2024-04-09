import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Button,
  Box,
} from '@mui/material';

const FeedCard = () => {
  return (
    <Box sx={{ display: 'flex', overflowX: 'auto', p: 2 }}>
      <Card
        sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, margin: '0 8px' }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Slider
            defaultValue={30}
            aria-label="Volume"
            sx={{ width: '90%', mt: 2 }}
          />
          <Typography variant="h5" component="div" sx={{ mt: 2 }}>
            Title
          </Typography>
          <Button variant="outlined" sx={{ mt: 2, mb: 2 }}>
            Learn more
          </Button>
        </CardContent>
      </Card>
      <Card
        sx={{ minWidth: 275, boxShadow: 3, borderRadius: 2, margin: '0 8px' }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Slider
            defaultValue={30}
            aria-label="Volume"
            sx={{ width: '90%', mt: 2 }}
          />
          <Typography variant="h5" component="div" sx={{ mt: 2 }}>
            Title
          </Typography>
          <Button variant="outlined" sx={{ mt: 2, mb: 2 }}>
            Learn more
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeedCard;
