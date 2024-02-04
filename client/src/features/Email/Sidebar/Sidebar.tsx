import { useState } from "react";
import { MdAllInbox, MdDrafts } from "react-icons/md";
import { FaStar, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Button } from "@components";
import { SidebarItem } from "./SidebarItem";

const sidebarItems = [
  { icon: <MdAllInbox />, label: "inbox" },
  { icon: <FaStar />, label: "starred" },
  { icon: <MdDrafts />, label: "drafts" },
  { icon: <IoMdSend />, label: "send" },
  { icon: <FaTrash />, label: "trash" },
];

type SidebarProps = {
  selectedItem: string;
  onItemClick: (label: string) => void;
};

export function Sidebar({ selectedItem, onItemClick }: SidebarProps) {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore(!showMore);

  const handleItemClick = (label: string) => {
    onItemClick(label);
  };

  return (
    <section className="bg-slate-300 p-4 h-custom-height w-1/6">
      <Button
        type="submit"
        className="mb-3 text-slate-100 btn btn-block btn-active btn-primary"
      >
        Compose
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
          className="flex justify-between items-center w-full h-10 p-2 rounded cursor-pointer hover:bg-info"
          onClick={toggleShowMore}
        >
          <div className="flex items-center gap-2">
            {showMore ? <FaChevronDown /> : <FaChevronRight />}
            <p>More</p>
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
