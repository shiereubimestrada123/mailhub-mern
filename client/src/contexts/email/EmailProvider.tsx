import React, { createContext, useContext, useState } from "react";

type EmailContextType = {
  selectedItem: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSidebarItemClick: (label: string) => void;
};

export const EmailContext = createContext<EmailContextType | undefined>(
  undefined
);

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState("inbox");
  const [isOpen, setIsOpen] = useState(false);

  const handleSidebarItemClick = (label: string) => {
    setSelectedItem(label);
  };

  return (
    <EmailContext.Provider
      value={{ selectedItem, isOpen, setIsOpen, handleSidebarItemClick }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
