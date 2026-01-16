import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bibleBooks } from '../utils/bibleBooks';
import CrossReferenceModal from '../components/CrossReferenceModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Spinner from '../components/Spinner';


function BibleReader({ user }) {
  const [selectedBook, setSelectedBook] = useState(bibleBooks[0].name);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterText, setChapterText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(null); // To hold data for the modal
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentBook = bibleBooks.find(book => book.name === selectedBook);
  const chapterCount = currentBook ? currentBook.chapters : 0;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');

    if (ref) {
      // If a 'ref' is in the URL, perform a search for it
      handleSearch({ preventDefault: () => {} }, ref);
      setSearchQuery(ref);
      navigate('/bible-reader', { replace: true }); // Clear the ref from URL
      return; // Skip the default chapter fetch
    }

    const fetchChapter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://bible-api.com/${selectedBook}+${selectedChapter}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChapterText(data);
      } catch (e) {
        setChapterText(null);
        setError("Failed to load chapter. Please try again.");
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [selectedBook, selectedChapter, location.search]);

  const handleBookChange = (e) => {
    setSelectedBook(e.target.value);
    setSelectedChapter(1); // Reset to chapter 1 when book changes
  };

  const handleSearch = async (e, query) => {
    e.preventDefault();
    const finalQuery = query || searchQuery;
    if (!finalQuery) return;

    setLoading(true);
    setError(null);
    try {
      const formattedQuery = finalQuery.trim().replace(/\s/g, '+');
      const response = await fetch(`https://bible-api.com/${formattedQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChapterText(data);
      // Update dropdowns to match search result
      setSelectedBook(data.verses[0].book_name);
      setSelectedChapter(data.verses[0].chapter);
    } catch (e) {
      setChapterText(null);
      setError(`Could not find reference "${finalQuery}". Please check the format (e.g., "John 3:16").`);
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const goToNextChapter = () => {
    const currentBookIndex = bibleBooks.findIndex(book => book.name === selectedBook);
    const currentBook = bibleBooks[currentBookIndex];

    if (selectedChapter < currentBook.chapters) {
      setSelectedChapter(prev => prev + 1);
    } else if (currentBookIndex < bibleBooks.length - 1) {
      // Move to the first chapter of the next book
      const nextBook = bibleBooks[currentBookIndex + 1];
      setSelectedBook(nextBook.name);
      setSelectedChapter(1);
    }
    // Do nothing if it's the last chapter of the last book
  };

  const goToPrevChapter = () => {
    const currentBookIndex = bibleBooks.findIndex(book => book.name === selectedBook);

    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else if (currentBookIndex > 0) {
      // Move to the last chapter of the previous book
      const prevBook = bibleBooks[currentBookIndex - 1];
      setSelectedBook(prevBook.name);
      setSelectedChapter(prevBook.chapters);
    }
    // Do nothing if it's the first chapter of the first book
  };

  const handleVerseClick = async (verse) => {
    const reference = `${chapterText.reference}:${verse.verse}`;
    setModalData({ verse, reference });

    // Update the last studied verse in Firestore
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { lastStudied: reference });
      } catch (error) {
        console.error("Error updating last studied verse: ", error);
      }
    }
  };
  if (loading) return <Spinner message="Loading chapter..." />;


  return (
    <div>
      {modalData && <CrossReferenceModal {...modalData} user={user} onClose={() => setModalData(null)} />}
      <h2 className="subtitle-font">Bible Reader</h2>
      <p className="page-description">Select a book and chapter, or search for a passage. Click on any verse to save it to your profile.</p>
      <div className="bible-selector-container">
        <select className="bible-select" value={selectedBook} onChange={handleBookChange}>
          {bibleBooks.map(book => (
            <option key={book.name} value={book.name}>{book.name}</option>
          ))}
        </select>
        <select className="bible-select" value={selectedChapter} onChange={e => setSelectedChapter(Number(e.target.value))}>
          {Array.from({ length: chapterCount }, (_, i) => i + 1).map(chapterNum => (
            <option key={chapterNum} value={chapterNum}>Chapter {chapterNum}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSearch} className="bible-search-form">
        <input
          type="text"
          className="bible-search-input"
          placeholder="e.g., John 3:16 or Genesis 1:1-5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="bible-text-container">
        {loading && <p>Loading chapter...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && chapterText && (
          <>
            <h3>{chapterText.reference}</h3>
            <div className="verses-display">
             {chapterText.verses.map(verse => (
                <p
                  key={verse.verse}
                  className="verse-item"
                  onClick={() => handleVerseClick(verse)}
                >
                  <sup className="verse-number">{verse.verse}</sup>
                  <span className="verse-content">
                    {verse.text}
                  </span>
                </p>
              ))}
            </div>
            <div className="chapter-navigation">
              <button onClick={goToPrevChapter} disabled={loading || (selectedBook === 'Genesis' && selectedChapter === 1)}>
                &larr; Previous
              </button>
              <button onClick={goToNextChapter} disabled={loading || (selectedBook === 'Revelation' && selectedChapter === 22)}>
                Next &rarr;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default BibleReader;