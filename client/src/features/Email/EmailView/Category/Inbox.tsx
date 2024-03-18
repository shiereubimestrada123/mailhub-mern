import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Pagination } from "@components";
import { InboxCategory, Items } from "@types";

type InboxProps = {
  inbox: InboxCategory;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
};

export function Inbox({
  inbox,
  currentPage,
  onPageChange,
  pageSize,
}: InboxProps) {
  const navigate = useNavigate();

  const [starredEmails, setStarredEmails] = useState<string[]>([]);
  // console.log("inbox", inbox);
  const toggleStar = (inboxId: string) => {
    if (starredEmails.includes(inboxId)) {
      setStarredEmails(starredEmails.filter((id) => id !== inboxId));
    } else {
      setStarredEmails([...starredEmails, inboxId]);
    }
  };

  const handleDraftClick = (inbox: Items) => {
    navigate(`/email/inbox/${inbox._id}`);
  };

  const totalPages = Math.ceil(inbox.totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, inbox.totalCount);
  const inboxItems = inbox.items.slice(0, endIndex);

  // Modify inboxItems to only contain the last email in each thread
  const lastEmails = inboxItems.map((thread: any) => thread[thread.length - 1]);

  return (
    <section className="w-full">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th></th>
              <th>To</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {lastEmails.map((email: Items) => (
              <tr
                key={email?._id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleDraftClick(email)}
              >
                <td>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
                <td>
                  {email && !starredEmails.includes(email._id) ? (
                    <CiStar
                      className="pb-1 text-3xl"
                      onClick={() => toggleStar(email._id)}
                    />
                  ) : (
                    email && (
                      <FaStar
                        className="pb-1 text-3xl"
                        onClick={() => toggleStar(email._id)}
                      />
                    )
                  )}
                </td>
                <td>{email?.to}</td>
                <td>{email?.subject}</td>{" "}
              </tr>
            ))}
            {/* {lastEmails.map((email: Items) => (
              <tr
                key={email._id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleDraftClick(email)}
              >
                <td>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
                <td>
                  {!starredEmails.includes(email._id) ? (
                    <CiStar
                      className="pb-1 text-3xl"
                      onClick={() => toggleStar(email._id)}
                    />
                  ) : (
                    <FaStar
                      className="pb-1 text-3xl"
                      onClick={() => toggleStar(email._id)}
                    />
                  )}
                </td>
                <td>{email.to}</td>
                <td>{email.subject}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}
