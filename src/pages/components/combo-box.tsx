import React, { createContext, useContext, ReactNode } from "react";
interface ComboboxContextType<T> {
  searchInput: string;
  suggestions: T[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSuggestion: (suggestion: T) => void;
  placeholder?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComboboxContext = createContext<ComboboxContextType<any> | undefined>(
  undefined
);

interface ComboboxProps<T> {
  children: ReactNode;
  searchInput: string;
  suggestions: T[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSuggestion: (suggestion: T) => void;
  placeholder?: string;
}

interface RenderOptionProps<T> {
  option: T;
}

export function Combobox<T>({ children, ...props }: ComboboxProps<T>) {
  return (
    <ComboboxContext.Provider value={props}>
      <div className="flex flex-col items-center justify-center relative">
        <div className="flex items-center justify-center w-full">
          {children}
        </div>
      </div>
    </ComboboxContext.Provider>
  );
}

Combobox.Icon = function ComboboxIcon() {
  return (
    <svg
      className="h-6 w-6 fill-current text-white"
      viewBox="0 0 612 612"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M574.368,488.714l-176.536-60.717c5.134-6.748,10.334-13.699,15.547-20.831c64.324-88.008,96.942-156.255,96.942-202.843C510.321,91.658,418.662,0,305.999,0S101.678,91.658,101.678,204.324c0,46.588,32.617,114.834,96.942,202.843c5.257,7.19,10.5,14.197,15.673,20.995L37.648,488.708c-6.86,2.352-11.469,8.802-11.473,16.055c-0.004,7.252,4.6,13.708,11.458,16.067l262.392,90.247c1.79,0.614,3.657,0.923,5.522,0.923c1.861,0,3.723-0.306,5.507-0.917l263.299-90.247c6.86-2.35,11.469-8.802,11.473-16.054C585.828,497.529,581.225,491.073,574.368,488.714z M476.359,204.324c0,73.541-113.223,217.573-170.362,282.596c-57.139-65.005-170.359-209.006-170.359-282.596c0.001-93.937,76.423-170.362,170.361-170.362S476.359,110.386,476.359,204.324z M305.556,577.066L95.443,504.799l140.954-48.314c31.177,38.986,55.676,65.82,57.077,67.351c3.218,3.512,7.76,5.512,12.525,5.512c4.763,0,9.307-2,12.525-5.512c1.404-1.534,25.972-28.447,57.217-67.525l140.816,48.433L305.556,577.066z" />
      <path d="M305.999,281.655c48.125,0,87.277-39.152,87.277-87.277s-39.152-87.277-87.277-87.277s-87.277,39.152-87.277,87.277S257.874,281.655,305.999,281.655z M359.314,194.379c0,29.398-23.916,53.315-53.315,53.315s-53.315-23.916-53.315-53.315c0-29.396,23.916-53.315,53.315-53.315S359.314,164.982,359.314,194.379z" />
    </svg>
  );
};

Combobox.Input = function ComboboxInput() {
  const context = useContext(ComboboxContext);

  if (!context) throw new Error("ComboboxInput must be used within Combobox");

  return (
    <input
      name="search"
      role="combobox"
      aria-expanded={context.suggestions.length > 0}
      aria-controls="search-suggestions"
      aria-autocomplete="list"
      placeholder={context.placeholder || "Enter a city"}
      value={context.searchInput}
      onChange={context.onInputChange}
      className="ml-3 border-none text-zinc focus:outline-none text-xl placeholder-zinc rounded-full py-2 px-5 w-full"
    />
  );
};

Combobox.Suggestions = function ComboboxSuggestions<T>({
  renderOption,
}: {
  renderOption: (props: RenderOptionProps<T>) => ReactNode;
}) {
  const context = useContext(ComboboxContext);
  if (!context)
    throw new Error("ComboboxSuggestions must be used within Combobox");

  if (!context.suggestions.length) return null;

  return (
    <ul
      id="search-suggestions"
      role="listbox"
      className="absolute w-full bg-white mt-12 rounded-lg shadow-lg z-10 top-0"
    >
      {context.suggestions.map((suggestion, index) => (
        <li
          key={index}
          role="option"
          aria-selected={false}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
          onClick={() => context.onSelectSuggestion(suggestion)}
        >
          {renderOption({ option: suggestion })}
        </li>
      ))}
    </ul>
  );
};
