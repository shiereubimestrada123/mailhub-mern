import { useState, useParams } from "react";
import { ComposeEmailModal, ReplyEmailModal } from "../EmailModal";
import { FaReply } from "react-icons/fa";
import { useEmailStore } from "@store";
import { formatDate } from "@utils";

export function CategoryItem({ categoryId, category }: any) {
  console.log("categoryId", categoryId);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const mailbox = useEmailStore((state) => state.mailbox);
  const isOpenCompose = useEmailStore((state) => state.isOpenCompose);

  console.log("mailbox", mailbox);

  const selectedInbox =
    mailbox.inbox.items.flat().find((item) => item._id === categoryId) || null;

  const selectedSent =
    mailbox.outbox.items.find((item) => item._id === categoryId) || null;

  const handleReplyClick = (email: any) => {
    setSelectedEmail(email);
    setShowReplyModal(true);
  };

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
              <FaReply onClick={() => handleReplyClick(selectedInbox)} />
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

      {showReplyModal && (
        <ReplyEmailModal
          selectedInbox={selectedInbox}
          setShowReplyModal={setShowReplyModal}
        />
      )}

      {isOpenCompose && <ComposeEmailModal />}
    </>
  );
}
