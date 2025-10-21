import { createRef } from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamLists } from "./src/types/rootStackParamLists";

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamLists>>();
