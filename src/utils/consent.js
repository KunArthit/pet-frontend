export const getConsent = () => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) return null;
  
    try {
      return JSON.parse(consent);
    } catch {
      return null;
    }
  };
  
  export const hasAccepted = () => {
    const consent = getConsent();
    return consent?.type === "accept";
  };