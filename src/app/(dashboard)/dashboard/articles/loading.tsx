import LoadingState from "@/components/ui/loadingState";
import React from "react";

const ArticleLoading = () => {
  return (
    <LoadingState
      title="Loading Articles"
      description="Preparing the latest stories..."
    />
  );
};

export default ArticleLoading;
