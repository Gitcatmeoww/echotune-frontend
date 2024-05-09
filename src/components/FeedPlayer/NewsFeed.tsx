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
import './slick2.css';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import PlayerControls from './PlayerControls';
import CloseIcon from '@mui/icons-material/Close';
import { IArticle } from '../../interfaces/IArticle';
import { ITopicData } from '../../interfaces/ITopicData';

interface NewsFeedProps {
  topics: ITopicData[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ topics }) => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [error, setError] = useState<string>('');
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const [SummaryGenerated, setSummaryGenerated] = React.useState(false);
  const [summaryList, setSummaryList] = useState<Map<string, string>>(
    new Map(),
  );
  const summaryRequestedRef = useRef(new Set());

  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null); // Initial value is null
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
    const loadArticles = async () => {
      try {
        const articles = (await fetchNews(
          isGuest,
          sessionId,
          token,
          topics,
        )) as IArticle[];

        setArticles(articles);

        if (articles.length > 0) {
          console.log("I'm here");
          console.log(articles[0].title);

          const summaryPromise = generateSummary(articles[0].title);
          console.log(summaryPromise);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
        console.log('Failed to load articles:', error);
      }
    };

    loadArticles();
  }, [topics]);

  // useEffect(() => {
  //   console.log(SummaryGenerated);
  //   const getSummaries = async () => {
  //     await Promise.all(
  //       articles.map(async (article) => {
  //         await generateSummary(article.title);
  //       }),
  //     );
  //     setSummaryGenerated(true);
  //   };
  //   // if (SummaryGenerated) {
  //   getSummaries();
  //   // setSummaryGenerated(true);
  //   // }
  // }, [articles]);
  // useEffect(() => {
  //   async function getSummariesForMissing() {
  //     let updatesNeeded = false;
  //     const newSummaryList = new Map(summaryList);

  //     for (const article of articles) {
  //       const articleTitle = article.title;
  //       if (
  //         !newSummaryList.has(articleTitle) &&
  //         !summaryRequestedRef.current.has(articleTitle)
  //       ) {
  //         console.log('Summary missing for:', articleTitle);
  //         summaryRequestedRef.current.add(articleTitle);

  //         const summary = await generateSummary(articleTitle);
  //         if (summary) {
  //           newSummaryList.set(articleTitle, summary);
  //           updatesNeeded = true;
  //         }
  //       }
  //     }

  //     if (updatesNeeded) {
  //       console.log('Updating summary list with new summaries', newSummaryList);
  //       setSummaryList(newSummaryList); // Update the state in one go
  //       setSummaryGenerated(true);
  //     }

  //     // if (updatesNeeded) {
  //     //   setSummaryList(newSummaryList);
  //     //   setSummaryGenerated(true);
  //     // }
  //   }

  //   if (articles.length > 0) {
  //     getSummariesForMissing();
  //   }
  // }, [articles]);

  // useEffect(() => {
  //   async function getSummariesForMissing() {
  //     for (const article of articles) {
  //       const articleTitle = article.title;
  //       if (
  //         !summaryList.has(articleTitle) &&
  //         !summaryRequestedRef.current.has(articleTitle)
  //       ) {
  //         console.log('Summary missing for:', articleTitle);
  //         summaryRequestedRef.current.add(articleTitle);
  //         const summary = await generateSummary(articleTitle);
  //         if (summary) {
  //           setSummaryList((prevSummaryList) => {
  //             const updatedSummaryList = new Map(prevSummaryList);
  //             updatedSummaryList.set(articleTitle, summary);
  //             return updatedSummaryList;
  //           });
  //         }
  //       }
  //     }
  //     setSummaryGenerated(true);
  //   }

  //   if (articles.length > 0) {
  //     getSummariesForMissing();
  //   }
  // }, [articles]);

  useEffect(() => {
    async function getSummariesForMissing() {
      for (const article of articles) {
        const articleTitle = article.title;

        if (
          !summaryList.has(articleTitle) &&
          !summaryRequestedRef.current.has(articleTitle) &&
          !localStorage.getItem(`summary_${articleTitle}`)
        ) {
          console.log('Summary missing for:', articleTitle);
          summaryRequestedRef.current.add(articleTitle);
          const summary = await generateSummary(articleTitle);

          if (summary) {
            setSummaryList((prevSummaryList) => {
              const updatedSummaryList = new Map(prevSummaryList);
              updatedSummaryList.set(articleTitle, summary);
              return updatedSummaryList;
            });

            // Store the summary in localStorage
            localStorage.setItem(`summary_${articleTitle}`, summary);
          }
        } else if (localStorage.getItem(`summary_${articleTitle}`)) {
          // If summary is available in localStorage, add it to the summaryList
          const localStorageSummary = localStorage.getItem(
            `summary_${articleTitle}`,
          );
          if (localStorageSummary) {
            setSummaryList((prevSummaryList) => {
              const updatedSummaryList = new Map(prevSummaryList);
              const localStorageSummary = localStorage.getItem?.(
                `summary_${articleTitle}`,
              );

              updatedSummaryList.set(articleTitle, localStorageSummary ?? '');
              return updatedSummaryList;
            });
          }
        }
      }

      setSummaryGenerated(true);
    }

    getSummariesForMissing();
  }, [articles]);

  // useEffect(() => {
  //   if (articles) {
  //     const getSummariesForMissing = async () => {
  //       for (const article of articles) {
  //         const articleTitle = article.title;
  //         // generateSummary(articleTitle);
  //         console.log('summaryList', summaryList);

  //         const summaryListArray = Array.from(summaryList);
  //         console.log(summaryListArray);
  //         if (summaryList.has(articleTitle)) {
  //           console.log('GOTCHA');
  //         } else {
  //           console.log('didnt find summary:', articleTitle);
  //           await generateSummary(articleTitle);
  //         }
  //       }
  //       setSummaryGenerated(true);
  //     };
  //     getSummariesForMissing();
  //   }
  // }, [articles]);

  //   const isGuest = !!localStorage.getItem('guestSessionId');
  //   const sessionId = localStorage.getItem('guestSessionId');
  //   const token = localStorage.getItem('token');

  //   const loadArticles = async () => {
  //     try {
  //       const articles = (await fetchNews(
  //         isGuest,
  //         sessionId,
  //         token,
  //         topics,
  //       )) as IArticle[];

  //       setArticles(articles);

  //       // Generate summaries for each article
  //       await Promise.all(
  //         articles.map(async (article) => {
  //           await generateSummary(article.title);
  //         }),
  //       );
  //     } catch (error) {
  //       console.error('Failed to load articles:', error);
  //     }
  //   };

  //   loadArticles();
  // }, [topics]);

  const fetchNews = async (
    isGuest: boolean,
    sessionId: string | null,
    token: string | null,
    topics: ITopicData[],
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

    const topicsQuery = topics
      .map((topic) => `"${topic.name.trim()}"`)
      .join(' OR ');
    try {
      const response = await axios.get(
        'http://localhost:8000/api/fetch_news/',
        {
          ...config,
          params: {
            ...config.params,
            q: topicsQuery,
            max: 10,
          },
        },
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Error fetching news:', error);
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    centerMode: true,

    afterChange: (currentSlide: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const selectedArticle = articles[currentSlide];
      setSelectedArticle(selectedArticle);
      if (selectedArticle) {
        const summary = summaries[selectedArticle.title];
        if (summary !== currentSummary) {
          setCurrentSummary(summary || null);
        }
      } else {
        setCurrentSummary(null);
      }
    },
  };

  // const generateSummary = async (articleTitle: string) => {
  //   const article = articles.find((a) => a.title === articleTitle);
  //   if (summaryList.has(articleTitle)) {
  //     console.log(`Summary already generated for: ${articleTitle}`);
  //     return;
  //   }
  //   // if (article) {
  //   //   setSelectedArticle(article);
  //   // }

  //   // Check if the summary is already present in the summaryList
  //   // const existingSummary = summaryList[articleTitle];
  //   const existingSummary = summaryList.get(articleTitle);
  //   if (existingSummary) {
  //     return;
  //   }

  //   // Check local storage for existing summary before making API call
  //   const cachedSummary = localStorage.getItem(`summary_${articleTitle}`);
  //   if (cachedSummary) {
  //     // setSummaryList(
  //     //   (prevSummaryList) =>
  //     //     new Map(prevSummaryList.set(articleTitle, cachedSummary)),
  //     // );
  //     setSummaryList((prevSummaryList) =>
  //       new Map(prevSummaryList).set(articleTitle, cachedSummary),
  //     );

  //     // setSummaryList((prevSummaryList) => {
  //     //   const updatedSummaryList = new Map(prevSummaryList);
  //     //   updatedSummaryList.set(articleTitle, cachedSummary);
  //     //   return updatedSummaryList;
  //     // });

  //     return;
  //   }

  //   if (article) {
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8000/api/generate_summary/',
  //         { content: article.content },
  //       );
  //       if (response) {
  //         const newSummary = response.data.generateSummary;
  //         localStorage.setItem(`summary_${articleTitle}`, newSummary);
  //         console.log('inside GS nowwww', summaryList);

  //         setSummaryList((prevSummaryList) => {
  //           const updatedSummaryList = new Map(prevSummaryList);
  //           updatedSummaryList.set(articleTitle, newSummary);
  //           console.log(prevSummaryList);
  //           console.log(summaryList);
  //           return updatedSummaryList;
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error generating summary:', error);
  //     }
  //   }
  // };
  const generateSummary = async (articleTitle: string) => {
    const article = articles.find((a) => a.title === articleTitle);
    if (!article) return null;

    try {
      const response = await axios.post(
        'http://localhost:8000/api/generate_summary/',
        { content: article.content },
      );
      if (response.data) {
        const newSummary = response.data.generateSummary;
        localStorage.setItem(`summary_${articleTitle}`, newSummary);
        return newSummary;
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      return null;
    }
  };

  useEffect(() => {
    const articleCards = document.querySelectorAll('.article-card');

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const articleId = entry.target.getAttribute('data-article-id');
            const articleSummary = entry.target.getAttribute('data-summary');
            const articleTitle =
              entry.target.getAttribute('data-article-title');

            if (articles.length > 0) {
              const currentIndex = articles.findIndex(
                (a) => a.id === selectedArticle?.id,
              );

              setSelectedArticle(articles[currentIndex]);
            }

            console.log(`Article ${articleId} is in view.`);

            if (articleId && articleTitle) {
              const selectedArticle = articles.find(
                (a) => a.title === articleTitle,
              ) as IArticle;
              setSelectedArticle(selectedArticle);
              console.log('selectedArticle', selectedArticle);
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
  }, [articles, observer]); // Effect will re-run if articles or summaries change

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
              transition: 'height 0.5s ease',
              padding: '20px',
              borderRadius: '12px',
              height: 385,
              color: 'success.dark',
              bgcolor: '#1E2235',
              opacity: drawerOpen ? 0.2 : 1,
            }}
            data-article-id={article.id}
            data-article-title={article.title}
            data-summary={summaryList.get(article.title)}
            className="article-card"
            onMouseDown={handleSliderInteraction}
            onTouchStart={handleSliderInteraction}
          >
            <CardMedia
              component="img"
              sx={{
                height: '15vh',
                borderRadius: '4px',
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

            <CardActions
              sx={{
                justifyContent: 'flex-end',
                position: 'absolute',
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
                  gap: '5px',
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

      {selectedArticle && (
        <Box sx={{ position: 'relative' }}>
          <Card sx={{ bgcolor: '#1E2235', marginTop: '7vh' }}>
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
                {selectedArticle && summaryList.get(selectedArticle.title) ? (
                  summaryList.get(selectedArticle.title)
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
          zIndex: 1100,
          top: '85vh',
        }}
      >
        <PlayerControls
          currSummary={
            selectedArticle
              ? summaryList.get(selectedArticle.title) || null
              : null
          }
          summaryGenerated={SummaryGenerated}
          imageUrl={selectedArticle?.image}
          title={selectedArticle?.title}
          onNextClick={handleNextArticle}
          onPreviousClick={handlePreviousArticle}
        />
      </Box>
    </Box>
  );
};

export default NewsFeed;
