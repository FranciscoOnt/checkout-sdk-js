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

export interface MoneriesHostedFieldsQueryParams {
    id: string;
    pmmsg: boolean;
    css_body: string;
    css_textbox: string;
    css_textbox_pan: string;
    enable_exp: number;
    css_textbox_exp: string;
    enable_cvd: number;
    css_textbox_cvd: string;
    display_labels: number;
    pan_label: string;
    exp_label: string;
    cvd_label: string;
}

export interface MonerisResponseData {
    responseCode: string[];
    dataKey: string;
    errorMessage: string;
    bin: string;
}

export interface MonerisInitializationData {
    profileId: string;
    creditCardLabel?: string;
    expiryDateLabel?: string;
    cvdLabel?: string;
}
