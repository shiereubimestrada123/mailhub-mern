import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormInput, Modal } from "@components";
import { Items } from "@types";
import { useMutation } from "@tanstack/react-query";
import { put } from "@utils";
import { useEmailStore } from "@store";

type ComposeProps = {
  from: string;
  to: string;
  subject: string;
  message: string;
  _id: string;
};

type DraftEmailModalProps = {
  setSelectedDraft: (draft: Items | null) => void;
  selectedDraft: Items | null;
};

export function DraftEmailModal({
  setSelectedDraft,
  selectedDraft,
}: DraftEmailModalProps) {
  const navigate = useNavigate();

  const setMailbox = useEmailStore((state) => state.setMailbox);
  const mailbox = useEmailStore((state) => state.mailbox);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ComposeProps>({
    defaultValues: {
      from: selectedDraft?.from || "",
      to: selectedDraft?.to || "",
      subject: selectedDraft?.subject || "",
      message: selectedDraft?.message || "",
      _id: selectedDraft?._id || "",
    },
  });
  console.log("mailbox", mailbox);
  const initialSelectedDraft = useRef<Items | null>(selectedDraft);

  useEffect(() => {
    if (selectedDraft && selectedDraft !== initialSelectedDraft.current) {
      reset({
        from: selectedDraft.from || "",
        to: selectedDraft.to || "",
        subject: selectedDraft.subject || "",
        message: selectedDraft.message || "",
        _id: selectedDraft?._id || "",
      });
      initialSelectedDraft.current = selectedDraft;
    }
  }, [selectedDraft, reset]);

  const { mutateAsync: editDraft, isPending: isEditDraftPending } = useMutation(
    {
      mutationFn: async (newEmail) => {
        return await put(`/email/draft/${selectedDraft?._id}`, newEmail);
      },
    },
  );

  const onClose = async () => {
    const originalDraft = selectedDraft;
    const currentValues = watch();

    if (JSON.stringify(originalDraft) !== JSON.stringify(currentValues)) {
      try {
        await editDraft(currentValues as any);

        const updatedItems = mailbox.drafts.items.map((item: any) =>
          item._id === selectedDraft?._id ? currentValues : item,
        );

        setMailbox({
          ...mailbox,
          drafts: {
            ...mailbox.drafts,
            items: updatedItems,
          },
        });

        navigate("/email/drafts");
      } catch (error) {
        console.error("Error saving draft:", error);
      } finally {
        setSelectedDraft(null);
      }
    }

    setSelectedDraft(null);
  };

  const onSubmit: SubmitHandler<ComposeProps> = async (data) => {
    try {
      console.log("try");
      console.log("data", data);
    } catch (error: unknown) {
      console.log(error);
    } finally {
      // reset();
      // setIsOpenCompose(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-[420px] flex-col"
      >
        <input type="hidden" {...register("_id")} value={selectedDraft?._id} />
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
            disabled={isSubmitting}
          >
            Send
          </Button>
        </div>
      </form>
    </Modal>
  );
}
