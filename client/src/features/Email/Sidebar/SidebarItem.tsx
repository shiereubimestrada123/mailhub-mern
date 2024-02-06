import { cn } from "@utils";

type SidebarItemProps = {
  item: { icon: JSX.Element; label: string };
  index: number;
  selectedItem: string;
  handleItemClick: (label: string) => void;
};

export const SidebarItem = ({
  item,
  index,
  selectedItem,
  handleItemClick,
}: SidebarItemProps) => (
  <div
    key={index}
    className={cn(
      "flex justify-between items-center w-full h-10 p-2 cursor-pointer rounded",
      selectedItem === item.label ? "bg-primary" : "hover:bg-info"
    )}
    onClick={() => handleItemClick(item.label)}
  >
    <div className="flex items-center gap-2">
      {item.icon}
      <p className="md:block sm:block hidden">
        {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
      </p>
    </div>
    {index === 0 && <p className="md:block sm:block hidden">10</p>}
  </div>
);
