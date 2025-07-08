
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings, BarChart3 } from 'lucide-react';
import { ParameterPanel } from './ParameterPanel';
import { DataLogger } from './DataLogger';
import { OntologicalCore } from './OntologicalCore';
import { MetricsPanel } from './MetricsPanel';
import { HardwareInterface } from './HardwareInterface';

interface MobileNavigationProps {
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
  encryptedMode: boolean;
  temporalSettings: {
    branchingProbability: number;
    decoherenceRate: number;
    retrocausalStrength: number;
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
}

export const MobileNavigation = ({
  fieldParameters,
  tensorOverlays,
  drrSettings,
  encryptedMode,
  temporalSettings,
  causalData,
  anomalyZones,
  hardwareData,
  temporalEvents,
  onParameterChange,
  onToggleChange,
  onExport,
  onToggleEncryption,
  onHardwareData
}: MobileNavigationProps) => {
  return (
    <div className="lg:hidden fixed top-20 left-4 right-4 z-50 flex gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" variant="outline" className="backdrop-blur-md bg-card/80 border-primary/20">
            <Settings className="w-4 h-4 mr-2" />
            Controls
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-card/95 backdrop-blur-xl border-primary/20">
          <div className="space-y-6 mt-6">
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
            <HardwareInterface
              onSensorData={onHardwareData}
              isActive={true}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" variant="outline" className="backdrop-blur-md bg-card/80 border-primary/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-card/95 backdrop-blur-xl border-primary/20">
          <div className="space-y-6 mt-6">
            <DataLogger
              fieldParameters={fieldParameters}
              isActive={true}
            />
            <OntologicalCore
              fieldData={fieldParameters}
              temporalEvents={temporalEvents}
              isActive={true}
            />
            <MetricsPanel
              temporalSettings={temporalSettings}
              causalData={causalData}
              anomalyZones={anomalyZones}
              hardwareData={hardwareData}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
