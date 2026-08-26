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
        // console.log("1 - fetchData called:", slug);

    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/menu/${slug}`);
      const data = res?.data;
    //   console.log("API RESPONSE:", res.data);

      // Only accept a genuinely valid, non-empty object payload.
      // Reject: null, undefined, arrays, and empty objects ({}).
      // If the payload is invalid/empty, we simply do NOT call
      // setRestaurant — whatever was there before (last valid API data,
      // or the initial null) stays untouched. This guarantees:
      //   Valid API data > Last valid data > (MenuPro's) Default data
      const isValidPayload =
        data &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length > 0;

      if (isValidPayload) {
        setRestaurant(data);
 
      }
      // else: keep previous `restau` as-is (do nothing).
    } catch (err) {
      console.error("Load restaurant menu error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load restaurant menu."
      );
      // Intentionally NOT calling setRestaurant(null) or setRestaurant({})
      // here. A failed request must never erase previously loaded data
      // (or force MenuPro back to defaults if it already had real data).
    } finally {
      setLoading(false);
    }
  }, [])
 
  return {
    restau,
    loading,
    error,
    fetchData,
  };
};