import { useMemo } from "react";

export const useInitials = (name: string) => {
  return useMemo(() => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).join("");
  }, [name]);
};