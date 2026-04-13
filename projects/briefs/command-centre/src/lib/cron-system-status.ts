import { getManagedCronRuntimeStatus } from "./cron-service";

export function getCronSystemStatus(localIdentifier?: string | null) {
  return getManagedCronRuntimeStatus(localIdentifier);
}
