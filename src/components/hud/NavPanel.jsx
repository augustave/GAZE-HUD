import React from 'react';
import HudPanel from '../HudPanel';
import TelemetryRow from '../TelemetryRow';
import { useHud } from '../../contexts/HudContext';

export default function NavPanel() {
  const { heading, altitude, pitch, roll, aoa, airspeed } = useHud();

  return (
    <HudPanel title="PLATFORM.NAV" idCode="GHOST_X" className="w-56">
      <div className="text-3xl font-light tracking-tighter text-sky-200 mb-1">
        {heading.toFixed(2)}<span className="text-lg text-sky-700">°</span>
      </div>
      <div className="flex items-center text-[8px] text-sky-600/80 mb-3 uppercase tracking-widest border-b-[0.5px] border-sky-900/30 pb-2">
        <span className="w-1.5 h-1.5 bg-sky-600 mr-2"></span> HDG_TRK_TRUE
      </div>

      <div className="space-y-[2px] pl-2 border-l-[0.5px] border-sky-800">
        <TelemetryRow label="ALT_MSL" value={altitude.toFixed(2)} unit="FT" />
        <TelemetryRow label="PITCH_RATE" value={pitch.toFixed(2)} unit="°/S" />
        <TelemetryRow label="ROLL_RATE" value={roll.toFixed(2)} unit="°/S" />
        <TelemetryRow label="AOA" value={aoa.toFixed(1)} unit="°" />
        <TelemetryRow label="AIRSPEED" value={airspeed.toFixed(1)} unit="KTS" />
      </div>
    </HudPanel>
  );
}
