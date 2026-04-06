import React from 'react';
import HudPanel from '../HudPanel';
import TelemetryRow from '../TelemetryRow';
import { useHud } from '../../contexts/HudContext';

export default function TelemetryPanel() {
  const { hexStream, logs, coreTemp, linkQos } = useHud();

  return (
    <HudPanel title="SYS.TELEMETRY" idCode="V-BAT_5.3" className="w-56">
      <div className="space-y-3">
        <div className="flex justify-between items-end border-b-[0.5px] border-sky-900/50 pb-2">
          <div>
            <div className="text-[10px] text-sky-200 tracking-wider">AIRCORP C-SERIES</div>
            <div className="text-[7px] text-sky-600 uppercase mt-0.5">Drone Control Link</div>
          </div>
          <div className="text-[8px] bg-sky-900/40 text-sky-300 px-1 py-0.5">SECURE</div>
        </div>

        <div>
          <div className="text-[8px] text-sky-600 mb-1 flex items-center">
            <span className="w-1 h-1 bg-amber-500/80 rounded-full mr-1 animate-pulse"></span>
            TASK_POOL: ACTIVE_INJECTION
          </div>
          <div className="flex space-x-[2px] h-1 mb-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`flex-1 ${i < 7 ? 'bg-sky-400/80' : 'bg-sky-950'}`}></div>
            ))}
          </div>
        </div>

        <div>
          <TelemetryRow label="SYS_CORE_TEMP" value={coreTemp.toFixed(2)} unit="°C" />
          <TelemetryRow label="LINK_QOS" value={linkQos.toFixed(2)} unit="%" />
          <TelemetryRow label="ENCRYPTION" value="AES-256" unit="" />
          <TelemetryRow label="MEM_ALLOC" value={hexStream[0]} unit="" />
        </div>

        <div
          className="border-t-[0.5px] border-sky-900/50 pt-2 mt-2 h-16 overflow-hidden flex flex-col justify-end"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)' }}
        >
          {logs.map((log, i) => (
            <div key={i} className={`text-[6.5px] font-mono leading-tight whitespace-nowrap tracking-wider ${i === logs.length - 1 ? 'text-sky-200 drop-shadow-[0_0_2px_rgba(186,230,253,0.8)]' : 'text-sky-600/50'}`}>
              {'>'} {log}
            </div>
          ))}
        </div>
      </div>
    </HudPanel>
  );
}
