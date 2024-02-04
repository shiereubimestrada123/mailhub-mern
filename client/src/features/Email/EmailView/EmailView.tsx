import { EmailInbox, EmailStarred } from "..";
import { useParams } from "react-router-dom";

export function EmailView() {
  const { inbox, starred } = useParams();

  return (
    <section className="w-5/6 p-2">
      asdf
      {/* {inbox && <EmailInbox />}
      {starred && <EmailStarred />} */}
    </section>
  );
}
