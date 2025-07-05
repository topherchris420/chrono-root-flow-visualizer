import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  RotateCcw, 
  Clock, 
  Cpu, 
  Download,
  Lock,
  Unlock
} from 'lucide-react';

interface ParameterPanelProps {
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
  onParameterChange: (param: string, value: number) => void;
  onToggleChange: (param: string, checked: boolean) => void;
  onExport: () => void;
  onToggleEncryption: () => void;
}

export const ParameterPanel = ({
  fieldParameters,
  tensorOverlays,
  drrSettings,
  encryptedMode,
  onParameterChange,
  onToggleChange,
  onExport,
  onToggleEncryption
}: ParameterPanelProps) => {
  return (
    <Card className="w-80 h-full bg-card/95 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-scientific text-primary flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            VERS3VECTOR CONTROL
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleEncryption}
            className="h-8 w-8 p-0"
          >
            {encryptedMode ? (
              <Lock className="h-3 w-3 text-warning" />
            ) : (
              <Unlock className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-mono">
            CLASSIFIED
          </Badge>
          <Badge variant="outline" className="text-xs font-mono">
            v3.7.2
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="physics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="physics" className="text-xs">Physics</TabsTrigger>
            <TabsTrigger value="tensor" className="text-xs">Tensor</TabsTrigger>
            <TabsTrigger value="drr" className="text-xs">DRR</TabsTrigger>
          </TabsList>

          <TabsContent value="physics" className="space-y-4 mt-4">
            {/* Energy Density Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-scientific text-foreground/80 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Energy Density
                </Label>
                <Badge variant="outline" className="text-xs font-mono">
                  {fieldParameters.energyDensity.toFixed(3)}
                </Badge>
              </div>
              <Slider
                value={[fieldParameters.energyDensity]}
                onValueChange={(value) => onParameterChange('energyDensity', value[0])}
                max={2.0}
                min={0.0}
                step={0.001}
                className="precision-slider"
              />
            </div>

            {/* Spin Distribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-scientific text-foreground/80 flex items-center gap-1">
                  <RotateCcw className="h-3 w-3" />
                  Spin Distribution
                </Label>
                <Badge variant="outline" className="text-xs font-mono">
                  {fieldParameters.spinDistribution.toFixed(3)}
                </Badge>
              </div>
              <Slider
                value={[fieldParameters.spinDistribution]}
                onValueChange={(value) => onParameterChange('spinDistribution', value[0])}
                max={1.5}
                min={-1.5}
                step={0.001}
                className="precision-slider"
              />
            </div>

            {/* EM Field Torsion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-scientific text-foreground/80 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  EM Field Torsion
                </Label>
                <Badge variant="outline" className="text-xs font-mono">
                  {fieldParameters.emFieldTorsion.toFixed(3)}
                </Badge>
              </div>
              <Slider
                value={[fieldParameters.emFieldTorsion]}
                onValueChange={(value) => onParameterChange('emFieldTorsion', value[0])}
                max={2.0}
                min={0.0}
                step={0.001}
                className="precision-slider"
              />
            </div>

            {/* Time Synchronization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-scientific text-foreground/80 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time Sync
                </Label>
                <Badge variant="outline" className="text-xs font-mono">
                  {fieldParameters.timeSync.toFixed(3)}
                </Badge>
              </div>
              <Slider
                value={[fieldParameters.timeSync]}
                onValueChange={(value) => onParameterChange('timeSync', value[0])}
                max={10.0}
                min={0.0}
                step={0.01}
                className="precision-slider"
              />
            </div>
          </TabsContent>

          <TabsContent value="tensor" className="space-y-4 mt-4">
            {/* Tensor Overlays */}
            <div className="space-y-3">
              <Label className="text-xs font-scientific text-foreground/80">
                Tensor Field Overlays
              </Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-curvature-tensor">
                    Ricci Curvature
                  </Label>
                  <Switch
                    checked={tensorOverlays.ricci}
                    onCheckedChange={(checked) => onToggleChange('tensor.ricci', checked)}
                    className="tensor-glow"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-tensor-overlay">
                    Torsion Tensor
                  </Label>
                  <Switch
                    checked={tensorOverlays.torsion}
                    onCheckedChange={(checked) => onToggleChange('tensor.torsion', checked)}
                    className="tensor-glow"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-torsion-field">
                    Vector Divergence
                  </Label>
                  <Switch
                    checked={tensorOverlays.divergence}
                    onCheckedChange={(checked) => onToggleChange('tensor.divergence', checked)}
                    className="tensor-glow"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drr" className="space-y-4 mt-4">
            {/* Dynamic Resonance Rooting */}
            <div className="space-y-3">
              <Label className="text-xs font-scientific text-foreground/80">
                Dynamic Resonance Rooting
              </Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-resonance-root">
                    Resonance Roots
                  </Label>
                  <Switch
                    checked={drrSettings.resonanceRoots}
                    onCheckedChange={(checked) => onToggleChange('drr.resonanceRoots', checked)}
                    className="resonance-glow"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-warning">
                    Adaptive Anchors
                  </Label>
                  <Switch
                    checked={drrSettings.adaptiveAnchors}
                    onCheckedChange={(checked) => onToggleChange('drr.adaptiveAnchors', checked)}
                    className="resonance-glow"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono text-accent">
                    Phase Tracking
                  </Label>
                  <Switch
                    checked={drrSettings.phaseTracking}
                    onCheckedChange={(checked) => onToggleChange('drr.phaseTracking', checked)}
                    className="resonance-glow"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Controls */}
        <div className="pt-4 border-t border-border/50">
          <Button
            onClick={onExport}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-scientific text-xs"
            size="sm"
          >
            <Download className="h-3 w-3 mr-2" />
            Export Simulation Data
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="text-center">
            <div className="text-xs font-mono text-muted-foreground">GPU</div>
            <Badge variant="secondary" className="text-xs">
              ACTIVE
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-xs font-mono text-muted-foreground">FPS</div>
            <Badge variant="secondary" className="text-xs">
              60.0
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};