export default interface BoltInitializeOptions {
  /**
   * When true, Bigcommerce's checkout will be used
   * otherwise Bolt's full checkout take over will be assumed
   */
  useClientScript?: boolean;
}
