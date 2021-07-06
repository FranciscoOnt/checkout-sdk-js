/**
 * A set of stringified CSS to apply to Moneris' IFrame fields.
 * CSS attributes should be converted to string.
 * Please note that ClassNames are not supported.
 *
 * IE:
 * ```js
 * {
 *      cssBody: 'background:white;';
 *      cssTextbox: 'border-width:2px;';
 *      cssTextboxPan: 'width:140px;';
 *      cssTextboxExpiry: 'width:40px;';
 *      csstexboxCvd: 'width:40px;';
 * }
 * ```
 *
 * When using several attributes use semicolon to separate each one.
 * IE: 'background:white;width:40px;'
 */
export default interface MonerisStylingProps {
    /**
     * Stringified CSS to apply to the body of the IFrame.
     */
    cssBody?: string;
    /**
     * Stringified CSS to apply to each of input fields.
     */
    cssTextbox?: string;
    /**
     * Stringified CSS to apply to the card's number field.
     */
    cssTextboxPan?: string;
    /**
     * Stringified CSS to apply to the card's expiry field.
     */
    cssTextboxExpiry?: string;
    /**
     * Stringified CSS to apply to the card's CVV field.
     */
    cssTexboxCvd?: string;
}

/**
 * The format in which Moneris' IFrame event response is formatted and
 * sent to the payment strategy.
 */
export interface MonerisResponseData {
    responseCode: string[];
    dataKey: string;
    errorMessage: string;
    bin: string;
}
