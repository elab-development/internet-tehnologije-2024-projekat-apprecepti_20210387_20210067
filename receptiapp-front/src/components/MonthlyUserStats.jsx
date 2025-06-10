import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyUserStats = () => {
  const [chartData, setChartData] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/users/statistics/monthly', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const meseci = [
          'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
          'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
        ];

        const responseData = res.data;
        const labels = responseData.map(item => meseci[item.mesec - 1]);
        const data = responseData.map(item => item.broj);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Broj korisnika',
              data,
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error('Greška pri učitavanju statistike korisnika:', error);
        setChartData(null);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <p>Nema podataka o registrovanim korisnicima.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Statistika: Registrovani korisnici po mesecu</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Korisnici po mesecima' },
          },
        }}
      />
    </div>
  );
};

export default MonthlyUserStats;
