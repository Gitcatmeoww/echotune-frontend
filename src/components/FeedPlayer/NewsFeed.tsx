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
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PlayerControls from './PlayerControls';
import { IArticle } from '../../interfaces/IArticle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
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
    dots: true,
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

  // if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        overflowX: 'auto',
        // display: 'flex',
        padding: '20px',
      }}
    >
      <Slider {...settings} ref={sliderRef}>
        {articles.map((article) => (
          <Card
            key={article.id}
            sx={{
              width: 345,
              margin: '10px',
              color: 'success.dark',
              bgcolor: '#1E2235',
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
              <IconButton
                aria-label="like"
                style={{ color: 'green', justifyContent: 'space-between' }}
              >
                <PlayCircleOutlineIcon fontSize="large" />
              </IconButton>
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

            <Box
              sx={{
                overflow: 'auto',
                display: 'flex',
                maxHeight: '100px',
                justifyContent: 'center',
                '::-webkit-scrollbar': { display: 'none' },
                marginTop: '50px',
                padding: '5px 8px',
              }}
            >
              <Typography variant="caption" color="#FFFFFF">
                {summaries[article.id] || <CircularProgress size={24} />}
              </Typography>
            </Box>
            <PlayerControls currentSummary={currentSummary} />
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default NewsFeed;

// import axios from 'axios';
// import React, { useState, useEffect, useRef } from 'react';
// import { IArticle } from '../../interfaces/IArticle';
// import { CircularProgress, IconButton } from '@mui/material';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import PlayerControls from './PlayerControls';
// import NorthEastIcon from '@mui/icons-material/NorthEast';

// // import Carousel from 'react-material-ui-carousel'

// const NewsFeed: React.FC = () => {
//   const [articles, setArticles] = useState<IArticle[]>([]);
//   const [error, setError] = useState<string>('');
//   const observer = useRef<IntersectionObserver | null>(null);
//   const [summaries, setSummaries] = useState<SummariesType>({});
//   const [currentSummary, setCurrentSummary] = useState<string | null>(null);
//   const [tag, setTag] = useState('');

//   useEffect(() => {
//     const isGuest = !!localStorage.getItem('guestSessionId');
//     const sessionId = localStorage.getItem('guestSessionId');
//     const token = localStorage.getItem('token');

//     fetchNews(isGuest, sessionId, token);
//   }, []);

//   const fetchNews = async (
//     isGuest: boolean,
//     sessionId: string | null,
//     token: string | null,
//   ) => {
//     const config: {
//       headers: Record<string, string>;
//       params: Record<string, string | null>;
//     } = {
//       headers: {},
//       params: {
//         is_guest: isGuest.toString(),
//         session_id: sessionId,
//       },
//     };

//     if (token) {
//       config.headers.Authorization = `Token ${token}`;
//     }

//     console.log(config);

//     try {
//       console.log(config);
//       const response = await axios.get(
//         'http://localhost:8000/api/fetch_news/',
//         config,
//       );
//       setArticles(response.data);
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       setError('Failed to fetch news. Please try again later.');
//     }
//   };

//   const fetchTag = async (userInput: string) => {
//     try {
//       const response = await axios.post('/api/generate_tag', {
//         content: userInput,
//       });
//       setTag(response.data.tag);
//     } catch (error) {
//       console.error('Error fetching tag:', error);
//     }
//   };

//   const redirectToSource = (url: string) => {
//     window.open(url, '_blank');
//   };

// interface SummariesType {
//   [key: string]: string | undefined; // This means each key is a string and its value is either string or undefined
// }

//   const observedArticleRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
//     {},
//   );

//   // const setArticleRef =
//   //   (article: IArticle) => (node: HTMLDivElement | null) => {
//   //     observedArticleRefs.current[article.id] = node;
//   //     if (node) {
//   //       observer.current?.observe(node);
//   //     }
//   // };

// const generateSummary = async (articleId: string) => {
//   console.log(articleId);
//   const article = articles.find((a) => a.id == articleId);
//   if (article && !summaries[articleId]) {
//     console.log(`Generating summary for article ID ${articleId}`);
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/generate_summary/',
//         { content: article.content },
//       );
//       setSummaries((prev) => ({
//         ...prev,
//         [articleId]: response.data.generateSummary,
//       }));
//       setCurrentSummary(response.data.generateSummary); // Set the current summary to be played

//       console.log('Summary generated:', response.data.generateSummary);
//     } catch (error) {
//       console.error('Error generating summary:', error);
//     }
//   }
// };

// useEffect(() => {
//   observer.current = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const articleId = entry.target.getAttribute('data-article-id');
//           const curr_summary = entry.target.getAttribute('data-summary');
//           console.log(articleId);
//           console.log(curr_summary);
//           console.log(`Article ${articleId} is in view.`);
//           if (articleId) {
//             generateSummary(articleId);
//             observer.current?.unobserve(entry.target);
//           }
//         }
//       });
//     },
//     { threshold: 0.1 },
//   );

//   const articleCards = document.querySelectorAll('.article-card');
//   articleCards.forEach((card) => {
//     observer.current?.observe(card);
//   });

//   return () => {
//     console.log('Disconnecting observer.');
//     observer.current?.disconnect();
//   };
// }, [articles, summaries]);

// if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <Box
//       sx={{
//         overflowX: 'auto',
//         display: 'flex',
//         padding: '20px',
//       }}
//     >
//       {articles.map((article) => (
//         <Card
//           key={article.id}
//           sx={{
//             width: 345,
//             margin: '10px',
//             flexShrink: 0,
//             color: 'success.dark',
//             bgcolor: '#1E2235',
//           }}
//           data-article-id={article.id}
//           data-summary={currentSummary}
//           className="article-card"

//           // color="#1E2235"

//           // ref={setArticleRef(article)}
//         >
//           <CardMedia
//             component="img"
//             sx={{ height: 140, width: '100%', objectFit: 'cover' }}
//             image={article.image}
//             alt={article.title}
//           />
//           <CardContent>
//             <Typography
//               gutterBottom
//               variant="body1"
//               component="div"
//               color="#FFFFFF"
//             >
//               {article.title}
//             </Typography>
//             <Typography variant="caption" color="#ABADC6">
//               {new Date(article.publishedAt).toLocaleDateString()}
//             </Typography>
//             <Typography
//               variant="caption"
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 color: '#ABADC6',
//               }}
//             >
//               <Box component="span" sx={{ marginRight: '8px' }}>
//                 Blog
//               </Box>
//               •
//               <Box component="span" sx={{ marginLeft: '0px' }}>
//                 {article.sourceName}
//               </Box>
//             </Typography>
//           </CardContent>
//           {/* <Box
//             sx={{
//               maxHeight: '100px',
//               overflow: 'auto',
//               '::-webkit-scrollbar': { display: 'none' },
//               marginTop: '120px',
//             }}
//           > */}
//           {/* <Box ml={1}>
//               <Typography variant="caption" color="#FFFFFF">
//                 {summaries[article.id] || <CircularProgress size={24} />}
//               </Typography>
//             </Box> */}

//           {/* <Typography variant="caption" color="#FFFFFF">
//               {summaries[article.id] || <CircularProgress size={24} />}
//             </Typography> */}
//           {/* </Box> */}
//           <CardActions>
//             <Box sx={{ flexGrow: 1 }} />
//             <IconButton aria-label="like" style={{ color: 'white' }}>
//               <ThumbUpOffAltIcon fontSize="small" />
//             </IconButton>
//             <IconButton aria-label="dislike" style={{ color: 'white' }}>
//               <ThumbDownOffAltIcon fontSize="small" />
//             </IconButton>
//             <IconButton aria-label="bookmark" style={{ color: 'white' }}>
//               <BookmarkBorderIcon fontSize="small" />
//             </IconButton>
//             <NorthEastIcon
//               style={{ color: 'white' }}
//               onClick={() => window.open(article.url, '_blank')}
//             >
//               {/* <Button
//                 size="small"
//                 color="primary"
//                 onClick={() => window.open(article.url, '_blank')}
//               >
//                 Read More
//               </Button> */}
//             </NorthEastIcon>
//           </CardActions>
//           <Box
//             sx={{
//               maxHeight: '100px',
//               overflow: 'auto',
//               '::-webkit-scrollbar': { display: 'none' },
//               marginTop: '70px',
//             }}
//           >
//             <Typography variant="caption" color="#FFFFFF">
//               {summaries[article.id] || <CircularProgress size={24} />}
//             </Typography>
//           </Box>
//           <PlayerControls currentSummary={currentSummary} />
//         </Card>
//       ))}
//     </Box>
//   );
// };

// export default NewsFeed;
