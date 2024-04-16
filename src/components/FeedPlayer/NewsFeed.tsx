import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { IArticle } from '../../interfaces/IArticle';
import { CircularProgress, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PlayerControls from './PlayerControls';
// import Carousel from 'react-material-ui-carousel'

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);
  const [summaries, setSummaries] = useState<SummariesType>({});
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [tag, setTag] = useState('');

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
      console.log(config);
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

  const fetchTag = async (userInput: string) => {
    try {
      const response = await axios.post('/api/generate_tag', {
        content: userInput,
      });
      setTag(response.data.tag);
    } catch (error) {
      console.error('Error fetching tag:', error);
    }
  };

  const redirectToSource = (url: string) => {
    window.open(url, '_blank');
  };

  interface SummariesType {
    [key: string]: string | undefined; // This means each key is a string and its value is either string or undefined
  }

  const observedArticleRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );

  // const setArticleRef =
  //   (article: IArticle) => (node: HTMLDivElement | null) => {
  //     observedArticleRefs.current[article.id] = node;
  //     if (node) {
  //       observer.current?.observe(node);
  //     }
  // };

  const generateSummary = async (articleId: string) => {
    console.log(articleId);
    const article = articles.find((a) => a.id == articleId);
    if (article && !summaries[articleId]) {
      console.log(`Generating summary for article ID ${articleId}`);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/generate_summary/',
          { content: article.content },
        );
        setSummaries((prev) => ({
          ...prev,
          [articleId]: response.data.generateSummary,
        }));
        setCurrentSummary(response.data.generateSummary); // Set the current summary to be played

        console.log('Summary generated:', response.data.generateSummary);
      } catch (error) {
        console.error('Error generating summary:', error);
      }
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.getAttribute('data-article-id');
            const curr_summary = entry.target.getAttribute('data-summary');
            console.log(articleId);
            console.log(curr_summary);
            console.log(`Article ${articleId} is in view.`);
            if (articleId) {
              generateSummary(articleId);
              observer.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card) => {
      observer.current?.observe(card);
    });

    return () => {
      console.log('Disconnecting observer.');
      observer.current?.disconnect();
    };
  }, [articles, summaries]);

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Box
      sx={{
        overflowX: 'auto',
        display: 'flex',
        padding: '20px',
      }}
    >
      {articles.map((article) => (
        <Card
          key={article.id}
          sx={{ width: 345, margin: '10px', flexShrink: 0 }}
          data-article-id={article.id}
          data-summary={currentSummary}
          className="article-card"
          color="#1E2235"

          // ref={setArticleRef(article)}
        >
          <CardMedia
            component="img"
            sx={{ height: 140, width: '100%', objectFit: 'cover' }}
            image={article.image}
            alt={article.title}
          />
          <CardContent>
            <Typography gutterBottom variant="body1" component="div">
              {article.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Box component="span" sx={{ marginRight: '8px' }}>
                Blog
              </Box>
              <Box component="span" sx={{ color: 'primary.main' }}>
                Sneakersnstuff
              </Box>
            </Typography>
          </CardContent>
          <Box
            sx={{
              maxHeight: '100px',
              overflow: 'auto',
              '::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Typography variant="body2" color="text.primary">
              {summaries[article.id] || <CircularProgress size={24} />}
            </Typography>
          </Box>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => window.open(article.url, '_blank')}
            >
              Read More
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton aria-label="like">
              <ThumbUpOffAltIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="dislike">
              <ThumbDownOffAltIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="bookmark">
              <BookmarkBorderIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      <PlayerControls currentSummary={currentSummary} />
    </Box>
  );
};

export default NewsFeed;
