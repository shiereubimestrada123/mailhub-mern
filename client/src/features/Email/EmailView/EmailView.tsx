import { useParams } from "react-router-dom";
import { Drafts, Inbox, Send, Starred, Trash } from "./Category";

export function EmailView({ selectedItem }: any) {
  const { category = "inbox" } = useParams();

  const componentsByCategory: { [key: string]: JSX.Element } = {
    inbox: <Inbox selectedItem={selectedItem} />,
    starred: <Starred selectedItem={selectedItem} />,
    drafts: <Drafts selectedItem={selectedItem} />,
    send: <Send selectedItem={selectedItem} />,
    trash: <Trash selectedItem={selectedItem} />,
  };

  const componentToRender = componentsByCategory[category ?? "inbox"] || (
    <div>No such category found</div>
  );

  return <section className="w-5/6 p-2">{componentToRender}</section>;
}
