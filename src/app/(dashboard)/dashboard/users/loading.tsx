import LoadingState from "@/components/ui/loadingState";
import React from "react";

const UserLoading = () => {
  return (
    <LoadingState
      title="Loading Users"
      description="Preparing available user data"
    />
  );
};

export default UserLoading;
