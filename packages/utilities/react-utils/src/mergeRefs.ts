import { MutableRefObject, Ref, RefCallback } from "react";

export const mergeRefs = <T extends HTMLElement>(
  ...refs: Ref<T | null>[]
): Ref<T> | RefCallback<T> => {
  return (node) => {
    const filtered = refs.filter(Boolean);

    return filtered.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };
};
