import { create } from "zustand";
import { Mailbox } from "@types";
type EmailState = {
  mailbox: Mailbox;
  setMailbox: (mailbox: any) => void;
  getMailBox: (mailbox: any) => void;

  selectedItem: string;
  isOpen: boolean;
  setSelectedItem: (label: string) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const useEmailStore = create<EmailState>((set) => ({
  mailbox: {
    inbox: {
      items: [],
      totalCount: 0,
    },
    outbox: {
      items: [],
      totalCount: 0,
    },
    drafts: [],
    trash: [],
    pageSize: 0,
  },
  selectedItem: "inbox",
  isOpen: false,

  setMailbox: (newMailbox) =>
    set((state) => {
      const updatedMailbox = {
        ...state.mailbox,
        // ...newMailbox.emails,
        ...newMailbox,
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
