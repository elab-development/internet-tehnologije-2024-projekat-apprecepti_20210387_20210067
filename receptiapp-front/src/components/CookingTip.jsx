import { useEffect, useState } from 'react';
import axios from 'axios';

const CookingTip = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

//poziv javnog servisa za prevodjenje 
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

  //poziv javnog servisa za generisanje random cinjenica vezanih za kulinarstvo
  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await axios.get('https://api.spoonacular.com/food/trivia/random', {
          params: { apiKey: 'f613f07ab7a34477860955c27d57e272' } // zameni sa tvojim ključem
        });

        const originalText = res.data.text;
        const translated = await translateText(originalText);
        setTip(translated);
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
      <div className="overlay">
        <h2>Da li ste znali</h2>
        {loading ? <p>Učitavanje...</p> : <p>{tip}</p>}
      </div>
    </div>
  );
};

export default CookingTip;
