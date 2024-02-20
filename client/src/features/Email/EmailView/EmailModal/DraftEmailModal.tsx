import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, FormInput, Modal } from "@components";
import { Items } from "@types";

type ComposeProps = {
  from: string;
  to: string;
  subject: string;
  message: string;
};

type DraftEmailModalProps = {
  onClose: () => void;
  selectedDraft: Items | null;
};

export function DraftEmailModal({
  onClose,
  selectedDraft,
}: DraftEmailModalProps) {
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
    },
  });

  useEffect(() => {
    if (selectedDraft) {
      reset({
        from: selectedDraft.from || "",
        to: selectedDraft.to || "",
        subject: selectedDraft.subject || "",
        message: selectedDraft.message || "",
      });
    }
  }, [selectedDraft, reset]);

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
