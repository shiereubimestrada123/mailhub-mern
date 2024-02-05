import { useParams } from "react-router-dom";
import { Drafts, Inbox, Send, Starred, Trash } from "./Category";

export function EmailView() {
  const { category = "inbox" } = useParams();

  const componentsByCategory: { [key: string]: JSX.Element } = {
    inbox: <Inbox />,
    starred: <Starred />,
    drafts: <Drafts />,
    send: <Send />,
    trash: <Trash />,
  };

  const categories = componentsByCategory[category ?? "inbox"] || (
    <div>No such category found</div>
  );

  return <section className="w-5/6 p-2">{categories}</section>;
}
