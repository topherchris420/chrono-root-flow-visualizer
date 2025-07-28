
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Zap, GitBranch, Target } from 'lucide-react';

interface SemanticEvent {
  id: string;
  timestamp: number;
  type: 'root_shift' | 'vector_bifurcation' | 'torsion_singularity' | 'phase_collapse';
  magnitude: number;
  interpretation: string;
  coa: string;
  metaphysicalWeight: number;
  causalChain: string[];
}

interface SemioticMap {
  conceptualNodes: Map<string, number>;
  relationshipStrength: Map<string, number>;
  ontologicalDepth: number;
}

interface OntologicalCoreProps {
  fieldData: {
    energyDensity: number;
    spinDistribution: number;
    timeSync: number;
  };
  temporalEvents: any[];
  isActive: boolean;
}

export const OntologicalCore = ({ fieldData, temporalEvents, isActive }: OntologicalCoreProps) => {
  const [semanticEvents, setSemanticEvents] = useState<SemanticEvent[]>([]);
  const [semioticMap, setSemioticMap] = useState<SemioticMap>({
    conceptualNodes: new Map(),
    relationshipStrength: new Map(),
    ontologicalDepth: 0
  });
  const [interpretationEngine, setInterpretationEngine] = useState({
    vocabularySize: 847,
    conceptualDepth: 3.7,
    symbolicResolution: 0.923
  });

  // Ontological interpretation engine
  const generateThreatAssessment = useCallback((eventType: string, magnitude: number): { interpretation: string, coa: string } => {
    const threats = {
      root_shift: [
        "Hostile EW activity detected",
        "Enemy SIGINT interception suspected",
        "GPS spoofing attack in progress",
        "Communications jamming detected"
      ],
      vector_bifurcation: [
        "Multiple incoming high-speed threats",
        "Hypersonic missile launch detected",
        "Unidentified aerial vehicle swarm",
        "Ballistic missile trajectory detected"
      ],
      torsion_singularity: [
        "High-energy laser weapon firing",
        "Directed energy weapon attack",
        "EMP detonation detected",
        "Exotic weapon signature identified"
      ],
      phase_collapse: [
        "Enemy stealth asset uncloaking",
        "Quantum sensor network compromised",
        "Enemy C2 node identified",
        "High-value target acquisition"
      ]
    };

    const coas = {
      root_shift: [
        "Deploy electronic countermeasures",
        "Switch to frequency-hopping comms",
        "Verify GPS integrity with INS",
        "Triangulate jamming source"
      ],
      vector_bifurcation: [
        "Engage with layered air defense",
        "Launch interceptor missiles",
        "Deploy decoy countermeasures",
        "Alert civilian defense authorities"
      ],
      torsion_singularity: [
        "Activate defensive shields",
        "Maneuver to evade attack vector",
        "Target energy source for counter-attack",
        "Disperse assets to minimize damage"
      ],
      phase_collapse: [
        "Engage target with kinetic weapons",
        "Isolate compromised network segment",
        "Deploy ISR assets to monitor target",
        "Prepare for immediate action"
      ]
    };

    const baseThreats = threats[eventType as keyof typeof threats] || ["Unknown threat"];
    const selectedThreat = baseThreats[Math.floor(Math.random() * baseThreats.length)];
    
    const baseCoas = coas[eventType as keyof typeof coas] || ["No action recommended"];
    const selectedCoa = baseCoas[Math.floor(Math.random() * baseCoas.length)];

    const magnitudeQualifier = magnitude > 0.8 ? "CRITICAL" : magnitude > 0.5 ? "HIGH" : "MODERATE";
    
    return {
      interpretation: `${magnitudeQualifier} THREAT: ${selectedThreat}`,
      coa: `RECOMMENDED COA: ${selectedCoa}`
    };
  }, []);

  // Calculate metaphysical weight based on field parameters
  const calculateMetaphysicalWeight = useCallback((eventType: string, magnitude: number): number => {
    const baseWeights = {
      root_shift: 0.7,
      vector_bifurcation: 0.9,
      torsion_singularity: 1.0,
      phase_collapse: 0.6
    };

    const baseWeight = baseWeights[eventType as keyof typeof baseWeights] || 0.5;
    const fieldInfluence = (fieldData.energyDensity + fieldData.spinDistribution) * 0.5;
    const temporalFactor = Math.abs(Math.sin(fieldData.timeSync * 0.1));
    
    return Math.min(1.0, baseWeight * magnitude * (1 + fieldInfluence) * (1 + temporalFactor));
  }, [fieldData]);

  // Generate semantic events from temporal data
  useEffect(() => {
    if (!isActive || temporalEvents.length === 0) return;

    const newEvents: SemanticEvent[] = [];
    
    // Simulate semantic event generation based on field changes
    if (Math.random() < 0.1) {
      const eventTypes = ['root_shift', 'vector_bifurcation', 'torsion_singularity', 'phase_collapse'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const magnitude = Math.random();
      const { interpretation, coa } = generateThreatAssessment(eventType, magnitude);
      
      const event: SemanticEvent = {
        id: `sem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        type: eventType as SemanticEvent['type'],
        magnitude: magnitude,
        interpretation: interpretation,
        coa: coa,
        metaphysicalWeight: calculateMetaphysicalWeight(eventType, magnitude),
        causalChain: [
          `Field Energy: ${fieldData.energyDensity.toFixed(3)}`,
          `Spin Dist: ${fieldData.spinDistribution.toFixed(3)}`,
          `Time Sync: ${fieldData.timeSync.toFixed(3)}`
        ]
      };
      
      newEvents.push(event);
    }

    if (newEvents.length > 0) {
      setSemanticEvents(prev => [...prev, ...newEvents].slice(-50));
    }
  }, [temporalEvents, fieldData, isActive, generateThreatAssessment, calculateMetaphysicalWeight]);

  // Update semiotic map based on semantic events
  useEffect(() => {
    if (semanticEvents.length === 0) return;

    const newConceptualNodes = new Map(semioticMap.conceptualNodes);
    const newRelationshipStrength = new Map(semioticMap.relationshipStrength);
    
    semanticEvents.slice(-10).forEach(event => {
      // Update conceptual node strength
      const currentStrength = newConceptualNodes.get(event.type) || 0;
      newConceptualNodes.set(event.type, currentStrength + event.metaphysicalWeight);
      
      // Update relationship strengths between concepts
      const relationshipKey = `${event.type}-temporal`;
      const currentRelationship = newRelationshipStrength.get(relationshipKey) || 0;
      newRelationshipStrength.set(relationshipKey, currentRelationship + event.magnitude);
    });

    // Calculate ontological depth
    const totalWeight = Array.from(newConceptualNodes.values()).reduce((sum, weight) => sum + weight, 0);
    const conceptualDiversity = newConceptualNodes.size;
    const ontologicalDepth = totalWeight / Math.max(1, conceptualDiversity);

    setSemioticMap({
      conceptualNodes: newConceptualNodes,
      relationshipStrength: newRelationshipStrength,
      ontologicalDepth: ontologicalDepth
    });

    // Update interpretation engine metrics
    setInterpretationEngine(prev => ({
      vocabularySize: prev.vocabularySize + Math.floor(Math.random() * 3),
      conceptualDepth: Math.min(10, prev.conceptualDepth + ontologicalDepth * 0.1),
      symbolicResolution: Math.min(1, prev.symbolicResolution + 0.001)
    }));
  }, [semanticEvents, semioticMap.conceptualNodes, semioticMap.relationshipStrength]);

  return (
    <Card className="w-full h-full bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-scientific text-primary flex items-center gap-2">
          <Brain className="h-4 w-4" />
          ONTOLOGICAL CORE
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-xs font-mono">
            {isActive ? "ACTIVE" : "STANDBY"}
          </Badge>
          <Badge variant="outline" className="text-xs font-mono">
            SEMIOTIC v2.3
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interpretation Engine Status */}
        <div className="space-y-2">
          <h4 className="text-xs font-scientific text-foreground/80">Interpretation Engine</h4>
          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vocabulary Size</span>
              <span className="text-accent">{interpretationEngine.vocabularySize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conceptual Depth</span>
              <span className="text-tensor-overlay">{interpretationEngine.conceptualDepth.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Symbolic Resolution</span>
              <span className="text-resonance-root">{interpretationEngine.symbolicResolution.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Semiotic Map */}
        <div className="space-y-2">
          <h4 className="text-xs font-scientific text-foreground/80">Semiotic Mapping</h4>
          <div className="text-xs font-mono">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Ontological Depth</span>
              <span className="text-primary">{semioticMap.ontologicalDepth.toFixed(3)}</span>
            </div>
            {Array.from(semioticMap.conceptualNodes.entries()).map(([concept, strength]) => (
              <div key={concept} className="flex justify-between py-1">
                <span className="text-muted-foreground capitalize">{concept.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-1 bg-gradient-to-r from-transparent to-primary rounded"
                    style={{ opacity: Math.min(1, strength / 2) }}
                  />
                  <span className="text-primary text-[10px]">{strength.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Semantic Events */}
        <div className="space-y-2">
          <h4 className="text-xs font-scientific text-foreground/80 flex items-center gap-2">
            <Zap className="h-3 w-3" />
            Semantic Events
          </h4>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {semanticEvents.slice(-8).reverse().map((event) => (
                <div key={event.id} className="p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px]">
                      {event.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-foreground/80 mb-1">{event.interpretation}</div>
                  <div className="text-warning mb-1">{event.coa}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">
                      Threat Level: {event.metaphysicalWeight.toFixed(3)}
                    </span>
                    <div className="flex items-center gap-1">
                      {event.magnitude > 0.7 && <Target className="h-2 w-2 text-destructive" />}
                      {event.metaphysicalWeight > 0.8 && <GitBranch className="h-2 w-2 text-primary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
