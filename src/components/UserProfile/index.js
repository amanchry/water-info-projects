import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function UserProfile({ show, setShow }) {
  const router = useRouter();

  useEffect(() => {
    if (show) {
      router.push("/manage-profile");
      setShow(false);
    }
  }, [show, router, setShow]);

  return null;
}

export default UserProfile;
