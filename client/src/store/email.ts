import { create } from "zustand";
import { Mailbox } from "@types";

type EmailState = {
  mailbox: Mailbox;
  setMailbox: (mailbox: any) => void;
  getMailBox: (mailbox: any) => void;

  setSelectedItem: (label: string) => void;
  selectedItem: string;
  setIsOpenCompose: (isOpen: boolean) => void;
  isOpenCompose: boolean;
  setIsOpenDraft: (isOpen: boolean) => void;
  isOpenDraft: boolean;
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
    drafts: {
      items: [],
      totalCount: 0,
    },
    trash: [],
    pageSize: 0,
  },
  selectedItem: "inbox",
  isOpenCompose: false,
  isOpenDraft: false,

  setMailbox: (newMailbox) =>
    set((state) => {
      const updatedMailbox = {
        ...state.mailbox,
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

  setIsOpenCompose: (isOpen: boolean) => set({ isOpenCompose: isOpen }),

  setIsOpenDraft: (isOpen: boolean) => set({ isOpenDraft: isOpen }),
}));
