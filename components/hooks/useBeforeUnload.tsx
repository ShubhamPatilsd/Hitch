import { useEffect } from "react";

// My hook simple reset session storage when user trigger a browser refresh

export default function useBeforeUnload(session) {
  useEffect(() => {
    const eventListener = (event) => {
      // you can do what you want here
      // sessionStorage.clear();
      session.user.id;
    };

    window.addEventListener("beforeunload", eventListener);

    return () => {
      window.removeEventListener("beforeunload", eventListener);
    };
  }, []);
}
