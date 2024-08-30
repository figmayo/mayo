import { useEffect, useState } from "react";
import { CollectionModes } from "../../_gen/types";
import { collection } from "../core/collection";

export function useCollection(collectionName: keyof CollectionModes) {
  const [, setMode] = useState<string>("");

  const c = collection(collectionName);
  useEffect(() => {
    const handleModeChange = (newMode: string) => {
      setMode(newMode);
    };

    // Set initial mode
    setMode(c.activeMode);

    // Subscribe to mode changes
    c.subscribe(handleModeChange);

    return () => {
      // Unsubscribe when the component unmounts
      c.unsubscribe(handleModeChange);
    };
  }, [c]);

  return c;
}
