import { Connection, JsonRpcProvider } from "@mysten/sui.js";
import { environment } from "../environment/enviornment";

export const provider = new JsonRpcProvider(
  new Connection({
    fullnode: environment.sui.fullNode,
  })
);
