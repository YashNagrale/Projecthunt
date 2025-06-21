import {
  type TypedUseSelectorHook,
  useSelector,
  useDispatch,
} from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
