import React, { useState, useEffect } from 'react';

const usePageScrollHook = () => {
	const [ scrolled, setScrolled ] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 0) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return scrolled;
};

export default usePageScrollHook;
