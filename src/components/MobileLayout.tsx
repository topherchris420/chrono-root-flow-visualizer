
import { SimulationContainer } from './SimulationContainer';
import { MetricsPanel } from './MetricsPanel';

interface MobileLayoutProps {
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
  onCausalDataUpdate: (data: any) => void;
}

export const MobileLayout = ({
  fieldParameters,
  tensorOverlays,
  drrSettings,
  temporalSettings,
  causalSettings,
  causalData,
  anomalyZones,
  hardwareData,
  onCausalDataUpdate
}: MobileLayoutProps) => {
  return (
    <div className="lg:hidden space-y-4 pt-16">
      {/* Mobile Simulation Engine */}
      <SimulationContainer
        fieldParameters={fieldParameters}
        tensorOverlays={tensorOverlays}
        drrSettings={drrSettings}
        temporalSettings={temporalSettings}
        causalSettings={causalSettings}
        anomalyZones={anomalyZones}
        onCausalDataUpdate={onCausalDataUpdate}
        isMobile={true}
      />

      {/* Mobile Quick Metrics */}
      <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-4 shadow-2xl">
        <MetricsPanel
          temporalSettings={temporalSettings}
          causalData={causalData}
          anomalyZones={anomalyZones}
          hardwareData={hardwareData}
        />
      </div>
    </div>
  );
};
