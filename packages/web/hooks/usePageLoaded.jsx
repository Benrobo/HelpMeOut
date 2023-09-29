import React, { useEffect, useState } from "react";

function usePageLoaded(count) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, count * 1000);
    // return clearTimeout(timeout);
  }, [loading]);
  return {
    pageLoaded: loading,
  };
}

export default usePageLoaded;
