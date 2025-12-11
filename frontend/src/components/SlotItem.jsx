import React from "react";

const SlotItem = ({ slot, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(slot)}
      className={`px-4 py-2 rounded-lg border w-full text-left transition 
        ${selected? "bg-blue-600 text-white border-blue-700": "bg-white border-gray-300 hover:bg-gray-100"}
      `}
    >
      {slot}
    </button>
  );
};

export default SlotItem;
