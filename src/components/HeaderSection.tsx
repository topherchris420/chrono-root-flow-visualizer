
interface HeaderSectionProps {
  encryptedMode: boolean;
}

export const HeaderSection = ({ encryptedMode }: HeaderSectionProps) => {
  return (
    <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/da1c990c-f138-42e2-bf8a-7774d65f3410.png" 
                alt="Vers3Vector Logo"
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-xl font-bold text-primary">VERS3VECTOR</h1>
            </div>
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
  );
};
