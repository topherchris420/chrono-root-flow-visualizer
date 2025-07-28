
import { ParameterPanel } from './ParameterPanel';
import { HardwareInterface } from './HardwareInterface';
import { DataLogger } from './DataLogger';
import { OntologicalCore } from './OntologicalCore';
import { MetricsPanel } from './MetricsPanel';
import { SimulationContainer } from './SimulationContainer';

interface DesktopLayoutProps {
  fieldParameters: {
    energyDensity: number;
    spinDistribution: number;
    emFieldTorsion: number;
    timeSync: number;
  };
  tensorOverlays: {
    ricci: boolean;
    torsion: boolean;
    divergence: boolean;
  };
  drrSettings: {
    resonanceRoots: boolean;
    adaptiveAnchors: boolean;
    phaseTracking: boolean;
  };
  ewSigint: {
    visible: boolean;
  };
  quantumSensor: {
    visible: boolean;
  };
  hypersonicThreat: {
    visible: boolean;
  };
  link16Data: any[];
  gccsData: any[];
  encryptedMode: boolean;
  temporalSettings: {
    branchingProbability: number;
    decoherenceRate: number;
    retrocausalStrength: number;
  };
  causalSettings: {
    retrocausalStrength: number;
    loopStability: number;
    anomalyDensity: number;
  };
  causalData: any;
  anomalyZones: any[];
  hardwareData: any;
  temporalEvents: any[];
  onParameterChange: (param: string, value: number) => void;
  onToggleChange: (param: string, checked: boolean) => void;
  onExport: () => void;
  onToggleEncryption: () => void;
  onHardwareData: (data: any) => void;
  onCausalDataUpdate: (data: any) => void;
}

export const DesktopLayout = ({
  fieldParameters,
  tensorOverlays,
  drrSettings,
  ewSigint,
  quantumSensor,
  hypersonicThreat,
  link16Data,
  gccsData,
  encryptedMode,
  temporalSettings,
  causalSettings,
  causalData,
  anomalyZones,
  hardwareData,
  temporalEvents,
  onParameterChange,
  onToggleChange,
  onExport,
  onToggleEncryption,
  onHardwareData,
  onCausalDataUpdate
}: DesktopLayoutProps) => {
  return (
    <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      {/* Left Panel */}
      <div className="col-span-3 space-y-6">
        <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-1 shadow-2xl">
          <ParameterPanel
            fieldParameters={fieldParameters}
            tensorOverlays={tensorOverlays}
            drrSettings={drrSettings}
            encryptedMode={encryptedMode}
            onParameterChange={onParameterChange}
            onToggleChange={onToggleChange}
            onExport={onExport}
            onToggleEncryption={onToggleEncryption}
          />
        </div>
        
        <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-6 shadow-2xl">
          <HardwareInterface
            onSensorData={onHardwareData}
            isActive={true}
          />
        </div>
      </div>

      {/* Central Simulation Engine */}
      <div className="col-span-6 relative">
        <SimulationContainer
          fieldParameters={fieldParameters}
          tensorOverlays={tensorOverlays}
          drrSettings={drrSettings}
          ewSigint={ewSigint}
          quantumSensor={quantumSensor}
          hypersonicThreat={hypersonicThreat}
          temporalSettings={temporalSettings}
          causalSettings={causalSettings}
          anomalyZones={anomalyZones}
          onCausalDataUpdate={onCausalDataUpdate}
        />
      </div>

      {/* Right Panel */}
      <div className="col-span-3 space-y-6">
        <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-6 shadow-2xl">
          <DataLogger
            fieldParameters={fieldParameters}
            link16Data={link16Data}
            gccsData={gccsData}
            isActive={true}
          />
        </div>

        <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-6 shadow-2xl">
          <OntologicalCore
            fieldData={fieldParameters}
            temporalEvents={temporalEvents}
            isActive={true}
          />
        </div>

        <div className="space-y-4">
          <MetricsPanel
            temporalSettings={temporalSettings}
            causalData={causalData}
            anomalyZones={anomalyZones}
            hardwareData={hardwareData}
          />
        </div>
      </div>
    </div>
  );
};
