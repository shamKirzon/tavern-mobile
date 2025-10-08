import { createRef } from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamLists } from "./types/type";

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamLists>>();
