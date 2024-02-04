import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailView, Header, Sidebar } from "@features";

export function EmailPage() {
  const [selectedItem, setSelectedItem] = useState("inbox");
  const navigate = useNavigate();
  console.log("selectedItem", selectedItem);
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
          onItemClick={handleSidebarItemClick}
        />
        <EmailView selectedItem={selectedItem} />
      </main>
    </div>
  );
}

// import { EmailView, Header, Sidebar } from "@features";

// export function EmailPage() {
//   return (
//     <div className="">
//       <Header />
//       <main className="flex w-full">
//         <Sidebar />
//         <EmailView />
//       </main>
//     </div>
//   );
// }
