
interface MetricsPanelProps {
  temporalSettings: {
    branchingProbability: number;
    decoherenceRate: number;
    retrocausalStrength: number;
  };
  causalData: any;
  anomalyZones: any[];
  hardwareData: any;
}

export const MetricsPanel = ({ 
  temporalSettings, 
  causalData, 
  anomalyZones, 
  hardwareData 
}: MetricsPanelProps) => {
  return (
    <>
      {/* Temporal Metrics - Mobile Responsive */}
      <div className="backdrop-blur-md bg-gradient-to-br from-card/40 to-card/20 border border-primary/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <h3 className="text-xs sm:text-sm font-scientific text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            TEMPORAL METRICS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 text-xs font-mono">
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/20">
              <span className="text-muted-foreground">Timeline Branches</span>
              <div className="px-2 sm:px-3 py-1 bg-accent/20 border border-accent/30 rounded-full">
                <span className="text-accent font-bold">{Math.floor(temporalSettings.branchingProbability * 10)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/20">
              <span className="text-muted-foreground">Causal Loops</span>
              <div className="px-2 sm:px-3 py-1 bg-resonance-root/20 border border-resonance-root/30 rounded-full">
                <span className="text-resonance-root font-bold">{causalData?.loopCount || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/20">
              <span className="text-muted-foreground">Anomaly Zones</span>
              <div className="px-2 sm:px-3 py-1 bg-warning/20 border border-warning/30 rounded-full">
                <span className="text-warning font-bold">{anomalyZones.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/20">
              <span className="text-muted-foreground text-xs sm:text-sm">Retrocausal Energy</span>
              <div className="px-2 sm:px-3 py-1 bg-tensor-overlay/20 border border-tensor-overlay/30 rounded-full">
                <span className="text-tensor-overlay font-bold">{causalData?.retrocausalEnergy?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-background/20 sm:col-span-2 lg:col-span-1">
              <span className="text-muted-foreground">Hardware Sensors</span>
              <div className={`px-2 sm:px-3 py-1 rounded-full border ${hardwareData ? 'bg-success/20 border-success/30' : 'bg-muted/20 border-muted/30'}`}>
                <span className={`font-bold text-xs ${hardwareData ? 'text-success' : 'text-muted-foreground'}`}>
                  {hardwareData ? 'ACTIVE' : 'SIMULATED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status - Mobile Responsive */}
      <div className="backdrop-blur-md bg-gradient-to-br from-card/40 to-card/20 border border-success/20 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent"></div>
        <div className="relative z-10">
          <h3 className="text-xs sm:text-sm font-scientific text-primary mb-3 sm:mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            SYSTEM STATUS
          </h3>
          <div className="space-y-2 sm:space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-background/20 border border-success/10">
              <span className="text-muted-foreground">GPU Acceleration</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-semibold">ACTIVE</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-background/20 border border-success/10">
              <span className="text-muted-foreground">Render Pipeline</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-semibold">OPTIMAL</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-background/20 border border-warning/10">
              <span className="text-muted-foreground">Memory Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse"></div>
                <span className="text-warning font-semibold">847MB</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-background/20 border border-success/10">
              <span className="text-muted-foreground">Frame Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-semibold">60.0 FPS</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-background/20 border border-accent/10">
              <span className="text-muted-foreground">Precision Mode</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                <span className="text-accent font-semibold">DOUBLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
