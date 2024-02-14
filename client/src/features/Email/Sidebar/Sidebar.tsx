import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAllInbox, MdDrafts } from "react-icons/md";
import { FaStar, FaTrash, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { IoMdSend, IoMdCreate } from "react-icons/io";
import { Button } from "@components";
import { SidebarItem } from "./SidebarItem";
import { useEmailStore } from "@store";

const sidebarItems = [
  { icon: <MdAllInbox />, label: "inbox" },
  { icon: <FaStar />, label: "starred" },
  { icon: <MdDrafts />, label: "drafts" },
  { icon: <IoMdSend />, label: "sent" },
  { icon: <FaTrash />, label: "trash" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const selectedItem = useEmailStore((state) => state.selectedItem);
  const setSelectedItem = useEmailStore((state) => state.setSelectedItem);
  const setIsOpen = useEmailStore((state) => state.setIsOpen);

  const toggleShowMore = () => setShowMore(!showMore);

  const handleItemClick = (label: string) => {
    setSelectedItem(label);
    navigate(`/email/${label}`);
  };

  return (
    <section className="h-screen w-1/6 bg-slate-300 p-4">
      <Button
        type="submit"
        className="btn btn-primary btn-active btn-block mb-3 text-slate-100"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <span className="hidden sm:block md:block">Compose</span>
        <span className="block sm:hidden md:hidden">
          <IoMdCreate />
        </span>
      </Button>
      <div>
        {sidebarItems
          .filter((_, index) => index < 4)
          .map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              index={index}
              selectedItem={selectedItem}
              handleItemClick={handleItemClick}
            />
          ))}
        <div
          className="flex h-10 w-full cursor-pointer items-center justify-between rounded p-2 hover:bg-info"
          onClick={toggleShowMore}
        >
          <div className="flex items-center gap-2">
            {showMore ? <FaChevronDown /> : <FaChevronRight />}
            <p className="hidden sm:block md:block">More</p>
          </div>
        </div>
        {showMore && (
          <SidebarItem
            key={sidebarItems.length}
            item={sidebarItems[sidebarItems.length - 1]}
            index={sidebarItems.length - 1}
            selectedItem={selectedItem}
            handleItemClick={handleItemClick}
          />
        )}
      </div>
    </section>
  );
}
