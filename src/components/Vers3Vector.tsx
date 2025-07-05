import { useState, useCallback } from 'react';
import { SimulationEngine } from './SimulationEngine';
import { ParameterPanel } from './ParameterPanel';
import { DataLogger } from './DataLogger';
import { toast } from 'sonner';
import { TemporalLattice } from './TemporalLattice';
import { OntologicalCore } from './OntologicalCore';
import { CausalEngine } from './CausalEngine';
import { HardwareInterface } from './HardwareInterface';

export const Vers3Vector = () => {
  const [fieldParameters, setFieldParameters] = useState({
    energyDensity: 0.5,
    spinDistribution: 0.0,
    emFieldTorsion: 0.3,
    timeSync: 1.0
  });

  const [tensorOverlays, setTensorOverlays] = useState({
    ricci: true,
    torsion: false,
    divergence: false
  });

  const [drrSettings, setDrrSettings] = useState({
    resonanceRoots: true,
    adaptiveAnchors: false,
    phaseTracking: false
  });

  const [encryptedMode, setEncryptedMode] = useState(false);

  const [temporalSettings, setTemporalSettings] = useState({
    branchingProbability: 0.1,
    decoherenceRate: 0.05,
    retrocausalStrength: 0.3
  });

  const [causalSettings, setCausalSettings] = useState({
    retrocausalStrength: 0.4,
    loopStability: 0.6,
    anomalyDensity: 0.2
  });

  const [hardwareData, setHardwareData] = useState<any>(null);
  const [temporalEvents, setTemporalEvents] = useState<any[]>([]);
  const [causalData, setCausalData] = useState<any>(null);
  const [anomalyZones, setAnomalyZones] = useState<any[]>([
    { x: 5, y: 0, z: 2 },
    { x: -3, y: 4, z: -1 },
    { x: 0, y: -6, z: 3 }
  ]);

  const handleParameterChange = useCallback((param: string, value: number) => {
    setFieldParameters(prev => ({
      ...prev,
      [param]: value
    }));
    
    toast.info(`Parameter updated: ${param} = ${value.toFixed(3)}`, {
      duration: 2000,
      className: 'font-scientific text-xs'
    });
  }, []);

  const handleToggleChange = useCallback((param: string, checked: boolean) => {
    const [category, setting] = param.split('.');
    
    if (category === 'tensor') {
      setTensorOverlays(prev => ({
        ...prev,
        [setting]: checked
      }));
    } else if (category === 'drr') {
      setDrrSettings(prev => ({
        ...prev,
        [setting]: checked
      }));
    }

    toast.info(`${param} ${checked ? 'enabled' : 'disabled'}`, {
      duration: 2000,
      className: 'font-scientific text-xs'
    });
  }, []);

  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      fieldParameters,
      tensorOverlays,
      drrSettings,
      metadata: {
        version: '3.7.2',
        framework: 'Riemann-Cartan',
        classification: 'DARPA-CLASSIFIED'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vers3vector-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Simulation data exported successfully', {
      duration: 3000,
      className: 'font-scientific text-xs'
    });
  }, [fieldParameters, tensorOverlays, drrSettings]);

  const handleToggleEncryption = useCallback(() => {
    setEncryptedMode(prev => !prev);
    toast.warning(
      encryptedMode ? 'Encryption disabled' : 'Encryption enabled - DARPA protocols active',
      {
        duration: 3000,
        className: 'font-scientific text-xs'
      }
    );
  }, [encryptedMode]);

  const handleTemporalParameterChange = useCallback((param: string, value: number) => {
    setTemporalSettings(prev => ({
      ...prev,
      [param]: value
    }));
    
    toast.info(`Temporal parameter updated: ${param} = ${value.toFixed(3)}`, {
      duration: 2000,
      className: 'font-scientific text-xs'
    });
  }, []);

  const handleHardwareData = useCallback((data: any) => {
    setHardwareData(data);
    
    // Inject hardware data into field parameters
    if (data.magnetometer) {
      const magneticInfluence = data.magnetometer.magnitude * 0.01;
      setFieldParameters(prev => ({
        ...prev,
        emFieldTorsion: Math.min(2.0, Math.max(0.0, prev.emFieldTorsion + magneticInfluence))
      }));
    }
  }, []);

  const handleCausalDataUpdate = useCallback((data: any) => {
    setCausalData(data);
    
    // Generate temporal events from causal data
    if (data.anomalyCount > 0) {
      const newEvent = {
        id: `event-${Date.now()}`,
        type: 'causal_anomaly',
        magnitude: data.averageStrength,
        timestamp: Date.now()
      };
      setTemporalEvents(prev => [...prev, newEvent].slice(-20));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-scientific">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">VERS3VECTOR</h1>
              <div className="text-xs text-muted-foreground font-mono">
                Temporal Lattice | Causal Engine | Ontological Core | v4.2.1
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-success">SYSTEM ACTIVE</span>
              </div>
              {encryptedMode && (
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-warning">CLASSIFIED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Parameter Control Panel */}
          <div className="col-span-3 space-y-4">
            <ParameterPanel
              fieldParameters={fieldParameters}
              tensorOverlays={tensorOverlays}
              drrSettings={drrSettings}
              encryptedMode={encryptedMode}
              onParameterChange={handleParameterChange}
              onToggleChange={handleToggleChange}
              onExport={handleExport}
              onToggleEncryption={handleToggleEncryption}
            />
            
            {/* Hardware Interface */}
            <HardwareInterface
              onSensorData={handleHardwareData}
              isActive={true}
            />
          </div>

          {/* Main Simulation Engine */}
          <div className="col-span-6">
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
                    onCausalDataUpdate={handleCausalDataUpdate}
                  />
                </>
              )}
            />
          </div>

          {/* Right Panel - Extended Analytics */}
          <div className="col-span-3 space-y-4">
            <DataLogger
              fieldParameters={fieldParameters}
              isActive={true}
            />

            {/* Ontological Core */}
            <OntologicalCore
              fieldData={fieldParameters}
              temporalEvents={temporalEvents}
              isActive={true}
            />

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
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <div>
              © 2024 Advanced Theoretical Physics Research Division
            </div>
            <div className="flex items-center gap-4">
              <span>Riemann-Cartan Framework</span>
              <span>|</span>
              <span>Dynamic Resonance Rooting</span>
              <span>|</span>
              <span>Classified Research Tool</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
