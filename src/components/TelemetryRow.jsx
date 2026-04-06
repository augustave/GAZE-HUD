import React from 'react';

export default function TelemetryRow({ label, value, unit, isAlert }) {
  return (
    <div className="flex justify-between items-center text-[9px] mb-[2px] font-mono tracking-wider">
      <span className="text-sky-600/70">{label}</span>
      <span className={`flex items-center ${isAlert ? 'text-red-500 font-bold' : 'text-sky-200'}`}>
        {value} <span className="text-[7px] text-sky-700 ml-1">{unit}</span>
      </span>
    </div>
  );
}
