
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Cpu, 
  Thermometer, 
  Compass, 
  Zap, 
  Radio,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';

interface SensorData {
  magnetometer: { x: number; y: number; z: number; magnitude: number };
  gyroscope: { x: number; y: number; z: number; angular_velocity: number };
  cryogenic: { temperature: number; thermal_gradient: number };
  electromagnetic: { field_strength: number; frequency: number; phase: number };
}

interface HardwareInterfaceProps {
  onSensorData: (data: SensorData) => void;
  isActive: boolean;
}

export const HardwareInterface = ({ onSensorData, isActive }: HardwareInterfaceProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorStates, setSensorStates] = useState({
    magnetometer: false,
    gyroscope: false,
    cryogenic: false,
    electromagnetic: false
  });
  const [sensorData, setSensorData] = useState<SensorData>({
    magnetometer: { x: 0, y: 0, z: 0, magnitude: 0 },
    gyroscope: { x: 0, y: 0, z: 0, angular_velocity: 0 },
    cryogenic: { temperature: 0, thermal_gradient: 0 },
    electromagnetic: { field_strength: 0, frequency: 0, phase: 0 }
  });
  const [dataStreamRate, setDataStreamRate] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Simulate hardware connection
  const connectToHardware = useCallback(async () => {
    setConnectionAttempts(prev => prev + 1);
    
    toast.info('Attempting hardware connection...', {
      duration: 2000,
      className: 'font-scientific text-xs'
    });

    // Simulate connection process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setIsConnected(true);
        toast.success('Hardware interface established', {
          duration: 3000,
          className: 'font-scientific text-xs'
        });
      } else {
        toast.error('Hardware connection failed - using simulated data', {
          duration: 3000,
          className: 'font-scientific text-xs'
        });
        // Use simulated data instead
        setIsConnected(false);
      }
    }, 2000);
  }, []);

  // Simulate sensor data generation
  const generateSensorData = useCallback((): SensorData => {
    const time = Date.now() * 0.001;
    
    return {
      magnetometer: {
        x: Math.sin(time * 0.1) * 50 + (Math.random() - 0.5) * 10,
        y: Math.cos(time * 0.15) * 30 + (Math.random() - 0.5) * 8,
        z: Math.sin(time * 0.2) * 40 + (Math.random() - 0.5) * 12,
        magnitude: 45 + Math.sin(time * 0.05) * 15 + (Math.random() - 0.5) * 5
      },
      gyroscope: {
        x: Math.sin(time * 0.3) * 2 + (Math.random() - 0.5) * 0.5,
        y: Math.cos(time * 0.25) * 1.5 + (Math.random() - 0.5) * 0.3,
        z: Math.sin(time * 0.4) * 3 + (Math.random() - 0.5) * 0.8,
        angular_velocity: Math.sqrt(Math.pow(Math.sin(time * 0.3) * 2, 2) + 
                                   Math.pow(Math.cos(time * 0.25) * 1.5, 2) + 
                                   Math.pow(Math.sin(time * 0.4) * 3, 2))
      },
      cryogenic: {
        temperature: -271 + Math.sin(time * 0.02) * 2 + (Math.random() - 0.5) * 0.1,
        thermal_gradient: Math.abs(Math.sin(time * 0.08)) * 0.5 + (Math.random() - 0.5) * 0.05
      },
      electromagnetic: {
        field_strength: 50 + Math.sin(time * 0.1) * 20 + (Math.random() - 0.5) * 5,
        frequency: 915 + Math.sin(time * 0.05) * 50 + (Math.random() - 0.5) * 10,
        phase: (time * 0.1) % (Math.PI * 2)
      }
    };
  }, []);

  // Data streaming effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const activeSensors = Object.values(sensorStates).filter(Boolean).length;
      if (activeSensors === 0) return;

      const newData = generateSensorData();
      setSensorData(newData);
      onSensorData(newData);
      setDataStreamRate(prev => prev + 1);
    }, 100); // 10Hz data rate

    return () => clearInterval(interval);
  }, [isActive, sensorStates, generateSensorData, onSensorData]);

  // Reset data stream rate counter
  useEffect(() => {
    const resetInterval = setInterval(() => {
      setDataStreamRate(0);
    }, 1000);

    return () => clearInterval(resetInterval);
  }, []);

  const handleSensorToggle = (sensor: keyof typeof sensorStates, enabled: boolean) => {
    setSensorStates(prev => ({
      ...prev,
      [sensor]: enabled
    }));

    toast.info(`${sensor} sensor ${enabled ? 'enabled' : 'disabled'}`, {
      duration: 2000,
      className: 'font-scientific text-xs'
    });
  };

  return (
    <Card className="w-full h-full bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-scientific text-primary flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          HARDWARE INTERFACE
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs font-mono">
              {isConnected ? "CONNECTED" : "SIMULATED"}
            </Badge>
            {isConnected ? (
              <Wifi className="h-3 w-3 text-success" />
            ) : (
              <WifiOff className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={connectToHardware}
            disabled={isConnected}
            className="text-xs"
          >
            Connect
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Connection Attempts</span>
            <span className="text-foreground">{connectionAttempts}</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">Data Stream Rate</span>
            <span className="text-success">{dataStreamRate} Hz</span>
          </div>
        </div>

        {/* Sensor Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-scientific text-foreground/80">Sensor Array</h4>
          
          {/* Magnetometer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-3 w-3 text-vector-field" />
              <Label className="text-xs font-mono">Magnetometer</Label>
            </div>
            <Switch
              checked={sensorStates.magnetometer}
              onCheckedChange={(checked) => handleSensorToggle('magnetometer', checked)}
            />
          </div>

          {/* Gyroscope */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-3 w-3 text-tensor-overlay" />
              <Label className="text-xs font-mono">Gyroscope</Label>
            </div>
            <Switch
              checked={sensorStates.gyroscope}
              onCheckedChange={(checked) => handleSensorToggle('gyroscope', checked)}
            />
          </div>

          {/* Cryogenic Sensor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-3 w-3 text-resonance-root" />
              <Label className="text-xs font-mono">Cryogenic</Label>
            </div>
            <Switch
              checked={sensorStates.cryogenic}
              onCheckedChange={(checked) => handleSensorToggle('cryogenic', checked)}
            />
          </div>

          {/* EM Field Sensor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-warning" />
              <Label className="text-xs font-mono">EM Field</Label>
            </div>
            <Switch
              checked={sensorStates.electromagnetic}
              onCheckedChange={(checked) => handleSensorToggle('electromagnetic', checked)}
            />
          </div>
        </div>

        {/* Live Sensor Data */}
        <div className="space-y-2">
          <h4 className="text-xs font-scientific text-foreground/80 flex items-center gap-2">
            <Activity className="h-3 w-3" />
            Live Data Stream
          </h4>
          <ScrollArea className="h-32">
            <div className="space-y-2 text-xs font-mono">
              {sensorStates.magnetometer && (
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-vector-field mb-1">Magnetometer (μT)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <span>X: {sensorData.magnetometer.x.toFixed(2)}</span>
                    <span>Y: {sensorData.magnetometer.y.toFixed(2)}</span>
                    <span>Z: {sensorData.magnetometer.z.toFixed(2)}</span>
                    <span>|B|: {sensorData.magnetometer.magnitude.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {sensorStates.gyroscope && (
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-tensor-overlay mb-1">Gyroscope (rad/s)</div>
                  <div className="grid grid-cols-2 gap-2">
                    <span>ωX: {sensorData.gyroscope.x.toFixed(3)}</span>
                    <span>ωY: {sensorData.gyroscope.y.toFixed(3)}</span>
                    <span>ωZ: {sensorData.gyroscope.z.toFixed(3)}</span>
                    <span>|ω|: {sensorData.gyroscope.angular_velocity.toFixed(3)}</span>
                  </div>
                </div>
              )}

              {sensorStates.cryogenic && (
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-resonance-root mb-1">Cryogenic (K)</div>
                  <div className="grid grid-cols-1 gap-1">
                    <span>T: {sensorData.cryogenic.temperature.toFixed(3)}</span>
                    <span>∇T: {sensorData.cryogenic.thermal_gradient.toFixed(4)}</span>
                  </div>
                </div>
              )}

              {sensorStates.electromagnetic && (
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-warning mb-1">EM Field</div>
                  <div className="grid grid-cols-1 gap-1">
                    <span>E: {sensorData.electromagnetic.field_strength.toFixed(2)} V/m</span>
                    <span>f: {sensorData.electromagnetic.frequency.toFixed(1)} MHz</span>
                    <span>φ: {sensorData.electromagnetic.phase.toFixed(3)} rad</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
