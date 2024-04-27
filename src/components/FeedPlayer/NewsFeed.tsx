import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CardActions,
  CircularProgress,
  SwipeableDrawer,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PlayerControls from './PlayerControls';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RectangleIcon from '@mui/icons-material/Rectangle';
import { IArticle } from '../../interfaces/IArticle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { relative } from 'path';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null,
  );

  // This function will be called when the summary needs to be shown or hidden
  const toggleSummary = (articleId: string) => {
    setExpandedArticleId((currentId) =>
      currentId === articleId ? null : articleId,
    );
  };

  interface SummariesType {
    [key: string]: string | undefined; // This means each key is a string and its value is either string or undefined
  }
  const sliderRef = useRef<Slider | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [summaries, setSummaries] = useState<SummariesType>({});

  const observer = useRef<IntersectionObserver | null>(null);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    afterChange: (currentSlide: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
  };

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
    const articleCards = document.querySelectorAll('.article-card');
    console.log(articleCards);

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.getAttribute('data-article-id');
            const articleSummary = entry.target.getAttribute('data-summary');

            console.log(`Article ${articleId} is in view.`);
            console.log(`Article ${articleSummary} is in view.`);

            if (articleId) {
              generateSummary(articleId);
              observer.current?.unobserve(entry.target); // Use the observer ref here
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    articleCards.forEach((card) => {
      observerInstance.observe(card);
    });

    // Set observer to current instance of IntersectionObserver
    observer.current = observerInstance;

    // Clean up observer when the component unmounts or the articles change
    return () => {
      observerInstance.disconnect();
    };
  }, [articles, summaries, observer]); // Effect will re-run if articles or summaries change

  const handleSliderInteraction = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleExpandClick = (articleId: string) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
  };

  // if (error) return <div>{error}</div>;
  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflowX: 'auto',
        // display: 'flex',
        padding: '20px',
        position: 'relative',
        pb: '80px',
      }}
    >
      <Slider {...settings} ref={sliderRef}>
        {articles.map((article) => (
          <Card
            key={article.id}
            sx={{
              position: 'relative',
              // height: expandedArticleId === article.id ? '100vh' : 'auto', // Adjust the height dynamically
              transition: 'height 0.5s ease',
              width: 345,
              height: 420,
              margin: '10px',
              color: 'success.dark',
              bgcolor: '#1E2235',
              // maxHeight: expandedArticleId === article.id ? '500px' : '300px',
            }}
            data-article-id={article.id}
            data-summary={summaries[article.id]}
            className="article-card"
            onMouseDown={handleSliderInteraction}
            onTouchStart={handleSliderInteraction}
          >
            <CardMedia
              component="img"
              sx={{ height: 140, width: '100%', objectFit: 'cover' }}
              image={article.image}
              alt={article.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="body1"
                component="div"
                color="#FFFFFF"
              >
                {article.title}
              </Typography>
              <Typography variant="caption" color="#ABADC6">
                {new Date(article.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#ABADC6',
                }}
              >
                <Box component="span" sx={{ marginRight: '8px' }}>
                  Blog
                </Box>
                •
                <Box component="span" sx={{ marginLeft: '8px' }}>
                  {article.source_name}
                </Box>
              </Typography>
            </CardContent>
            <CardActions
              sx={{ justifyContent: 'flex-end', marginRight: '15px' }}
            >
              <Box>
                <IconButton aria-label="like" style={{ color: 'white' }}>
                  <ThumbUpOffAltIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="dislike" style={{ color: 'white' }}>
                  <ThumbDownOffAltIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="bookmark" style={{ color: 'white' }}>
                  <BookmarkBorderIcon fontSize="small" />
                </IconButton>
                <NorthEastIcon
                  style={{ color: 'white' }}
                  onClick={() => window.open(article.url, '_blank')}
                />
              </Box>
            </CardActions>

            <CardContent>
              <Box
                onClick={() => toggleSummary(article.id)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 1,
                  bottom: 0,
                  marginTop: 1,
                  cursor: 'pointer',
                  position: 'relative',
                  // top: expandedArticleId === article.id ? '0' : '-25px',
                  // bgcolor: '#1E2235',
                  zIndex: 2,
                }}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '4px',
                    bgcolor: '#ABADC6',
                    borderRadius: '3px',
                  }}
                />
              </Box>
            </CardContent>

            <Box
              sx={{
                position: 'absolute',
                top:
                  expandedArticleId === article.id ? '0' : 'calc(100% - 50px)',
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#1E2235',
                overflow: 'hidden',
                zIndex: 1,
                transition: 'top 0.5s ease',
              }}
            >
              {/* <Typography
                variant="body2"
                sx={{
                  p: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {summaries[article.id] || <CircularProgress />}
              </Typography> */}
              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: '10px',
                }}
              >
                {summaries[article.id] ? (
                  <Box
                    sx={{
                      padding: '5px',
                      height: '300px',
                      overflow: 'auto',
                    }}
                  >
                    {summaries[article.id]}
                  </Box>
                ) : (
                  <CircularProgress />
                )}
              </Typography>
            </Box>
          </Card>
        ))}
      </Slider>
      <Box
        sx={{
          position: 'relative',
          bottom: '0vh',
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <PlayerControls currentSummary={currentSummary} />
      </Box>
      {/* <PlayerControls currentSummary={currentSummary} /> */}
    </Box>
  );
};

export default NewsFeed;
