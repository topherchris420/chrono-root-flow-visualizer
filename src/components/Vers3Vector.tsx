import { useState, useCallback } from 'react';
import { SimulationEngine } from './SimulationEngine';
import { ParameterPanel } from './ParameterPanel';
import { DataLogger } from './DataLogger';
import { toast } from 'sonner';

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

  return (
    <div className="min-h-screen bg-background font-scientific">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">VERS3VECTOR</h1>
              <div className="text-xs text-muted-foreground font-mono">
                Chrono-Spatial Displacement Analysis | v3.7.2
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
          <div className="col-span-3">
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

          {/* Main Simulation Engine */}
          <div className="col-span-6">
            <SimulationEngine
              fieldParameters={fieldParameters}
              tensorOverlays={tensorOverlays}
              drrSettings={drrSettings}
            />
          </div>

          {/* Right Panel - Data Logger and Additional Controls */}
          <div className="col-span-3 space-y-4">
            <DataLogger
              fieldParameters={fieldParameters}
              isActive={true}
            />

            {/* Quick Stats Panel */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
              <h3 className="text-sm font-scientific text-primary mb-3">FIELD METRICS</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-vector-field">VECTORS</div>
                  <div className="text-lg font-bold text-foreground">
                    {Math.floor(512 * fieldParameters.energyDensity)}
                  </div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-tensor-overlay">TENSORS</div>
                  <div className="text-lg font-bold text-foreground">
                    {Object.values(tensorOverlays).filter(Boolean).length}
                  </div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-resonance-root">ROOTS</div>
                  <div className="text-lg font-bold text-foreground">
                    {drrSettings.resonanceRoots ? Math.floor(4 + fieldParameters.energyDensity * 8) : 0}
                  </div>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-accent">SYNC</div>
                  <div className="text-lg font-bold text-foreground">
                    {(fieldParameters.timeSync * 60).toFixed(0)}Hz
                  </div>
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