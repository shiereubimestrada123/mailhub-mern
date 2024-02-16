import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FormInput, Modal, Button } from "@components";
import { useAuthStore, useEmailStore } from "@store";
import { post, get } from "@utils";
import { Drafts, Inbox, Sent, Starred, Trash } from "./Category";

type ComposeProps = {
  from: string;
  to: string;
  subject: string;
  message: string;
};

export function EmailView() {
  const { category = "inbox" } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  // const token = useAuthStore((state) => state.token);
  const isOpen = useEmailStore((state) => state.isOpen);
  const setIsOpen = useEmailStore((state) => state.setIsOpen);
  const email = useAuthStore((state) => state.userAccount.user?.email);
  const setMailbox = useEmailStore((state) => state.setMailbox);
  const mailbox = useEmailStore((state) => state.mailbox);
  const getMailBox = useEmailStore((state) => state.getMailBox);

  let { inbox, outbox, drafts, trash, pageSize } = mailbox;
  console.log("mailbox", mailbox);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ComposeProps>({
    defaultValues: {
      from: email,
      to: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    getMailBox(mailbox);
  }, []);

  useEffect(() => {
    const fetchMailBox = async () => {
      try {
        const responseData = await get(`/email?page=${currentPage}`);
        getMailBox(responseData);
      } catch (error) {
        console.error("Error fetching mailbox:", error);
      }
    };

    fetchMailBox();
  }, [currentPage]);

  useEffect(() => {
    reset({
      from: email,
      to: "",
      subject: "",
      message: "",
    });
  }, [email, reset]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { mutateAsync: mutateDraft, isPending: isDraftPending } = useMutation({
    mutationFn: async (newEmail) => {
      return await post("/email/draft", newEmail);
    },
  });

  const saveDraft = async (data: ComposeProps) => {
    try {
      const response = await mutateDraft(data as any);

      const updatedItems = [...mailbox.drafts.items, response.draft];

      updatedItems.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setMailbox({
        ...mailbox,
        drafts: {
          ...mailbox.drafts,
          items: updatedItems,
          totalCount: mailbox.drafts.totalCount + 1,
        },
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const { mutateAsync: mutateSend, isPending: isSendPending } = useMutation({
    mutationFn: async (newEmail) => {
      return await post("/email/sent", newEmail);
    },
  });

  const onSubmit: SubmitHandler<ComposeProps> = async (data) => {
    try {
      const response = await mutateSend(data as any);

      const updatedItems = [...mailbox.outbox.items, response.sent];

      updatedItems.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setMailbox({
        ...mailbox,
        outbox: {
          ...mailbox.outbox,
          items: updatedItems,
          totalCount: mailbox.outbox.totalCount + 1,
        },
      });
    } catch (error: unknown) {
      console.log(error);
    } finally {
      reset();
      setIsOpen(false);
    }
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
        {isOpen && (
          <Modal saveDraft={saveDraft} formData={watch()}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-[420px] flex-col"
            >
              <FormInput
                id="from"
                type="text"
                labelText="From: "
                classLabel="w-full flex border-b"
                classInput="w-full outline-none p-2"
                register={register("from", {
                  required: {
                    value: true,
                    message: "Sender email is required",
                  },
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                errorRequired={
                  errors.from?.type === "required" && errors.from?.message
                }
                errorPattern={
                  errors.from?.type === "pattern" && "Invalid email"
                }
              />
              <FormInput
                id="to"
                type="text"
                labelText="To: "
                classLabel="w-full flex border-b"
                classInput="w-full outline-none p-2"
                register={register("to", {
                  required: {
                    value: true,
                    message: "Recipient email is required",
                  },
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                errorRequired={
                  errors.to?.type === "required" && errors.to?.message
                }
                errorPattern={errors.to?.type === "pattern" && "Invalid email"}
              />
              <FormInput
                id="subject"
                type="text"
                labelText="Subject: "
                classLabel="w-full flex border-b"
                classInput="w-full outline-none p-2"
                register={register("subject", {
                  required: {
                    value: true,
                    message: "Subject is required",
                  },
                })}
                errorRequired={
                  errors.subject?.type === "required" && errors.subject?.message
                }
              />
              <textarea
                id="message"
                className="my-2 grow resize-none border-b outline-none"
                {...register("message", {
                  required: {
                    value: true,
                    message: "Message is required",
                  },
                })}
              />
              <span className="text-red-500">
                {errors.message?.type === "required" && errors.message?.message}
              </span>
              <div className="inline-flex">
                <Button
                  type="submit"
                  className="btn btn-primary btn-active mt-3 text-slate-100"
                  disabled={isSubmitting || isSendPending || isDraftPending}
                >
                  Send
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </section>
  );
}
