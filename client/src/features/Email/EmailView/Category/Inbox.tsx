import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Pagination } from "@components";
import { InboxCategory } from "@types";

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
  if (!inbox || !inbox.items) {
    return <div>Loading...</div>;
  }

  const [starredEmails, setStarredEmails] = useState<string[]>([]);

  const toggleStar = (emailId: string) => {
    if (starredEmails.includes(emailId)) {
      setStarredEmails(starredEmails.filter((id) => id !== emailId));
    } else {
      setStarredEmails([...starredEmails, emailId]);
    }
  };

  const totalPages = Math.ceil(inbox.totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, inbox.totalCount);
  const visibleEmails = inbox.items.slice(0, endIndex);

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
            {visibleEmails.map((email) => (
              <tr key={email._id} className="cursor-pointer hover:bg-gray-200">
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
            ))}
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
