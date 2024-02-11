import { create } from "zustand";
import produce from "immer";

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

  selectedItem: string;
  isOpen: boolean;
  setSelectedItem: (label: string) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const useEmailStore = create<EmailState>((set) => ({
  mailbox: {
    inbox: [],
    outbox: [],
    drafts: [],
    trash: [],
  },
  selectedItem: "inbox",
  isOpen: false,

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

  setSelectedItem: (label: string) => set({ selectedItem: label }),

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
