import { FaReply } from "react-icons/fa";
import { useEmailStore } from "@store";
import { formatDate } from "@utils";

export function CategoryItem({ categoryId, category }: any) {
  const mailbox = useEmailStore((state) => state.mailbox);

  const selectedInbox = mailbox.inbox.items.find(
    (item) => item._id === categoryId,
  );

  const selectedSent = mailbox.outbox.items.find(
    (item) => item._id === categoryId,
  );

  console.log("selectedInbox", selectedInbox);
  console.log("selectedOutbox", selectedSent);

  return (
    <>
      {selectedInbox && category === "inbox" && (
        <div className="w-full p-2">
          <h2>{selectedInbox.subject}</h2>
          <div className="flex justify-between">
            <div>
              <p>From: {selectedInbox.from}</p>
              <p>To: {selectedInbox.to}</p>
            </div>

            <div className="flex items-center gap-4">
              <p>{formatDate(selectedInbox.createdAt)}</p>
              <FaReply />
            </div>
          </div>
          <p className="p-10 text-center">{selectedInbox.message}</p>
        </div>
      )}
      {selectedSent && category === "sent" && (
        <div className="w-full p-2">
          <h2>{selectedSent.subject}</h2>
          <div className="flex  justify-between">
            <div>
              <p>From: {selectedSent.from}</p>
              <p>To: {selectedSent.to}</p>
            </div>

            <div className="flex items-center gap-4">
              <p>{formatDate(selectedSent.createdAt)}</p>
              <FaReply />
            </div>
          </div>
          <p className="p-10 text-center">{selectedSent.message}</p>
        </div>
      )}
      {!selectedInbox && !selectedSent && <div>Item not found</div>}
    </>
  );
}
