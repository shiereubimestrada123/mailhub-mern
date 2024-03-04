import { useParams } from "react-router-dom";

export function InboxItem() {
  const { inboxId } = useParams();
  console.log("inboxId:", inboxId); // Log inboxId to check if it's being extracted correctly

  return <div>InboxItem {inboxId}</div>;
}
