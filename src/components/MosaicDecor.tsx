const MosaicDecor = ({ type = 'square' }: { type?: 'square' | 'round' | 'lego' }) => {
  if (type === 'round') {
    return (
      <div className="absolute pointer-events-none opacity-20">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${
                  ['#9b87f5', '#D946EF', '#0EA5E9'][i % 3]
                }, ${
                  ['#7E69AB', '#BE185D', '#0284C7'][i % 3]
                })`,
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'lego') {
    return (
      <div className="absolute pointer-events-none opacity-20">
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative">
              <div 
                className="w-8 h-6 rounded-sm"
                style={{
                  background: ['#9b87f5', '#D946EF', '#0EA5E9', '#F97316'][i],
                  boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)'
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-current opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute pointer-events-none opacity-20">
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className="w-3 h-3"
            style={{
              background: `linear-gradient(135deg, ${
                ['#9b87f5', '#D946EF', '#0EA5E9'][i % 3]
              } 0%, ${
                ['#7E69AB', '#BE185D', '#0284C7'][i % 3]
              } 100%)`,
              boxShadow: 'inset 0 0 2px rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MosaicDecor;
