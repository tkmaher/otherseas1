import { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{
    currImage: string;
    currCaption: string;
    setCaption: (s: string) => void;
    setImage: (s: string) => void;
    currColor: string;
    setCurrColor: (s: string) => void;
    currHover: string;
    setCurrHover: (s: string) => void
}>({
    currImage: '',
    currCaption: '',
    setCaption: () => {},
    setImage: () => {},
    currColor: '#fafafa',
    setCurrColor: () => {},
    currHover: '',
    setCurrHover: () => {}
});

// 2. Create a provider component
export function SelectionProvider({children}: { children: React.ReactNode }) {
  const [currCaption, setCurrCaption] = useState('');
  const [currImage, setCurrImage] = useState('');
  const [currColor, setColor] = useState('#fafafa');
  const [currHover, setHover] = useState('');

  const setImage = (s: string) => {
    setCurrImage(s);
  }

  const setCurrColor = (s: string) => {
    setColor(s);
  }

  const setCaption = (s: string) => {
    setCurrCaption(s);
  }

  const setCurrHover = (s: string) => {
    setHover(s);
  }

  return (
    <SelectionContext.Provider value={{ currImage, currCaption, setCaption, setImage, currColor, setCurrColor, currHover, setCurrHover }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  return useContext(SelectionContext);
}