import { createRef } from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamLists } from "./src/types/type";

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamLists>>();
