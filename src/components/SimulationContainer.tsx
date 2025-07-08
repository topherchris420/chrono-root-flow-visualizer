
import { SimulationEngine } from './SimulationEngine';
import { TemporalLattice } from './TemporalLattice';
import { CausalEngine } from './CausalEngine';

interface SimulationContainerProps {
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
  anomalyZones: any[];
  onCausalDataUpdate: (data: any) => void;
  isMobile?: boolean;
}

export const SimulationContainer = ({
  fieldParameters,
  tensorOverlays,
  drrSettings,
  temporalSettings,
  causalSettings,
  anomalyZones,
  onCausalDataUpdate,
  isMobile = false
}: SimulationContainerProps) => {
  const containerClasses = isMobile
    ? "backdrop-blur-xl bg-card/20 border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(0,204,255,0.2)] overflow-hidden h-[60vh] relative"
    : "backdrop-blur-xl bg-card/20 border border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(0,204,255,0.2)] overflow-hidden h-full";

  const cornerSize = isMobile ? "w-6 h-6" : "w-8 h-8";
  const cornerSpacing = isMobile ? "2" : "4";

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      <div className="absolute inset-[1px] rounded-3xl border border-primary/20 pointer-events-none"></div>
      
      <SimulationEngine
        fieldParameters={fieldParameters}
        tensorOverlays={tensorOverlays}
        drrSettings={drrSettings}
        renderExtensions={(
          <>
            <TemporalLattice
              fieldParameters={fieldParameters}
              causalParameters={temporalSettings}
              anomalyZones={anomalyZones}
            />
            <CausalEngine
              fieldParameters={fieldParameters}
              causalSettings={causalSettings}
              onCausalDataUpdate={onCausalDataUpdate}
            />
          </>
        )}
      />
      
      {/* Corner Accent Elements */}
      <div className={`absolute top-${cornerSpacing} left-${cornerSpacing} ${cornerSize} border-l-2 border-t-2 border-primary/60 rounded-tl-lg`}></div>
      <div className={`absolute top-${cornerSpacing} right-${cornerSpacing} ${cornerSize} border-r-2 border-t-2 border-primary/60 rounded-tr-lg`}></div>
      <div className={`absolute bottom-${cornerSpacing} left-${cornerSpacing} ${cornerSize} border-l-2 border-b-2 border-primary/60 rounded-bl-lg`}></div>
      <div className={`absolute bottom-${cornerSpacing} right-${cornerSpacing} ${cornerSize} border-r-2 border-b-2 border-primary/60 rounded-br-lg`}></div>
    </div>
  );
};
