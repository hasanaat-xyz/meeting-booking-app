import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ onDateSelect }) => {
  const [value, setValue] = useState(new Date());

  const handleChange = (date) => {
    setValue(date);
    onDateSelect(date); // send to parent
  };

  return (
    <div className="bg-white shadow rounded p-4 w-full">
      <h2 className="text-lg font-semibold mb-3 text-center">
        Select a Date
      </h2>

      <Calendar
        onChange={handleChange}
        value={value}
        className="rounded border"
      />
    </div>
  );
};

export default CalendarView;
