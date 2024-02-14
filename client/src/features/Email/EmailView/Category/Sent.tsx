import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Pagination } from "@components";
import { OutboxCategory } from "@types";

type SendProps = {
  outbox: OutboxCategory;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
};

export function Sent({
  outbox,
  currentPage,
  onPageChange,
  pageSize,
}: SendProps) {
  const [starredEmails, setStarredEmails] = useState<string[]>([]);

  const toggleStar = (outboxId: string) => {
    if (starredEmails.includes(outboxId)) {
      setStarredEmails(starredEmails.filter((id) => id !== outboxId));
    } else {
      setStarredEmails([...starredEmails, outboxId]);
    }
  };

  const totalPages = Math.ceil(outbox.totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, outbox.totalCount);
  const outboxItems = outbox.items.slice(0, endIndex);

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
            {outboxItems.map((item) => (
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
