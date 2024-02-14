import { cn } from "@utils";
import { useEmailStore } from "@store";

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
}: SidebarItemProps) => {
  const totalCount = useEmailStore((state) => state.mailbox.inbox.totalCount);

  return (
    <div
      key={index}
      className={cn(
        "flex h-10 w-full cursor-pointer items-center justify-between rounded p-2",
        selectedItem === item.label ? "bg-primary" : "hover:bg-info",
      )}
      onClick={() => handleItemClick(item.label)}
    >
      <div className="flex items-center gap-2">
        {item.icon}
        <p className="hidden sm:block md:block">
          {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
        </p>
      </div>
      {index === 0 && (
        <p className="hidden sm:block md:block">
          {totalCount ? totalCount : null}
        </p>
      )}
    </div>
  );
};
