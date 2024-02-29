import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Modal, FormInput, Button } from "@components";
import { useAuthStore, useEmailStore } from "@store";
import { post } from "@utils";

type ComposeProps = {
  from: string;
  to: string;
  subject: string;
  message: string;
};

export function ComposeEmailModal() {
  const email = useAuthStore((state) => state.userAccount.user?.email);
  const setMailbox = useEmailStore((state) => state.setMailbox);
  const mailbox = useEmailStore((state) => state.mailbox);
  const setIsOpenCompose = useEmailStore((state) => state.setIsOpenCompose);

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

      setIsOpenCompose(false);
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
      setIsOpenCompose(false);
    }
  };

  const onClose = () => {
    const isNewEmail = true;

    if (isNewEmail) {
      const formData = watch();
      const defaultValues = {
        from: email,
        to: "",
        subject: "",
        message: "",
      };

      const isToChanged = formData.to !== defaultValues.to;
      const isSubjectChanged = formData.subject !== defaultValues.subject;
      const isMessageChanged = formData.message !== defaultValues.message;

      if (isToChanged || isSubjectChanged || isMessageChanged) {
        saveDraft(formData);
      }
    }

    setIsOpenCompose(false);
  };

  return (
    <>
      <Modal onClose={onClose}>
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
            errorRequired={errors.to?.type === "required" && errors.to?.message}
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
    </>
  );
}
