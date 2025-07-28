import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Trash2, 
  Rss,
  Satellite,
} from 'lucide-react';
import { useState } from 'react';

interface DataLoggerProps {
  link16Data: any[];
  gccsData: any[];
  isActive: boolean;
}

export const DataLogger = ({ link16Data, gccsData, isActive }: DataLoggerProps) => {
  const exportLogs = () => {
    const logData = [...link16Data, ...gccsData].map(log => ({
      timestamp: new Date(log.timestamp).toISOString(),
      type: log.type,
      message: log.report || `Track ${log.id}`,
      data: log
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `q-cape-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    // This would need to be passed up to the parent to clear the state
    console.log("Clearing logs...");
  };

  const allData = [...link16Data, ...gccsData].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="w-full h-64 bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-scientific text-primary flex items-center gap-2">
            <Rss className="h-4 w-4" />
            DATA FEEDS
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
              {isActive ? 'LIVE' : 'OFFLINE'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportLogs}
              disabled={allData.length === 0}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLogs}
              disabled={allData.length === 0}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-44 px-4">
          {allData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Satellite className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-scientific">Awaiting data feeds...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {allData.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/30 transition-colors">
                    {log.type === 'track' ? <Satellite className="h-3 w-3 text-blue-400" /> : <FileText className="h-3 w-3 text-orange-400" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant={log.type === 'track' ? 'default' : 'destructive'} className="text-xs">
                          {log.type === 'track' ? "LINK 16" : "GCCS"}
                        </Badge>
                      </div>
                      <p className="text-xs font-scientific">
                        {log.type === 'track' ? `ID: ${log.id.slice(-6)} | ALT: ${log.altitude.toFixed(0)}m | SPD: ${log.speed.toFixed(0)}kph` : log.report}
                      </p>
                    </div>
                  </div>
                  {index < allData.length - 1 && <Separator className="opacity-30" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};