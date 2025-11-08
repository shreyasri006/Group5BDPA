import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import colorData from '../data/color_data.json';

interface SchoolColor {
  name: string;
  primary: string;
  secondary: string;
}

interface SchoolColorsContextType {
  selectedSchool: string | null;
  schoolColors: SchoolColor | null;
  setSelectedSchool: (schoolName: string | null) => void;
  schools: SchoolColor[];
}

const SchoolColorsContext = createContext<SchoolColorsContextType | undefined>(undefined);

export function SchoolColorsProvider({ children }: { children: ReactNode }) {
  const [selectedSchool, setSelectedSchoolState] = useState<string | null>(() => {
    // Restore from localStorage
    try {
      const saved = localStorage.getItem('selectedSchool');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [schoolColors, setSchoolColors] = useState<SchoolColor | null>(null);
  const schools = (colorData as { schools: SchoolColor[] }).schools;

  // Update school colors when selected school changes
  useEffect(() => {
    if (selectedSchool) {
      // Try exact match first
      let school = schools.find(s => s.name === selectedSchool);
      
      // If no exact match, try partial match (case-insensitive)
      if (!school) {
        school = schools.find(s => 
          s.name.toLowerCase().includes(selectedSchool.toLowerCase()) ||
          selectedSchool.toLowerCase().includes(s.name.toLowerCase())
        );
      }
      
      // If still no match, try matching by removing common suffixes/prefixes
      if (!school) {
        const normalizedSelected = selectedSchool
          .replace(/\s*\([^)]*\)\s*/g, '') // Remove parentheses and content
          .trim();
        school = schools.find(s => {
          const normalizedSchool = s.name
            .replace(/\s*\([^)]*\)\s*/g, '')
            .trim();
          return normalizedSchool.toLowerCase() === normalizedSelected.toLowerCase();
        });
      }
      
      if (school) {
        setSchoolColors(school);
        // Save to localStorage
        localStorage.setItem('selectedSchool', JSON.stringify(selectedSchool));
      } else {
        setSchoolColors(null);
      }
    } else {
      setSchoolColors(null);
      localStorage.removeItem('selectedSchool');
    }
  }, [selectedSchool, schools]);

  // Apply colors as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (schoolColors) {
      root.style.setProperty('--primary', schoolColors.primary);
      root.style.setProperty('--secondary', schoolColors.secondary);
      
      // Calculate a good contrast color for text on primary background
      // Simple check: if primary is dark, use white text; if light, use dark text
      const primaryRgb = hexToRgb(schoolColors.primary);
      const primaryContrast = primaryRgb && getLuminance(primaryRgb) > 0.5 
        ? '#000000' 
        : '#FFFFFF';
      root.style.setProperty('--primary-contrast', primaryContrast);
    } else {
      // Reset to default colors (matching original design)
      root.style.setProperty('--primary', '#667eea');
      root.style.setProperty('--secondary', '#f5f7fa');
      root.style.setProperty('--primary-contrast', '#FFFFFF');
    }
  }, [schoolColors]);

  const setSelectedSchool = (schoolName: string | null) => {
    setSelectedSchoolState(schoolName);
  };

  return (
    <SchoolColorsContext.Provider value={{ 
      selectedSchool, 
      schoolColors, 
      setSelectedSchool, 
      schools 
    }}>
      {children}
    </SchoolColorsContext.Provider>
  );
}

export function useSchoolColors() {
  const context = useContext(SchoolColorsContext);
  if (context === undefined) {
    throw new Error('useSchoolColors must be used within a SchoolColorsProvider');
  }
  return context;
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper function to calculate relative luminance
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

