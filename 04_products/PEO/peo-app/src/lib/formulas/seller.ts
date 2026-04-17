import type { SellerInputs, SellerOutputs } from "./types";

export function calculateSellerNet(inputs: SellerInputs): SellerOutputs {
  const saleCosts = inputs.expectedSalePrice * inputs.saleCostRate;
  const netBeforePayoff =
    inputs.expectedSalePrice - saleCosts - inputs.prepCosts - inputs.concessions;
  const netProceeds = netBeforePayoff - inputs.mortgagePayoff;

  return {
    netProceeds: Number(netProceeds.toFixed(2)),
    saleCosts: Number(saleCosts.toFixed(2)),
    netBeforePayoff: Number(netBeforePayoff.toFixed(2)),
  };
}
