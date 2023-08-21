
const setFlags = () => [FeatureFlagKeys.justPay].forEach(setFlag);
const setRecurringPaymentFlag = (value: boolean) => setFlag(FeatureFlagKeys.recurringPayments, value);
const setInternationalPaymentFlag = (value: boolean) =>
  setFlag(FeatureFlagKeys.isInternationalDeliveryMethodSupported, value);
const setInternationalRecurringPaymentFlag = (value: boolean) =>
  setFlag(FeatureFlagKeys.isInternationalSupportedForRecurringFlow, value);
const setIndustryRequiredFlag = (value: boolean) => setFlag(FeatureFlagKeys.shouldIndustryBePartOfLegalInfo, value);


export const setup = {
  setFlags,
  setRecurringPaymentFlag,
  setInternationalRecurringPaymentFlag,
  setIndustryRequiredFlag,
  setInternationalPaymentFlag,
};