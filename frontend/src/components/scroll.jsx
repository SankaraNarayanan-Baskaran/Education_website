import { useEffect } from 'react';

const UseScrollToSection = (sectionId) => {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sectionId]);
};

export default UseScrollToSection;
