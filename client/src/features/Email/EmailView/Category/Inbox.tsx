import { useState, useEffect } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Pagination } from "@components";

type Email = {
  _id: string;
  to: string;
  subject: string;
};

type Inbox = {
  items: Email[];
  totalCount: number;
};

type InboxProps = {
  inbox: Inbox;
  currentPage: number;
  onPageChange: (page: number) => void;
  emailsPerPage: number; // Include emailsPerPage as a prop
};

const ITEMS_PER_PAGE = 10;

export function Inbox({
  inbox,
  currentPage,
  onPageChange,
  emailsPerPage,
}: InboxProps) {
  if (!inbox || !inbox.items) {
    return <div>Loading...</div>; // or display an error message
  }

  const [starredEmails, setStarredEmails] = useState<string[]>([]);

  const totalPages = Math.ceil(inbox.totalCount / emailsPerPage);
  console.log("totalPages", totalPages);
  const startIndex = (currentPage - 1) * emailsPerPage;
  console.log("startIndex", startIndex);
  const endIndex = Math.min(startIndex + emailsPerPage, inbox.totalCount);
  console.log("endIndex", endIndex);

  const visibleEmails = inbox.items.slice(0, endIndex);
  console.log(visibleEmails);
  const toggleStar = (emailId: string) => {
    if (starredEmails.includes(emailId)) {
      setStarredEmails(starredEmails.filter((id) => id !== emailId));
    } else {
      setStarredEmails([...starredEmails, emailId]);
    }
  };

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
                <td onClick={() => toggleStar(email._id)}>
                  {!starredEmails.includes(email._id) ? (
                    <CiStar className="pb-1 text-3xl" />
                  ) : (
                    <FaStar className="pb-1 text-3xl" />
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
