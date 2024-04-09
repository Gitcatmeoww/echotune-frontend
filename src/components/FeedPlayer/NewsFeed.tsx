import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { IArticle } from '../../interfaces/IArticle';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

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

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-8 px-4">
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <Card>
              <CardActionArea
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={article.image || '/static/images/defaultNewsImage.jpg'}
                  alt={article.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.description}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Published at:{' '}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default NewsFeed;
