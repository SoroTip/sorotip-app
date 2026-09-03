import { SoroTipClient, type SoroTipNetwork } from "@sorotip/sdk";

/** Whether a SoroTip contract has been configured for this deployment. */
export const isContractConfigured = Boolean(process.env.NEXT_PUBLIC_CONTRACT_ID);

const network = (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet") as SoroTipNetwork;
const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID ?? "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

/**
 * The app-wide {@link SoroTipClient} instance, configured from
 * `NEXT_PUBLIC_STELLAR_NETWORK` / `NEXT_PUBLIC_CONTRACT_ID` / `NEXT_PUBLIC_RPC_URL`.
 *
 * `null` when `NEXT_PUBLIC_CONTRACT_ID` hasn't been set yet (e.g. a fresh
 * clone before a contract has been deployed) — check {@link isContractConfigured}
 * before rendering anything that depends on this being non-null.
 */
export const sorotipClient: SoroTipClient | null = isContractConfigured
  ? new SoroTipClient({ network, contractId, rpcUrl })
  : null;
