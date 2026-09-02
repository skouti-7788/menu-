import { useState , useCallback} from "react";
import api from "./axios";

export const useData = () => {
  // `restau` starts as null. MenuPro.jsx already treats "no valid restau
  // yet" as "keep showing the default/demo data", so null here is safe —
  // it is NEVER used to blank out MenuPro's state, only to signal
  // "nothing from the API yet / last call failed".
  const [restau, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (slug) => {
    if (!slug) {
      setRestaurant(null);
      setError("Restaurant slug is missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/menu/${slug}`);
      const data = res?.data;
      const isValidPayload =
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length > 0;

      if (isValidPayload) {
        setRestaurant(data);
      } else {
        setRestaurant(null);
      }
    } catch (err) {
      console.error("Load restaurant menu error:", err);
      setRestaurant(null);
      setError(
        err.response?.data?.message ||
        "Unable to load restaurant menu."
      );
    } finally {
      setLoading(false);
    }
  }, []);
 
  return {
    restau,
    loading,
    error,
    fetchData,
  };
};