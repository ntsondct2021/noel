
import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
      size: `${Math.random() * 10 + 5}px`
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animation: `snow ${flake.duration} linear ${flake.delay} infinite`,
            fontSize: flake.size
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};

export default Snowfall;
