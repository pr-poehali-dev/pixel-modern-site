interface MosaicTypeAnimationProps {
  type: 'lego' | 'round' | 'square';
}

const MosaicTypeAnimation = ({ type }: MosaicTypeAnimationProps) => {
  if (type === 'lego') {
    return (
      <div className="w-24 h-24 grid grid-cols-4 gap-1 p-2">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-primary to-purple-600 rounded-sm animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'round') {
    return (
      <div className="w-24 h-24 grid grid-cols-5 gap-1 p-2">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-secondary to-pink-600 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.08}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-24 h-24 grid grid-cols-5 gap-1 p-2">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-br from-accent to-blue-600 animate-pulse"
          style={{
            animationDelay: `${i * 0.08}s`,
            animationDuration: '2s'
          }}
        />
      ))}
    </div>
  );
};

export default MosaicTypeAnimation;
