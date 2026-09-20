import LoadingState from "@/components/ui/loadingState";
import React from "react";

const CommentLoading = () => {
  return (
    <LoadingState
      title="Loading comments"
      description="Preparing ahh comments per articles"
    />
  );
};

export default CommentLoading;
