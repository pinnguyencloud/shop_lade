import { useCallback } from "react";

function useResetForm(setFormData, defaultFormData) {
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
  }, [setFormData, defaultFormData]);

  return resetForm;
}

export default useResetForm;
