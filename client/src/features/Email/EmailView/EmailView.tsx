import { useParams } from "react-router-dom";
import { FormInput, Modal, Button } from "@components";
import { Drafts, Inbox, Send, Starred, Trash } from "./Category";

type EmailViewProps = {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

export function EmailView({ isOpen, setIsOpen }: EmailViewProps) {
  const { category = "inbox" } = useParams();

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
      {isOpen && setIsOpen && (
        <Modal setIsOpen={setIsOpen}>
          <div className="flex flex-col h-[420px]">
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
            <textarea className="grow outline-none my-2 resize-none border-b"></textarea>
            <div className="inline-flex">
              <Button
                type="submit"
                className="mt-3 text-slate-100 btn btn-active btn-primary"
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
