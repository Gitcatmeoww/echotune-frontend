import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { IArticle } from '../../interfaces/IArticle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const isGuest = !!localStorage.getItem('guestSessionId');
    const sessionId = localStorage.getItem('guestSessionId');
    const token = localStorage.getItem('token');

    fetchNews(isGuest, sessionId, token);
  }, []);

  const fetchNews = async (
    isGuest: boolean,
    sessionId: string | null,
    token: string | null,
  ) => {
    const config: {
      headers: Record<string, string>;
      params: Record<string, string | null>;
    } = {
      headers: {},
      params: {
        is_guest: isGuest.toString(),
        session_id: sessionId,
      },
    };

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    console.log(config);

    try {
      const response = await axios.get(
        'http://localhost:8000/api/fetch_news/',
        config,
      );
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
    }
  };

  const redirectToSource = (url: string) => {
    window.open(url, '_blank');
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Box sx={{ overflowX: 'auto', display: 'flex', padding: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {articles.map((article) => (
          <Card
            key={article.id}
            sx={{ width: 345, margin: '10px', flexShrink: 0 }}
          >
            <CardMedia
              component="img"
              height="140"
              image={article.image}
              alt={article.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {article.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(article.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {article.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => redirectToSource(article.url)}
              >
                Read More
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default NewsFeed;
