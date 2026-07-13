import { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{
    currExpanded: string;
    currImage: string;
    currCaption: string;
    setCaption: (s: string) => void;
    toggleTheme: (s: string) => void;
    setImage: (s: string) => void;
    currColor: string;
    setCurrColor: (s: string) => void;
}>({
    currExpanded: '',
    toggleTheme: () => {},
    currImage: '',
    currCaption: '',
    setCaption: () => {},
    setImage: () => {},
    currColor: '#ffffff',
    setCurrColor: () => {}
});

// 2. Create a provider component
export function SelectionProvider({children}: { children: React.ReactNode }) {
  const [currExpanded, setCurrExpanded] = useState('');
  const [currCaption, setCurrCaption] = useState('');
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

  const setCaption = (s: string) => {
    setCurrCaption(s);
  }

  return (
    <SelectionContext.Provider value={{ currExpanded, currImage, currCaption, setCaption, toggleTheme, setImage, currColor, setCurrColor }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  return useContext(SelectionContext);
}