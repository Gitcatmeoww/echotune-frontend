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

  const toggleSummary = (articleId: string | null) => {
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
        padding: '20px',
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
              width: 345,
              height: 345,
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
          </Card>
        ))}
      </Slider>

      {selectedArticle && (
        <Card sx={{ bgcolor: '#1E2235' }}>
          <Box
            onClick={() => toggleSummary(selectedArticle.id)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              bottom: 0,
              marginTop: 1,
              cursor: 'pointer',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                width: '40px',
                height: '4px',
                bgcolor: '#ABADC6',
                borderRadius: '3px',
                marginInline: 'auto',
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: '10px',
            }}
          >
            {summaries[selectedArticle.id] ? (
              <Box
                sx={{
                  padding: '5px',
                  height:
                    expandedArticleId === selectedArticle?.id
                      ? '300px'
                      : '100px',

                  // height: '10px',
                  overflow: 'auto',
                }}
              >
                {/* {summaries[selectedArticle.id]} */}
                {(summaries[selectedArticle.id] ?? '').slice(0, 120)}...
              </Box>
            ) : (
              <CircularProgress />
            )}
          </Typography>
          <SwipeableDrawer
            anchor="bottom"
            open={expandedArticleId === selectedArticle?.id}
            onClose={() => toggleSummary(null)}
            onOpen={() => toggleSummary(selectedArticle.id)}
            // swipeAreaWidth={56}
            disablePortal={true}
            disableSwipeToOpen={false}
            ModalProps={{
              BackdropProps: {
                style: { position: 'absolute' },
                invisible: true, // Makes the backdrop invisible
              },
              // ModalProps={{
              //   keepMounted: true,
            }}
            sx={{
              '.MuiDrawer-paper ': {
                height: 'calc(100% - 180px)',
                top: 64,
                fontSize: 'small',
                // zIndex: 800,
              },
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#1E2235',
                padding: '25px',
                // height: '300px',
                overflow: 'auto',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                position: 'relative',
                zIndex: 2,
                // height: '80%',
                // top: 'calc(100% - 150px)',
              },
            }}
          >
            <Box
              sx={{
                // display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                bottom: 0,
                marginTop: 1,
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box
                onClick={() => toggleSummary(null)}
                sx={{
                  width: '40px',
                  height: '4px',
                  bgcolor: '#ABADC6',
                  borderRadius: '3px',
                  marginInline: 'auto',
                  bottom: '20px',
                }}
              />
            </Box>

            <Box
              // sx={{
              //   padding: '15px',
              // }}
              onClick={() => toggleSummary(null)}
            >
              {summaries[selectedArticle.id] ? (
                <Box
                  sx={{
                    overflow: 'auto',
                    height: '100%',
                    color: '#FFFFFF',
                    padding: '15px',
                  }}
                >
                  {summaries[selectedArticle.id]}
                </Box>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </SwipeableDrawer>
        </Card>
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

    // </Box>
  );
};
{
  /* <Card
        //   sx={{
        //     bgcolor: '#1E2235',
        //   }}
        // >
        //   <Box
        //     onClick={() => toggleSummary(selectedArticle.id)}
        //     sx={{
        //       display: 'flex',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       p: 1,
        //       bottom: 0,
        //       marginTop: 1,
        //       cursor: 'pointer',
        //       position: 'relative',
        //       // top: expandedArticleId === selectedArticle.id ? '5px' : '-20px',
        //       // bgcolor: '#1E2235',
        //       zIndex: 2,
        //     }}
        //   >
        //     <Box
        //       sx={{
        //         width: '40px',
        //         height: '4px',
        //         bgcolor: '#ABADC6',
        //         borderRadius: '3px',
        //       }}
        //     />
        //   </Box>
        //   <Box
        //     sx={{
        //       position:
        //         expandedArticleId === selectedArticle?.id
        //           ? 'absolute'
        //           : 'static',
        //       top: expandedArticleId === selectedArticle?.id ? '30px' : '-100%', // Adjust the top property to cover the first card
        //       left: 0,
        //       width: '100%',
        //       backgroundColor: '#1E2235',
        //       overflow: 'hidden',
        //       padding:
        //         expandedArticleId === selectedArticle?.id ? '25px' : '5px',
        //       // zIndex: expandedArticleId === selectedArticle?.id ? 2 : 1,

        //       height: '-webkit-fill-available',
        //       transition: 'bottom 0.5s ease',
        //     }}
        //   >
            // <Typography
            //   variant="body2"
            //   sx={{
            //     display: 'flex',
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     p: '10px',
            //   }}
            // >
            //   {summaries[selectedArticle.id] ? (
            //     <Box
            //       sx={{
            //         padding: '5px',
            //         height:
            //           expandedArticleId === selectedArticle?.id
            //             ? '300px'
            //             : '50px',

            //         // height: '50px',
            //         overflow: 'auto',
            //       }}
            //     >
            //       {summaries[selectedArticle.id]}
            //     </Box>
            //   ) : (
            //     <CircularProgress />
            //   )}
            // </Typography>
        //   </Box>

          // <Box
          //   sx={{
          //     position: 'relative',
          //     top: '20px',
          //     left: 0,
          //     right: 0,
          //     bottom: 0,
          //     zIndex: 1100,
          //   }}
          // > */
}

{
  /* <CardContent>
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
            </CardContent> */
}

{
  /* <Box
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
            > */
}
{
  /*            
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
                      height: '320px',
                      overflow: 'auto',
                    }}
                  >
                    {summaries[article.id]}
                  </Box>
                ) : (
                  <CircularProgress />
                )}
              </Typography> */
}
{
  /* </Box>
          </Card>
        ))}
      </Slider> */
}
{
  /* <Box
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
      <PlayerControls currentSummary={currentSummary} /> */
}
{
  /* </Box>
  );
}; */
}

export default NewsFeed;
