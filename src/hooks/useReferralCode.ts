import { useEffect, useState } from "react";

export const useReferralCode = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      localStorage.setItem("referralCode", ref);
      setReferralCode(ref);
    } else {
      const stored = localStorage.getItem("referralCode");
      if (stored) setReferralCode(stored);
    }
  }, []);

  return referralCode;
};
