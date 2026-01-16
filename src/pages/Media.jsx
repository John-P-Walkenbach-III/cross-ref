import React, { useState } from 'react';
import Spinner from '../components/Spinner';

// Define all videos in an array for easy management
const videoData = [
  {
    title: 'Alan Jackson - Precious Memories (Full Album)',
    src: 'https://www.youtube.com/embed/wPZMlvgN1Hw?list=PLr_SwoyFffktXo3fXrukIr8HQuDgKiMwa',
  },
  {
    title: 'Alan Jackson- When God Paints',
    src:   'https://www.youtube.com/embed/qSorUl1pBbg?list=RDqSorUl1pBbg',
  },
  {
    title: 'More Than Able - Elevation Worship',
    src: 'https://www.youtube.com/embed/dQ1xxoP7NJk?list=RDdQ1xxoP7NJk',
  },
  {
    title: 'Trust In God - Elevation Worship',
    src: 'https://www.youtube.com/embed/QS04WbSnxok',
  },
  {
    title: 'Graves Into Gardens',
    src: 'https://www.youtube.com/embed/KwX1f2gYKZ4?list=RDKwX1f2gYKZ4'
  },
  {
    title: 'Psalms In A Blues Mix',
    src: 'https://www.youtube.com/embed/1UItx9upywQ?list=RD1UItx9upywQ',
  },
  {
    title: 'Return Of Christ',
    src: 'https://www.youtube.com/embed/GgwvWj5fI58',
  },
  {
    title: 'Powerful Prayer For Protection, Open Doors, Healing & Favour',
    src:    'https://www.youtube.com/embed/EXHrxnr4ZL4' ,
  },
  {
    title: 'A Powerful Morning Prayer You Need Today',
    src: 'https://www.youtube.com/embed/tAuATPi5NVU',
  },
];




function Media() {
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = videoData.length; // Total is now dynamic

  const handleVideoLoad = () => {
    setLoadedVideos(prevCount => prevCount + 1);
  };

  const allVideosLoaded = loadedVideos >= totalVideos;

  return (
    <div className="text-page-container">
      {!allVideosLoaded && <Spinner message="Loading media..." />}

      <div style={{ visibility: allVideosLoaded ? 'visible' : 'hidden' }}>
        <h2 className="subtitle-font">Media</h2>
        {videoData.map((video) => (
          <div key={video.title} className="media-section">
            <h4>{video.title}</h4>
            <div className="video-container">
              <iframe
                onLoad={handleVideoLoad}
                src={video.src}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Media;
