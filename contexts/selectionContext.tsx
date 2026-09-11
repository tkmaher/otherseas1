import { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{
    currHover: string,
    setCurrHover: (s:string) => void;
    currColor: string;
    setCurrColor: (s: string) => void;
}>({
    currHover: '',
    setCurrHover: () => {},
    currColor: '#fafafa',
    setCurrColor: () => {}
});

// 2. Create a provider component
export function SelectionProvider({children}: { children: React.ReactNode }) {
  const [ currHover, setHover ] =  useState('');
  const [ currColor, setColor ] = useState('#fafafa');

  const setCurrHover = (s: string) => {
    setHover(s);
  }
  
  const setCurrColor = (s: string) => {
    setColor(s);
  }

  return (
    <SelectionContext.Provider value={{ currHover, setCurrHover, currColor, setCurrColor }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  return useContext(SelectionContext);
}