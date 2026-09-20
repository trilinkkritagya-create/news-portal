import { create } from "zustand";

interface DeleteModalData {
  articleId: string;
  articleTitle?: string;
}

interface DeleteModalStore {
  isOpen: boolean;
  articleId: string | null;
  articleTitle: string | null;
  isDeleting: boolean;

  openDeleteModal: (data: DeleteModalData) => void;
  closeDeleteModal: () => void;
  setDeleting: (value: boolean) => void;
}

const useDeleteModalStore = create<DeleteModalStore>((set) => ({
  isOpen: false,
  articleId: null,
  articleTitle: null,
  isDeleting: false,

  openDeleteModal: ({ articleId, articleTitle }) =>
    set({
      isOpen: true,
      articleId,
      articleTitle: articleTitle ?? null,
      isDeleting: false,
    }),

  closeDeleteModal: () =>
    set({
      isOpen: false,
      articleId: null,
      articleTitle: null,
      isDeleting: false,
    }),

  setDeleting: (value) =>
    set({
      isDeleting: value,
    }),
}));

export default useDeleteModalStore;
