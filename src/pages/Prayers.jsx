import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function Prayers({ user }) {
  const [prayerRequest, setPrayerRequest] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [publicPrayers, setPublicPrayers] = useState([]);
  const [loadingPrayers, setLoadingPrayers] = useState(true);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [showSuggestionSuccess, setShowSuggestionSuccess] = useState(false);

  useEffect(() => {
    const fetchPublicPrayers = async () => {
      const prayersCollectionRef = collection(db, 'publicPrayers');
      const q = query(prayersCollectionRef, orderBy('approvedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const prayersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicPrayers(prayersData);
      setLoadingPrayers(false);
    };

    fetchPublicPrayers();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!user || !prayerRequest.trim()) return;

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        prayerRequests: arrayUnion({
          request: prayerRequest,
          requestedAt: new Date(),
        })
      }, { merge: true }); // Use merge to create the field if it doesn't exist
      setPrayerRequest('');
      setShowRequestSuccess(true);
      setTimeout(() => setShowRequestSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving prayer request: ", error);
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    try {
      await addDoc(collection(db, 'prayerSuggestions'), {
        suggestion: suggestion,
        submittedAt: serverTimestamp(),
        submittedBy: user ? { uid: user.uid, name: user.displayName } : { uid: null, name: 'Anonymous' }
      });
      setSuggestion('');
      setShowSuggestionSuccess(true);
      setTimeout(() => setShowSuggestionSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    }
  };

  return (
    <div className="text-page-container prayers-page">
      <h2 className="subtitle-font">Prayers & Requests</h2>

      <div className="prayers-grid">
        <div className="prayer-card">
          <h4>The Lord's Prayer</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            Our Father, who art in heaven,
            {'\n'}hallowed be thy name;
            {'\n'}thy kingdom come;
            {'\n'}thy will be done;
            {'\n'}on earth as it is in heaven.
            {'\n'}Give us this day our daily bread.
            {'\n'}And forgive us our trespasses,
            {'\n'}as we forgive those who trespass against us.
            {'\n'}And lead us not into temptation;
            {'\n'}but deliver us from evil. Amen.
          </p>
        </div>

        <div className="prayer-card">
          <h4>Prayer for Repentance</h4>
          <p>
            Lord Jesus, I come before you just as I am. I am sorry for my sins, and I repent of my sins. Please forgive me. In your name, I forgive all others for what they have done against me. I renounce Satan, the evil spirits, and all their works. I give you my entire self, Lord Jesus, now and forever. I invite you into my life, Jesus. I accept you as my Lord, God, and Savior. Heal me, change me, strengthen me in body, soul, and spirit. Come, Lord Jesus, cover me with your Precious Blood, and fill me with your Holy Spirit. I love you, Lord Jesus. I praise you, Jesus. I thank you, Jesus. I shall follow you every day of my life. Amen.
          </p>
        </div>

        <div className="prayer-card">
          <h4>Prayer to Receive the Holy Spirit</h4>
          <p>
            Heavenly Father, I thank you for the gift of your Son, Jesus Christ, who died for my sins and rose from the dead. I confess my faith in Him as my Lord and Savior. I believe your word that says if I ask, I will receive. In the name of Jesus, I ask you to fill me with your Holy Spirit. Empower me to live a life that pleases you and to be a bold witness for Christ. Thank you, Father. Amen.
          </p>
        </div>
      </div>

      <div className="prayer-card full-width-card">
        <h4>Community Prayers</h4>
        <p>Prayers submitted and approved by our community members. Join us in lifting them up.</p>
        {loadingPrayers && <p>Loading community prayers...</p>}
        {!loadingPrayers && publicPrayers.length === 0 && <p>No community prayers have been posted yet.</p>}
        {publicPrayers.length > 0 && (
          <ul className="prayer-requests-list">
            {publicPrayers.map(prayer => (
              <li key={prayer.id} className="prayer-request-item">
                <p className="prayer-request-text">{prayer.text}</p>
                <p className="post-meta" style={{ textAlign: 'left', marginTop: '1rem' }}>Submitted by: {prayer.submittedBy}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="prayers-grid">
        <div className="prayer-card">
          <h4>Submit a Prayer Request</h4>
          <p>Share a personal prayer request here. Your requests are private and will be saved to your profile for your own reflection.</p>
          <p className="prayer-request-note">Members of the Cross Reference website will check requests daily and prayers will be made for them.</p>
          <form onSubmit={handleRequestSubmit} className="prayer-form">
            <textarea
              className="note-textarea"
              placeholder="Write your prayer request here..."
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
            />
            <button type="submit">Submit Request</button>
            {showRequestSuccess && <span className="form-success-message">Your request has been saved to your profile.</span>}
          </form>
        </div>

        <div className="prayer-card">
          <h4>Suggest a Prayer</h4>
          <p>Have a prayer that you think would be beneficial for others? Suggest it here for inclusion on this page.</p>
          <form onSubmit={handleSuggestionSubmit} className="prayer-form">
            <textarea
              className="note-textarea"
              placeholder="Write the prayer you'd like to suggest..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            />
            <button type="submit">Submit Suggestion</button>
            {showSuggestionSuccess && <span className="form-success-message">Thank you for your suggestion!</span>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Prayers;