import { LoadScriptOptions, ScriptLoader } from '@bigcommerce/script-loader';

import { PaymentMethodClientUnavailableError } from '../../errors';

import { Boltcheckout, BoltHostWindow } from './bolt';

export default class ChasePayScriptLoader {
    constructor(
        private _scriptLoader: ScriptLoader,
        public _window: BoltHostWindow = window
    ) {}

    load(publishableKey: string, testMode?: boolean): Promise<Boltcheckout> {
        const options: LoadScriptOptions = {
            async: true,
            attributes: {
                id: 'bolt-connect',
                'data-publishable-key': publishableKey,
            },
        };

        return this._scriptLoader
            .loadScript(`//connect${testMode ? '-sandbox' : ''}.bolt.com/connect-bigcommerce.js`, options)
            .then(() => {
                if (!this._window.Boltcheckout) {
                    throw new PaymentMethodClientUnavailableError();
                }

                return this._window.Boltcheckout;
            });
    }
}
