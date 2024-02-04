import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdAllInbox, MdDrafts } from "react-icons/md";
import { FaStar, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Button } from "@components";
import { EmailInbox, EmailStarred } from ".";

const sidebarItems = [
  { icon: <MdAllInbox />, label: "inbox" },
  { icon: <FaStar />, label: "starred" },
  { icon: <MdDrafts />, label: "drafts" },
  { icon: <IoMdSend />, label: "send" },
  { icon: <FaTrash />, label: "trash" },
];

type SidebarItemProps = {
  item: { icon: JSX.Element; label: string };
  index: number;
  // selectedIdx: number;
  selectedItem: string;
  // handleItemClick: (index: number, label: string) => void;
  handleItemClick: (label: string) => void;
};

const SidebarItem = ({
  item,
  index,
  // selectedIdx,
  selectedItem,
  handleItemClick,
}: SidebarItemProps) => (
  <div
    key={index}
    className={`flex justify-between items-center w-full h-10 p-2 cursor-pointer rounded ${
      // selectedIdx === index ? "bg-primary" : "hover:bg-info"
      selectedItem === item.label ? "bg-primary" : "hover:bg-info"
    }`}
    // onClick={() => handleItemClick(index, item.label)}
    onClick={() => handleItemClick(item.label)}
  >
    <div className="flex items-center gap-2">
      {item.icon}
      <p>{item.label.charAt(0).toUpperCase() + item.label.slice(1)}</p>
    </div>
    {index === 0 && <p>10</p>}
  </div>
);
export function Sidebar({ selectedItem, onItemClick }: any) {
  const [showMore, setShowMore] = useState(false);
  // const [selectedIdx, setSelectedIdx] = useState<number>(0);
  // const [selectedItem, setSelectedItem] = useState("inbox");
  // const navigate = useNavigate();

  const toggleShowMore = () => setShowMore(!showMore);

  const handleItemClick = (label: string) => {
    // setSelectedIdx(index);
    onItemClick(label);
    // setSelectedItem(label);
    // navigate(`/email/${label}`);
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
              // selectedIdx={selectedIdx}
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
            // selectedIdx={selectedIdx}
            selectedItem={selectedItem}
            handleItemClick={handleItemClick}
          />
        )}

        {/* {selectedIdx === 0 && <EmailInbox />}
        {selectedIdx === 1 && <EmailStarred />} */}
      </div>
    </section>
  );
}
