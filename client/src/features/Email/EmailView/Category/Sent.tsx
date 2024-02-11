import { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

type Email = {
  _id: string;
  to: string;
  subject: string;
};

type SendProps = {
  outbox: Email[];
};

export function Sent({ outbox }: SendProps) {
  const [starredEmails, setStarredEmails] = useState<string[]>([]);

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
            {outbox.map((email) => (
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
    </section>
  );
}
