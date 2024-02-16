import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Pagination } from "@components";
import { DraftsCategory, Items } from "@types";

type DraftsProps = {
  drafts: DraftsCategory;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
};

export function Drafts({
  drafts,
  currentPage,
  onPageChange,
  pageSize,
}: DraftsProps) {
  const [starredEmails, setStarredEmails] = useState<string[]>([]);

  const toggleStar = (draftId: string) => {
    if (starredEmails.includes(draftId)) {
      setStarredEmails(starredEmails.filter((id) => id !== draftId));
    } else {
      setStarredEmails([...starredEmails, draftId]);
    }
  };

  const totalPages = Math.ceil(drafts.totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, drafts.totalCount);
  const draftsItems = drafts.items.slice(0, endIndex);

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
            {draftsItems.map((item: Items) => (
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
