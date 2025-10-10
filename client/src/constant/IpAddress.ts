import Constants from "expo-constants";
import { PORT } from "@env";
const manifest = Constants.manifest ?? Constants.expoConfig;
const debuggerHost = manifest?.hostUri ?? "";

let IP_ADDRESS = "";
if (
  typeof window !== "undefined" &&
  window.location &&
  window.location.hostname
) {
  IP_ADDRESS = `http://${window.location.hostname}:${PORT}`;
} else if (debuggerHost) {
  const ip = debuggerHost.split(":")[0];
  IP_ADDRESS = `http://${ip}:${PORT}`;
} else {
  IP_ADDRESS = `ws://localhost:${PORT}`;
}

export default IP_ADDRESS;
