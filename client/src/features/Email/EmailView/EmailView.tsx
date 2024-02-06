import { useParams } from "react-router-dom";
import { FormInput, Modal, Button } from "@components";
import { Drafts, Inbox, Send, Starred, Trash } from "./Category";
import { useEmail } from "@contexts";

export function EmailView() {
  const { category = "inbox" } = useParams();
  const { isOpen } = useEmail();

  const componentsByCategory: { [key: string]: JSX.Element } = {
    inbox: <Inbox />,
    starred: <Starred />,
    drafts: <Drafts />,
    send: <Send />,
    trash: <Trash />,
  };

  const categories = componentsByCategory[category ?? "inbox"] || (
    <div>No such category found</div>
  );

  return (
    <section className="w-5/6 p-2">
      <div>{categories}</div>
      {isOpen && (
        <Modal>
          <div className="flex h-[420px] flex-col">
            <FormInput
              id="from"
              type="text"
              labelText="From: "
              classLabel="w-full flex border-b"
              classInput="w-full outline-none p-2"
            />
            <FormInput
              id="to"
              type="text"
              labelText="To: "
              classLabel="flex border-b"
              classInput="w-full outline-none p-2"
            />
            <FormInput
              id="to"
              type="text"
              labelText="Subject: "
              classLabel="flex border-b"
              classInput="w-full outline-none p-2"
            />
            <textarea className="my-2 grow resize-none border-b outline-none"></textarea>
            <div className="inline-flex">
              <Button
                type="submit"
                className="btn btn-primary btn-active mt-3 text-slate-100"
                // disabled={isSubmitting || isPending}
              >
                Send
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
