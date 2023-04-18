import { useState, useEffect } from 'react';

const DeviceType = {
    MOBILE: 'MOBILE',
    TABLET: 'TABLET',
    DESKTOP: 'DESKTOP',
}

function useDeviceType() {
  const [currentDeviceType, setCurrentDeviceType] = useState('');

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentDeviceType(DeviceType.MOBILE);
      } else if (width >= 768 && width < 1024) {
        setCurrentDeviceType(DeviceType.TABLET);
      } else {
        setCurrentDeviceType(DeviceType.DESKTOP);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isMobile: currentDeviceType === DeviceType.MOBILE,
    isTablet: currentDeviceType === DeviceType.TABLET,
    isDesktop: currentDeviceType === DeviceType.DESKTOP,
    isTabletOrDesktop: currentDeviceType === DeviceType.TABLET || currentDeviceType === DeviceType.DESKTOP,
  };
}

export default useDeviceType;