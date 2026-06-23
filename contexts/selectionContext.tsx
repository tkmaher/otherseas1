import { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{
    currExpanded: string;
    currImage: string;
    toggleTheme: (s: string) => void;
    setImage: (s: string) => void;
    currColor: string;
    setCurrColor: (s: string) => void;
}>({
    currExpanded: '',
    toggleTheme: () => {},
    currImage: '',
    setImage: () => {},
    currColor: '#ffffff',
    setCurrColor: () => {}
});

// 2. Create a provider component
export function SelectionProvider({children}: { children: React.ReactNode }) {
  const [currExpanded, setCurrExpanded] = useState('');
  const [currImage, setCurrImage] = useState('');
  const [currColor, setColor] = useState('#ffffff')

  const toggleTheme = (s: string) => {
    setCurrExpanded(s);
  };

  const setImage = (s: string) => {
    setCurrImage(s);
  }

  const setCurrColor = (s: string) => {
    setColor(s);
  }

  return (
    <SelectionContext.Provider value={{ currExpanded, currImage, toggleTheme, setImage, currColor, setCurrColor }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  return useContext(SelectionContext);
}