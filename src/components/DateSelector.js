import React from 'react';

const DateSelector = ({ startDate, endDate, selectedDate, onSelect }) => {
  const formatDate = (date) => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  const generateDateOptions = () => {
    const days = [];
    let currentDate = new Date(startDate.getTime());
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days.map((date) => (
      <option key={formatDate(date)} value={formatDate(date)}>
        {formatDate(date)}
      </option>
    ));
  };

  return (
    <select value={formatDate(selectedDate)} onChange={(e) => onSelect(new Date(e.target.value))}>
      {startDate && endDate && generateDateOptions()}
    </select>
  );
};

export default DateSelector;
