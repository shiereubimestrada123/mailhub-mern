import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdAllInbox, MdDrafts } from "react-icons/md";
import { FaStar, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Button } from "@components";

export function Sidebar() {
  const [showMore, setShowMore] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  // const { test } = useParams();
  const navigate = useNavigate();

  const toggleShowMore = () => setShowMore(!showMore);

  const handleItemClick = (index: number, label: string) => {
    setSelectedIdx(index);
    navigate(`/email/${label.toLowerCase()}`);
  };

  const sidebarItems = [
    { icon: <MdAllInbox />, label: "Inbox" },
    { icon: <FaStar />, label: "Starred" },
    { icon: <MdDrafts />, label: "Drafts" },
    { icon: <IoMdSend />, label: "Send" },
  ];

  return (
    <section className="bg-slate-300 p-4 h-custom-height w-1/6">
      <Button
        type="submit"
        className="mb-3 text-slate-100 btn btn-block btn-active btn-primary"
        // disabled={isSubmitting || isPending}
      >
        Compose
      </Button>
      <div>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center w-full h-10 p-2 cursor-pointer rounded ${
              selectedIdx === index ? "bg-primary" : "hover:bg-info"
            }`}
            onClick={() => handleItemClick(index, item.label)}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <p>{item.label}</p>
            </div>
            {index === 0 && <p>10</p>}
          </div>
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
          <>
            <div
              className={`flex justify-between items-center w-full h-10 p-2 cursor-pointer rounded ${
                selectedIdx === sidebarItems.length
                  ? "bg-primary"
                  : "hover:bg-info"
              }`}
              onClick={() => handleItemClick(sidebarItems.length, "Trash")}
            >
              <div className="flex items-center gap-2">
                <FaTrash />
                <p>Trash</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
