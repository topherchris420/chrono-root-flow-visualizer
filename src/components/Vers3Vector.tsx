
import { useState, useCallback } from 'react';
import { SimulationEngine } from './SimulationEngine';
import { ParameterPanel } from './ParameterPanel';
import { DataLogger } from './DataLogger';
import { HeaderSection } from './HeaderSection';
import { FooterSection } from './FooterSection';
import { MetricsPanel } from './MetricsPanel';
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
        version: '4.2.1',
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

  const handleHardwareData = useCallback((data: any) => {
    setHardwareData(data);
    
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
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background font-scientific relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-warning/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <HeaderSection encryptedMode={encryptedMode} />

      {/* Main Interface with Glass Morphism */}
      <div className="container mx-auto p-4 h-[calc(100vh-80px)] relative z-10">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Left Panel - Enhanced with Glass Effect */}
          <div className="col-span-3 space-y-6">
            <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-1 shadow-2xl">
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
            </div>
            
            <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-6 shadow-2xl">
              <HardwareInterface
                onSensorData={handleHardwareData}
                isActive={true}
              />
            </div>
          </div>

          {/* Central Simulation Engine - Immersive Design */}
          <div className="col-span-6 relative">
            <div className="backdrop-blur-xl bg-card/20 border border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(0,204,255,0.2)] overflow-hidden h-full">
              {/* Holographic Frame Effect */}
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
                      onCausalDataUpdate={handleCausalDataUpdate}
                    />
                  </>
                )}
              />
              
              {/* Corner Accent Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/60 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/60 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/60 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/60 rounded-br-lg"></div>
            </div>
          </div>

          {/* Right Panel - Analytics Dashboard */}
          <div className="col-span-3 space-y-6">
            <div className="backdrop-blur-md bg-card/30 border border-border/20 rounded-2xl p-6 shadow-2xl">
              <DataLogger
                fieldParameters={fieldParameters}
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
      </div>

      <FooterSection />
      
      {/* Floating Status Indicator */}
      <div className="fixed bottom-6 right-6 backdrop-blur-md bg-success/20 border border-success/30 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-scientific">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-success">QUANTUM COHERENT</span>
        </div>
      </div>
    </div>
  );
};
