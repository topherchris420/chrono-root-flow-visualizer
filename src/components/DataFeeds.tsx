import React from 'react';

export const useDataFeeds = () => {
  const [link16Data, setLink16Data] = React.useState<any[]>([]);
  const [gccsData, setGccsData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const link16Interval = setInterval(() => {
      setLink16Data(prevData => [
        ...prevData,
        {
          id: `link16-${Date.now()}`,
          type: 'track',
          position: {
            lat: Math.random() * 90,
            lon: Math.random() * 180,
          },
          altitude: Math.random() * 10000,
          speed: Math.random() * 1000,
          timestamp: Date.now(),
        },
      ]);
    }, 1000);

    const gccsInterval = setInterval(() => {
      setGccsData(prevData => [
        ...prevData,
        {
          id: `gccs-${Date.now()}`,
          type: 'intel',
          source: 'uav',
          report: 'enemy movement detected',
          timestamp: Date.now(),
        },
      ]);
    }, 5000);

    return () => {
      clearInterval(link16Interval);
      clearInterval(gccsInterval);
    };
  }, []);

  return { link16Data, gccsData };
};
