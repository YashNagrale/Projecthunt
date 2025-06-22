import { useCallback, useState } from "react";
import { toast } from "sonner";

function useAsync<T, Args>(asyncFunction: (arg: Args) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (arg: Args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await asyncFunction(arg);
        setData(response);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          toast.error(error.message);
        } else {
          console.log("Some unknown error occured.");
          setError("Unkown error");
          toast.error("Unkown error");
        }
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, loading, error, execute };
}

export default useAsync;
