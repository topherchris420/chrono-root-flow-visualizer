import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'tensor' | 'resonance';
  message: string;
  data?: any;
}

interface DataLoggerProps {
  fieldParameters: any;
  isActive: boolean;
}

export const DataLogger = ({ fieldParameters, isActive }: DataLoggerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Generate simulation logs
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const logTypes = ['info', 'tensor', 'resonance'] as const;
      const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];

      const messages = {
        info: [
          'Vector field calculations updated',
          'Spacetime manifold mesh refined',
          'Geodesic paths recalculated',
          'Frame synchronization maintained'
        ],
        tensor: [
          'Ricci tensor eigenvalues computed',
          'Torsion field divergence analyzed',
          'Curvature tensor components updated',
          'Metric deformation detected'
        ],
        resonance: [
          'Resonance roots stabilized',
          'Adaptive anchors repositioned',
          'Phase coherence maintained',
          'DRR field strength optimized'
        ]
      };

      const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type: randomType,
        message: randomMessage,
        data: {
          energyDensity: fieldParameters.energyDensity,
          timeSync: fieldParameters.timeSync
        }
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 entries
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, [isActive, fieldParameters]);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3 text-destructive" />;
      case 'tensor':
        return <Eye className="h-3 w-3 text-tensor-overlay" />;
      case 'resonance':
        return <Clock className="h-3 w-3 text-resonance-root" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      case 'tensor':
        return 'text-tensor-overlay';
      case 'resonance':
        return 'text-resonance-root';
      default:
        return 'text-foreground';
    }
  };

  const exportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      type: log.type,
      message: log.message,
      fieldParameters: log.data
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vers3vector-simulation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="w-full h-64 bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-scientific text-primary flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SIMULATION LOG
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
              {isActive ? 'ACTIVE' : 'PAUSED'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-44 px-4">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-scientific">No log entries</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {logs.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30 transition-colors">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className={`text-xs font-scientific ${getLogColor(log.type)}`}>
                        {log.message}
                      </p>
                      {log.data && (
                        <div className="mt-1 text-xs font-mono text-muted-foreground/70">
                          E: {log.data.energyDensity?.toFixed(3)} |
                          T: {log.data.timeSync?.toFixed(3)}
                        </div>
                      )}
                    </div>
                  </div>
                  {index < logs.length - 1 && <Separator className="opacity-30" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};