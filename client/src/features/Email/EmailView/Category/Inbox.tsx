import { useState } from "react";
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
  const [starredEmails, setStarredEmails] = useState<string[]>([]);

  const toggleStar = (inboxId: string) => {
    if (starredEmails.includes(inboxId)) {
      setStarredEmails(starredEmails.filter((id) => id !== inboxId));
    } else {
      setStarredEmails([...starredEmails, inboxId]);
    }
  };

  const totalPages = Math.ceil(inbox.totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, inbox.totalCount);
  const inboxItems = inbox.items.slice(0, endIndex);

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
            {inboxItems.map((item: Items) => (
              <tr key={item._id} className="cursor-pointer hover:bg-gray-200">
                <td>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
                <td>
                  {!starredEmails.includes(item._id) ? (
                    <CiStar
                      className="pb-1 text-3xl"
                      onClick={() => toggleStar(item._id)}
                    />
                  ) : (
                    <FaStar
                      className="pb-1 text-3xl"
                      onClick={() => toggleStar(item._id)}
                    />
                  )}
                </td>
                <td>{item.to}</td>
                <td>{item.subject}</td>
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
