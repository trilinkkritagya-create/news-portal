"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useDeleteModalStore from "@/store/useDeleteModal";
import { deleteArticleAction } from "@/lib/actions/article/article.action";
import DeleteModel from "./DeleteModel";

export default function GlobalDeleteModal() {
  const {
    isOpen,
    articleId,
    articleTitle,
    isDeleting,
    closeDeleteModal,
    setDeleting,
  } = useDeleteModalStore();

  const router = useRouter();

  const handleDelete = async () => {
    if (!articleId) return;

    try {
      setDeleting(true);

      const result = await deleteArticleAction(articleId);

      if (!result.success) {
        toast.error(result.error?.message ?? "Failed to delete article.");
        return;
      }

      toast.success(result.message ?? "Article deleted successfully.");

      closeDeleteModal();

      router.refresh();
    } catch (error) {
      console.error("DELETE ARTICLE ERROR:", error);

      toast.error("Something went wrong while deleting the article.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;

    closeDeleteModal();
  };

  return (
    <DeleteModel
      open={isOpen}
      title="Delete Article"
      description="This action cannot be undone."
      itemName={articleTitle ?? undefined}
      onClose={handleClose}
      onConfirm={handleDelete}
      loading={isDeleting}
    />
  );
}
