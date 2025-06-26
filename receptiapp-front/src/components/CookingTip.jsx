import { useEffect, useState } from 'react';
import axios from 'axios';

const CookingTip = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  const translateText = async (text, from = 'en', to = 'sr') => {
    try {
      const res = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `${from}|${to}`
        }
      });

      return res.data.responseData.translatedText;
    } catch (error) {
      console.error('Greška pri prevođenju:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchTip = async () => {
      let suitableTip = '';
      let attempts = 0;

      try {
        while (!suitableTip && attempts < 10) {
          const res = await axios.get('https://api.spoonacular.com/food/trivia/random', {
            params: { apiKey: 'f613f07ab7a34477860955c27d57e272' }
          });

          const translated = await translateText(res.data.text);

          if (translated && translated.length <= 120) {
            suitableTip = translated;
          }

          attempts++;
        }

        if (suitableTip) {
          setTip(suitableTip);
        } else {
          setTip('Nema dostupnog kratkog saveta.');
        }
      } catch (error) {
        setTip('Greška pri učitavanju saveta.');
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, []);

  return (
    <div className="cooking-tip-container">
      <div className="tip-content">
        <h2>Da li ste znali</h2>
        {loading ? <p>Učitavanje...</p> : <p>{tip}</p>}
      </div>
    </div>
  );
};

export default CookingTip;
