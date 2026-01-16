import React from 'react';

// Example of how you would import local images if you add them to `src/assets`
import oliveWoodImg from '../assets/olive-wood.webp';
import titulusImg from '../assets/titulus.webp';

function CrossFacts() {
  return (
    <div className="text-page-container">
      <h2 className="subtitle-font">Facts About the Cross</h2>

      <div className="text-section">
        <h4>What was the cross made of?</h4>
        <p>
          Roman crosses were not uniform and could be made from various types of wood. Archaeological evidence from one crucifixion victim found near Jerusalem suggests the use of olive wood. However, the Romans were practical and would have used whatever timber was available, especially during mass crucifixions. The cross itself could have been a simple upright stake or, more commonly depicted, a T-shaped structure. The image below depicts a cross made of Olive Wood.
        </p>
        <figure>
          <img src={oliveWoodImg} alt="Cross made of olive wood" className="fact-image" />
          <figcaption>A modern cross crafted from olive wood, a material believed to have been used for crucifixions.</figcaption>
        </figure>
      </div>

      <div className="text-section">
        <h4>How long was Jesus on the cross?</h4>
        <p>
          The Gospels provide a timeline. According to the Gospel of Mark, Jesus was crucified at the "third hour" (9:00 a.m.). Darkness is said to have covered the land from about the sixth hour (noon) until the ninth hour (3:00 p.m.), which is when Jesus died. This means He was on the cross for approximately six hours.
        </p>
      </div>

      <div className="text-section">
        <h4>Was crucifixion a common practice?</h4>
        <p>
          Yes, it was a common and brutal form of execution used by the Romans, but it was typically reserved for slaves, foreigners, disgraced soldiers, and political rebels. It was considered an extremely shameful way to die, and Roman citizens were rarely crucified. During times of rebellion, thousands could be crucified.
        </p>
      </div>

      <div className="text-section">
        <h4>What did the sign on the cross say?</h4>
        <p>
          A sign, called a *titulus*, was affixed to the top of the cross stating the charge against the condemned. The Gospels record the inscription with slight variations, but the core message was "King of the Jews." The Gospel of John specifies it was written in three languages for all passersby to read: Hebrew, Latin (IESVS NAZARENVS REX IVDAEORVM, often abbreviated INRI), and Greek (ΟΥΤΟΣ ΕΣΤΙΝ Ο ΒΑΣΙΛΕΥΣ ΤΩΝ ΙΟΥΔΑΙΩΝ).
        </p>
        <figure>
          <img src={titulusImg} alt="A replica of the Titulus Crucis" className="fact-image" />
          <figcaption>A recreation of the *titulus* showing the inscription in Hebrew, Greek, and Latin.</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default CrossFacts;