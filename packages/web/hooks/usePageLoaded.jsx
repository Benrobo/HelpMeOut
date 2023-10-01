import React, { useEffect, useState } from "react";

function usePageLoaded(count) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, count * 1000);
    // return clearTimeout(timeout);
  }, [loading]);
  return {
    pageLoaded: loading,
  };
}

export default usePageLoaded;
