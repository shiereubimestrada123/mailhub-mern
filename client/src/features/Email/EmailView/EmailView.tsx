import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { FormInput, Modal, Button } from "@components";
import { useAuthStore, useEmailStore } from "@store";
import { post, get } from "@utils";
import { Drafts, Inbox, Sent, Starred, Trash } from "./Category";

type ComposeProps = {
  from: "";
  to: "";
  subject: "";
  message: "";
};

export function EmailView() {
  const { category = "inbox" } = useParams();
  const token = useAuthStore((state) => state.token);
  const isOpen = useEmailStore((state) => state.isOpen);
  const setIsOpen = useEmailStore((state) => state.setIsOpen);
  const email = useAuthStore((state) => state.userAccount.user?.email);
  const setMailbox = useEmailStore((state) => state.setMailbox);
  const mailbox = useEmailStore((state) => state.mailbox);
  const getMailBox = useEmailStore((state) => state.getMailBox);

  const [currentPage, setCurrentPage] = useState(1);

  let { inbox, outbox, drafts, trash } = mailbox;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
        getMailBox(responseData); // Update Zustand state directly
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

  useEffect(() => {
    console.log("EmailView - currentPage:", currentPage);
  }, [currentPage]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newTodo) => {
      return await post("/email/sent", newTodo);
    },
  });

  const onSubmit: SubmitHandler<ComposeProps> = async (data) => {
    try {
      const response = await mutateAsync(data as any);
      console.log(response);
      setMailbox({ inbox: response.received, outbox: response.sent });
    } catch (error: unknown) {
      console.log(error);
      // if (axios.isAxiosError(error)) setToast(error?.response?.data);
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
        emailsPerPage={10}
      />
    ),
    starred: <Starred />,
    drafts: <Drafts />,
    sent: <Sent outbox={outbox} />,
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
              errorPattern={errors.from?.type === "pattern" && "Invalid email"}
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
                disabled={isSubmitting || isPending}
              >
                Send
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
