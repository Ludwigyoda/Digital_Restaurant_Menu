import { useEffect, useState } from "react";
import { getUpdateState, subscribeUpdateState } from "./pwa";

export function useUpdateState() {
  const [state, setState] = useState(() => getUpdateState());
  useEffect(() => subscribeUpdateState(setState), []);
  return state;
}
