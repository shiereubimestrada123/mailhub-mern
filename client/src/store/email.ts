import { create } from "zustand";

type Mailbox<T> = {
  inbox: T[];
  outbox: T[];
  drafts: T[];
  trash: T[];
};
type EmailState = {
  mailbox: Mailbox<any>;

  setMailbox: (mailbox: any) => void;
  getMailBox: (mailbox: any) => void;
};

export const useEmailStore = create<EmailState>((set) => ({
  mailbox: {
    inbox: [],
    outbox: [],
    drafts: [],
    trash: [],
  },

  setMailbox: (newMailbox) =>
    set((state) => {
      const updatedMailbox = {
        ...state.mailbox,
        ...newMailbox.emails,
      };

      return { mailbox: updatedMailbox };
    }),

  getMailBox: (newMailbox) =>
    set((state) => {
      const updatedMailbox = {
        ...state.mailbox,
        ...newMailbox.emails,
      };

      return { mailbox: updatedMailbox };
    }),
}));
