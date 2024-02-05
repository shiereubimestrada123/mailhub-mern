import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmailView, Header, Sidebar } from "@features";

export function EmailPage() {
  const [selectedItem, setSelectedItem] = useState("inbox");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSidebarItemClick = (label: string) => {
    setSelectedItem(label);
    navigate(`/email/${label}`);
  };

  return (
    <div className="">
      <Header />
      <main className="flex w-full">
        <Sidebar
          selectedItem={selectedItem}
          setIsOpen={setIsOpen}
          onItemClick={handleSidebarItemClick}
        />
        <EmailView isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
    </div>
  );
}
