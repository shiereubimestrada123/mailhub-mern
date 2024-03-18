import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormInput, Modal } from "@components";
import { Items } from "@types";
import { useMutation } from "@tanstack/react-query";
import { post, put } from "@utils";
import { useEmailStore, useAuthStore } from "@store";

import { useParams } from "react-router-dom";

type ComposeProps = {
  from: string;
  to: string;
  subject: string;
  message: string;
  _id: string;
};

type ReplyEmailModalProps = {
  selectedInbox: Items | null;
  setShowReplyModal: (showReplyModal: boolean) => void;
};

export function ReplyEmailModal({
  selectedInbox,
  setShowReplyModal,
}: ReplyEmailModalProps) {
  const userAccount = useAuthStore((state) => state.userAccount);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ComposeProps>({
    defaultValues: {
      from: userAccount.user?.email || "",
      // from:
      //   selectedInbox?.from === userAccount.user?.email
      //     ? selectedInbox.from
      //     : userAccount.user?.email,
      to:
        selectedInbox?.to === userAccount.user?.email
          ? selectedInbox.from
          : selectedInbox?.to,
      subject: "",
      message: "",
      _id: selectedInbox?._id || "",
    },
  });

  const initialSelectedDraft = useRef<Items | null>(selectedInbox);

  useEffect(() => {
    if (selectedInbox && selectedInbox !== initialSelectedDraft.current) {
      reset({
        from: userAccount.user?.email || "",
        to:
          selectedInbox?.to === userAccount.user?.email
            ? selectedInbox.from
            : selectedInbox?.to,
        subject: selectedInbox.subject || "",
        message: selectedInbox.message || "",
        _id: selectedInbox?._id || "",
      });
      initialSelectedDraft.current = selectedInbox;
    }
  }, [selectedInbox, userAccount, reset]);

  const onClose = () => {
    setShowReplyModal(false);
  };

  const onSubmit: SubmitHandler<ComposeProps> = async (data) => {
    console.log("onSubmit");
  };

  return (
    <Modal title="Reply message" onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-[420px] flex-col"
      >
        <input type="hidden" {...register("_id")} value={selectedInbox?._id} />
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
