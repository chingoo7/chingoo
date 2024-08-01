// src/components/NetWorthProjection.js
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function NetWorthProjection({ userData }) {
  const projectionData = useMemo(() => {
    const years = Array.from({ length: 31 }, (_, i) => i);
    const netWorthData = years.map((year) => {
      // Calculate annual income and expenses
      const annualIncome = (userData.incomeCashflow || []).reduce((sum, item) => sum + (Number(item.amount) || 0) * 12, 0);
      const annualExpenses = (userData.expensesCashflow || []).reduce((sum, item) => sum + (Number(item.amount) || 0) * 12, 0);

      // Calculate cumulative cashflow over the years
      const cumulativeCashflow = (annualIncome - annualExpenses) * year;

      // Calculate asset growth
      const assetValue = (userData.assets || []).reduce((sum, asset) => {
        const growthRate = Number(asset.growthRate) / 100 || 0;
        return sum + (Number(asset.value) || 0) * Math.pow(1 + growthRate, year);
      }, 0);

      // Calculate liability growth
      const liabilityValue = (userData.liabilities || []).reduce((sum, liability) => {
        const interestRate = Number(liability.interestRate) / 100 || 0;
        return sum + (Number(liability.value) || 0) * Math.pow(1 + interestRate, year);
      }, 0);

      // Calculate net worth
      const netWorth = cumulativeCashflow + assetValue - liabilityValue;

      return netWorth;
    });

    return {
      labels: years,
      datasets: [
        {
          label: 'Net Worth',
          data: netWorthData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  }, [userData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Net Worth Projection',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Net Worth: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Net Worth (USD)',
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={projectionData} options={options} />
    </div>
  );
}

export default NetWorthProjection;