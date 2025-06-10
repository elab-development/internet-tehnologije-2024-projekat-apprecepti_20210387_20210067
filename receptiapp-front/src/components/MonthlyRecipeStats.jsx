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

//Grafikon koji prikazuje brojnost napisanih recepata po mesecima
const MonthlyRecipeStats = () => {
  const [chartData, setChartData] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/recipes/statistics/monthly', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = res.data;

        if (!Array.isArray(responseData) || responseData.length === 0) {
          setChartData(null);
          return;
        }

        const meseci = [
          'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
          'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
        ];

        const labels = responseData.map(item => meseci[item.mesec - 1]);
        const data = responseData.map(item => item.broj);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Broj recepata',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error('Greška pri učitavanju statistike:', error);
        setChartData(null);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <p>Statistika nije dostupna ili nema podataka.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Statistika: Broj recepata po mesecu</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Recepti po mesecima' },
          },
        }}
      />
    </div>
  );
};

export default MonthlyRecipeStats;
