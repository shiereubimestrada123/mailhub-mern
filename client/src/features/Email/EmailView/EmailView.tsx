import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEmailStore } from "@store";
import { get } from "@utils";
import { ComposeEmailModal } from "./EmailModal";
import { Drafts, Inbox, Sent, Starred, Trash } from "./Category";

export function EmailView() {
  const { category = "inbox" } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const isOpenCompose = useEmailStore((state) => state.isOpenCompose);
  const mailbox = useEmailStore((state) => state.mailbox);
  const getMailBox = useEmailStore((state) => state.getMailBox);

  let { inbox, outbox, drafts, trash, pageSize } = mailbox;

  useEffect(() => {
    getMailBox(mailbox);
  }, []);

  useEffect(() => {
    const fetchMailBox = async () => {
      try {
        const responseData = await get(
          `/email/${category}?page=${currentPage}`,
        );
        getMailBox(responseData);
      } catch (error) {
        console.error("Error fetching mailbox:", error);
      }
    };

    fetchMailBox();
  }, [currentPage, category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const componentsByCategory: { [key: string]: JSX.Element } = {
    inbox: (
      <Inbox
        inbox={inbox}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    ),
    starred: <Starred />,
    drafts: (
      <Drafts
        drafts={drafts}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    ),
    sent: (
      <Sent
        outbox={outbox}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    ),
    trash: <Trash />,
  };

  const categories = componentsByCategory[category ?? "inbox"] || (
    <div>No such category found</div>
  );

  return (
    <section className="h-screen w-5/6 p-2">
      <div className="max-h-full overflow-auto">
        <div>{categories}</div>
        {isOpenCompose && <ComposeEmailModal />}
      </div>
    </section>
  );
}
