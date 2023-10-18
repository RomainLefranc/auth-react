import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { UserAccount } from "../types/types";

export const useAccountStore = create(
  persist(
    combine(
      {
        account: undefined as undefined | null | UserAccount,
      },
      (set) => ({
        setAccount: (account: UserAccount | null) => set({ account }),
      })
    ),
    { name: "account" }
  )
);
