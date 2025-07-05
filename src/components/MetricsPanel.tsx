
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
      {/* Advanced Metrics Panel */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <h3 className="text-sm font-scientific text-primary mb-3">TEMPORAL METRICS</h3>
        <div className="grid grid-cols-1 gap-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timeline Branches</span>
            <span className="text-accent">{Math.floor(temporalSettings.branchingProbability * 10)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Causal Loops</span>
            <span className="text-resonance-root">{causalData?.loopCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Anomaly Zones</span>
            <span className="text-warning">{anomalyZones.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Retrocausal Energy</span>
            <span className="text-tensor-overlay">{causalData?.retrocausalEnergy?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hardware Sensors</span>
            <span className="text-vector-field">{hardwareData ? 'ACTIVE' : 'SIMULATED'}</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <h3 className="text-sm font-scientific text-primary mb-3">SYSTEM STATUS</h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">GPU Acceleration</span>
            <span className="text-success">ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Render Pipeline</span>
            <span className="text-success">OPTIMAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Memory Usage</span>
            <span className="text-warning">847MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frame Rate</span>
            <span className="text-success">60.0 FPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Precision Mode</span>
            <span className="text-accent">DOUBLE</span>
          </div>
        </div>
      </div>
    </>
  );
};
