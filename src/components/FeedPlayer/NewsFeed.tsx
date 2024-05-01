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
  Popover,
  Drawer,
  styled,
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
import { IArticle } from '../../interfaces/IArticle';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);

  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleSummary = (articleId: string | null) => {
    setExpandedArticleId((currentId) =>
      currentId === articleId ? null : articleId,
    );
  };
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  interface SummariesType {
    [key: string]: string | undefined;
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
      // console.log(config);
      const response = await axios.get(
        'http://localhost:8000/api/fetch_news/',
        config,
      );
      setArticles(response.data);
      // setSelectedArticle(response.data[0]);
      // console.log(response.data[0]);
      // handleCardSelect(response.data[0]);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: true,
    // width: '200px !important',

    // const settings = {
    //   dots: false,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   adaptiveHeight: false,
    //   width: '200px!important',

    afterChange: (currentSlide: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const selectedArticle = articles[currentSlide];
      setSelectedArticle(selectedArticle);
      if (selectedArticle) {
        const summary = summaries[selectedArticle.id];
        if (summary !== currentSummary) {
          setCurrentSummary(summary || null);
        }
      } else {
        setCurrentSummary(null);
      }
    },
  };

  const generateSummary = async (articleId: string) => {
    const article = articles.find((a) => a.id == articleId);

    if (article && !summaries[articleId]) {
      setSelectedArticle(article);

      console.log(`Generating summary for article ID ${articleId}`);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/generate_summary/',
          { content: article.content },
        );
        setSummaries((prevSummaries) => ({
          ...prevSummaries,
          [articleId]: response.data.generateSummary,
        }));

        if (selectedArticle && selectedArticle.id === articleId) {
          setCurrentSummary(response.data.generateSummary);
        }
      } catch (error) {
        console.error('Error generating summary:', error);
      }
    } else {
      setCurrentSummary(summaries[articleId] ?? null);
    }
  };

  // useEffect(() => {
  //   console.log('Current Summary:', currentSummary);
  // }, [currentSummary]);

  useEffect(() => {
    const articleCards = document.querySelectorAll('.article-card');
    // console.log(articleCards);

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.getAttribute('data-article-id');
            const articleSummary = entry.target.getAttribute('data-summary');
            const currentIndex = articles.findIndex(
              (a) => a.id === selectedArticle?.id,
            );

            setSelectedArticle(articles[currentIndex]);

            console.log(`Article ${articleId} is in view.`);

            if (articleId) {
              generateSummary(articleId);
              observer.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 },
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

  const handleNextArticle = () => {
    const currentIndex = articles.findIndex(
      (a) => a.id === selectedArticle?.id,
    );
    const nextIndex = (currentIndex + 1) % articles.length;
    setSelectedArticle(articles[nextIndex]);
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  // const handlecurrentSummary = () => {
  //   const currentIndex = articles.findIndex(
  //     (a) => a.id === selectedArticle?.id,
  //   );
  //   generateSummary(String(currentIndex));
  // };

  const handlePreviousArticle = () => {
    const currentIndex = articles.findIndex(
      (a) => a.id === selectedArticle?.id,
    );
    const nextIndex = (currentIndex - 1) % articles.length;
    setSelectedArticle(articles[nextIndex]);
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  // if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        // overflowX: 'auto',
        // display: 'flex',
        // padding: '2  0px',
        position: 'relative',
        pb: '40px',
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
              // width: '200px!important',
              // maxWidth: '300px', // Adjust this value to control the card width
              padding: '20px',

              height: 385,
              // margin: '10px',
              color: 'success.dark',
              bgcolor: '#1E2235',
              opacity: drawerOpen ? 0.2 : 1,
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
              sx={{
                height: 140,
                borderRadius: '12px',
                width: '100%',
                objectFit: 'cover',
              }}
              image={article.image}
              alt={article.title}
            />
            <CardContent
              sx={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                gutterBottom
                variant="body2"
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
            {/* <CardActions
              sx={{
                justifyContent: 'flex-end',
                marginRight: '15px',
              }}
            > */}
            <CardActions
              sx={{
                justifyContent: 'flex-end',
                position: 'absolute', // Position it absolutely within the relative parent Card
                bottom: 20,
                right: 20,
                bgcolor: '#252A41',
                borderRadius: '40px',
                // p: 1, // Padding around the icons
              }}
            >
              {/* <Box> */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px', // Spacing between each button
                }}
              >
                <IconButton aria-label="like" style={{ color: 'white' }}>
                  <ThumbUpOffAltIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="dislike" style={{ color: 'white' }}>
                  <ThumbDownOffAltIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="bookmark" style={{ color: 'white' }}>
                  <BookmarkBorderIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="bookmark" style={{ color: 'white' }}>
                  <NorthEastIcon
                    aria-label="redirect"
                    style={{ color: 'white' }}
                    onClick={() => window.open(article.url, '_blank')}
                  />{' '}
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        ))}
      </Slider>

      {/* {selectedArticle && ( */}
      {/* <Card sx={{ bgcolor: '#1E2235' }}> */}
      {selectedArticle && (
        // <Card sx={{ bgcolor: '#1E2235', position: 'relative' }}>
        <Box sx={{ position: 'relative' }}>
          <Card sx={{ bgcolor: '#1E2235' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bgcolor: '#1E2235',
                borderRadius: '8px 8px 0 0',
                transform: drawerOpen ? 'translateY(-85%)' : 'translateY(3%)',
                transition: 'transform 0.3s ease-out',
                zIndex: 2,
                overflow: 'hidden',
                paddingBottom: '20px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '15px',
                }}
              >
                <Box
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  sx={{
                    width: '80px',
                    height: '4px',
                    bgcolor: '#ABADC6',
                    borderRadius: '8  px',
                    cursor: 'pointer',
                  }}
                />
              </Box>
              <Box
                sx={{
                  color: '#FFFFFF',
                  paddingLeft: '30px',
                  paddingRight: '30px',
                  fontSize: '14px',
                  textAlign: 'justify',
                  justifyItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  maxHeight: drawerOpen ? '300px' : '90px',
                  overflow: drawerOpen ? 'auto' : 'hidden',
                }}
              >
                {summaries[selectedArticle.id] ? (
                  summaries[selectedArticle.id]
                ) : (
                  <CircularProgress size={24} />
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      )}

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100, // Make sure this is higher than other elements
        }}
      >
        <PlayerControls
          currentSummary={currentSummary}
          imageUrl={selectedArticle?.image}
          onNextClick={handleNextArticle}
          onPreviousClick={handlePreviousArticle}
        />
      </Box>
    </Box>
  );
};

export default NewsFeed;
