module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=171)}({0:function(t,e){t.exports=require("tslib")},11:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r,i=n(0),a=n(22);!function(t){t[t.MissingBillingAddress=0]="MissingBillingAddress",t[t.MissingCart=1]="MissingCart",t[t.MissingCheckout=2]="MissingCheckout",t[t.MissingConsignments=3]="MissingConsignments",t[t.MissingCheckoutConfig=4]="MissingCheckoutConfig",t[t.MissingOrder=5]="MissingOrder",t[t.MissingOrderConfig=6]="MissingOrderConfig",t[t.MissingOrderId=7]="MissingOrderId",t[t.MissingPayment=8]="MissingPayment",t[t.MissingPaymentInstrument=9]="MissingPaymentInstrument",t[t.MissingPaymentMethod=10]="MissingPaymentMethod",t[t.MissingPaymentToken=11]="MissingPaymentToken",t[t.MissingShippingAddress=12]="MissingShippingAddress"}(r||(r={}));var o=function(t){function e(e){var n=t.call(this,function(t){switch(t){case r.MissingBillingAddress:return"Unable to proceed because billing address data is unavailable.";case r.MissingCart:return"Unable to proceed because cart data is unavailable.";case r.MissingConsignments:return"Unable to proceed because consignments data is unavailable.";case r.MissingCheckout:return"Unable to proceed because checkout data is unavailable.";case r.MissingCheckoutConfig:case r.MissingOrderConfig:return"Unable to proceed because configuration data is unavailable.";case r.MissingOrder:return"Unable to proceed because order data is unavailable.";case r.MissingOrderId:return"Unable to proceed because order ID is unavailable or not generated yet.";case r.MissingPayment:return"Unable to proceed because payment data is unavailable.";case r.MissingPaymentToken:return"Unable to proceed because the token required to submit a payment is missing.";case r.MissingPaymentMethod:return"Unable to proceed because payment method data is unavailable or not properly configured.";case r.MissingShippingAddress:return"Unable to proceed because shipping address data is unavailable.";default:return"Unable to proceed because the required data is unavailable."}}(e))||this;return n.subtype=e,n.name="MissingDataError",n.type="missing_data",n}return Object(i.__extends)(e,t),e}(a.a);e.b=o},119:function(t,e,n){"use strict";var r=n(0),i=n(2),a=n(54),o=n(87),s=n(11),u=n(85),c=n(92),d=n(93),p=n(86),l=n(69),m=n(37),f=function(){function t(){this._cardExpiryFormatter=new c.a,this._cardNumberFormatter=new d.a}return t.prototype.transform=function(t,e){var n=e.billingAddress.getBillingAddress(),c=e.checkout.getCheckout(),d=e.customer.getCustomer(),f=e.order.getOrder(),h=e.paymentMethods.getPaymentMethod(t.methodId,t.gatewayId),g=e.shippingAddress.getShippingAddress(),_=e.consignments.getConsignments(),y=e.consignments.getShippingOption(),b=e.config.getStoreConfig(),v=e.config.getContextConfig(),C=e.instruments.getInstrumentsMeta(),O=e.paymentMethods.getPaymentMethodsMeta(),I=e.order.getOrderMeta(),j=d&&n&&Object(u.a)(d,n),E=C&&t.paymentData&&(Object(m.a)(t.paymentData)||Object(m.b)(t.paymentData))?e.payment.getPaymentToken()+", "+C.vaultAccessToken:e.payment.getPaymentToken();if(!E)throw new s.b(s.a.MissingPaymentToken);return{authToken:E,paymentMethod:h&&this._transformPaymentMethod(h),customer:j,billingAddress:n&&Object(a.a)(n),shippingAddress:g&&Object(a.a)(g,_),shippingOption:y&&Object(l.a)(y,!0),cart:c&&Object(o.a)(c),order:f&&Object(p.a)(f,I),orderMeta:I,payment:t.paymentData,quoteMeta:{request:Object(r.__assign)(Object(r.__assign)({},O),{geoCountryCode:v&&v.geoCountryCode})},source:"bigcommerce-checkout-js-sdk",store:Object(i.pick)(b&&b.storeProfile,["storeHash","storeId","storeLanguage","storeName"])}},t.prototype.transformWithHostedFormData=function(t,e){var n=e.authToken,s=e.checkout,c=e.config,d=e.order,m=e.orderMeta,f=e.payment,h=void 0===f?{}:f,g=e.paymentMethod,_=e.paymentMethodMeta,y=s&&s.consignments[0],b=y&&y.shippingAddress,v=y&&y.selectedShippingOption;return{authToken:n,paymentMethod:g&&this._transformPaymentMethod(g),customer:d&&d.billingAddress&&s&&Object(u.a)(s.customer,d.billingAddress),billingAddress:d&&d.billingAddress&&Object(a.a)(d.billingAddress),shippingAddress:b&&s&&Object(a.a)(b,s.consignments),shippingOption:v&&Object(l.a)(v,!0),cart:s&&Object(o.a)(s),order:d&&Object(p.a)(d,m),orderMeta:m,payment:this._transformHostedInputValues(t,h),quoteMeta:{request:Object(r.__assign)(Object(r.__assign)({},_),{geoCountryCode:c&&c.context.geoCountryCode})},source:"bigcommerce-checkout-js-sdk",store:c&&Object(i.pick)(c.storeConfig.storeProfile,["storeHash","storeId","storeLanguage","storeName"])}},t.prototype._transformPaymentMethod=function(t){return"multi-option"!==t.method||t.gateway?t.initializationData&&t.initializationData.gateway?Object(r.__assign)(Object(r.__assign)({},t),{id:t.initializationData.gateway}):t:Object(r.__assign)(Object(r.__assign)({},t),{gateway:t.id})},t.prototype._transformHostedInputValues=function(t,e){return"instrumentId"in e?Object(r.__assign)(Object(r.__assign)({},e),{ccCvv:t.cardCodeVerification,ccNumber:t.cardNumberVerification&&this._cardNumberFormatter.unformat(t.cardNumberVerification)}):Object(r.__assign)(Object(r.__assign)({},e),{ccCvv:t.cardCode,ccExpiry:this._cardExpiryFormatter.toObject(t.cardExpiry||""),ccName:t.cardName||"",ccNumber:this._cardNumberFormatter.unformat(t.cardNumber||"")})},t}();e.a=f},120:function(t,e,n){"use strict";var r=function(){function t(t){this._client=t}return t.prototype.submitPayment=function(t){var e=this;return new Promise((function(n,r){e._client.submitPayment(t,(function(t,i){t?r(e._transformResponse(t)):n(e._transformResponse(i))}))}))},t.prototype.initializeOffsitePayment=function(t,e){var n=this;return new Promise((function(){n._client.initializeOffsitePayment(t,null,e)}))},t.prototype._transformResponse=function(t){return{headers:t.headers,body:t.data,status:t.status,statusText:t.statusText}},t}();e.a=r},133:function(t,e,n){"use strict";function r(t){return{code:t.code,discountedAmount:t.used,remainingBalance:t.remaining,giftCertificate:{balance:t.balance,code:t.code,purchaseDate:t.purchaseDate}}}n.d(e,"a",(function(){return r}))},134:function(t,e,n){"use strict";var r=n(3),i=n(8),a=n(73),o=n(49),s=function(){function t(t,e){this._targetWindow=e,this._targetOrigin="*"===t?"*":Object(a.a)(t).origin}return t.prototype.post=function(t,e){var n=this;if(window!==this._targetWindow){if(!this._targetWindow)throw new Error("Unable to post message because target window is not set.");var a=e&&Object(r.fromEvent)(window,"message").pipe(Object(i.filter)((function(t){return t.origin===n._targetOrigin&&Object(o.a)(t.data,t.data.type)&&-1!==[e.successType,e.errorType].indexOf(t.data.type)})),Object(i.map)((function(t){if(e.errorType===t.data.type)throw t.data;return t.data})),Object(i.take)(1)).toPromise();return this._targetWindow.postMessage(t,this._targetOrigin),a}},t.prototype.setTarget=function(t){this._targetWindow=t},t}();e.a=s},135:function(t,e,n){"use strict";var r=n(0),i=n(73),a=n(84),o=n(49),s=function(){function t(t){this._sourceOrigin=Object(i.a)(t).origin,this._isListening=!1,this._listeners={}}return t.prototype.listen=function(){this._isListening||(this._isListening=!0,window.addEventListener("message",this._handleMessage))},t.prototype.stopListen=function(){this._isListening&&(this._isListening=!1,window.removeEventListener("message",this._handleMessage))},t.prototype.addListener=function(t,e){var n=this._listeners[t];n||(this._listeners[t]=n=[]),-1===n.indexOf(e)&&n.push(e)},t.prototype.removeListener=function(t,e){var n=this._listeners[t];if(n){var r=n.indexOf(e);r>=0&&n.splice(r,1)}},t.prototype.trigger=function(t){var e=this._listeners[t.type];e&&e.forEach((function(e){return e(t)}))},t.prototype._handleMessage=function(t){t.origin===this._sourceOrigin&&Object(o.a)(t.data,t.data.type)&&this.trigger(t.data)},Object(r.__decorate)([a.a],t.prototype,"_handleMessage",null),t}();e.a=s},163:function(t,e,n){"use strict";var r=n(0),i=function(t){function e(e){var n=t.call(this,e||"Unable to proceed due to invalid configuration provided for the hosted payment form.")||this;return n.name="InvalidHostedFormConfigError",n.type="invalid_hosted_form_config",n}return Object(r.__extends)(e,t),e}(n(22).a);e.a=i},164:function(t,e,n){"use strict";var r=n(0),i=n(2),a=function(t){function e(e){var n=t.call(this,Object(r.__spreadArrays)(["Unable to proceed due to invalid user input values"],Object(i.flatMap)(Object(i.values)(e),(function(t){return Object(i.map)(t,(function(t){return t.message}))}))).join(". "))||this;return n.errors=e,n.name="InvalidHostedFormValueError",n.type="invalid_hosted_form_value",n}return Object(r.__extends)(e,t),e}(n(22).a);e.a=a},171:function(t,e,n){"use strict";n.r(e);var r,i=n(135),a=n(89),o=n(134),s=n(120),u=n(119);!function(t){t.CardCode="cardCode",t.CardCodeVerification="cardCodeVerification",t.CardExpiry="cardExpiry",t.CardName="cardName",t.CardNumber="cardNumber",t.CardNumberVerification="cardNumberVerification"}(r||(r={}));var c=r,d=n(92),p=n(93),l=n(2),m=n(163);function f(t){switch(t){case c.CardCode:return"cc-csc";case c.CardExpiry:return"cc-exp";case c.CardName:return"cc-name";case c.CardNumber:return"cc-number";default:return""}}var h=function(){function t(t,e,n){var r=this;this._containerId=t,this._fieldTypes=e,this._inputAggregator=n,this._handleChange=function(t){var e=t.target;if(!e)throw new Error("Unable to get a reference to the target of the change event.");var n=r._inputAggregator.getInputs().find((function(t){return r._getAutocompleteElementId(t.getType())===e.id}));n&&n.setValue(e.value)},this._inputs=this._fieldTypes.map((function(t){return r._createInput(t)}))}return t.prototype.attach=function(){var t=document.getElementById(this._containerId);if(!t)throw new m.a("Unable to proceed because the provided container ID is not valid.");this._inputs.forEach((function(e){return t.appendChild(e)}))},t.prototype.detach=function(){this._inputs.forEach((function(t){t.parentElement&&t.parentElement.removeChild(t)}))},t.prototype._createInput=function(t){var e=document.createElement("input");return e.autocomplete=f(t),e.id=this._getAutocompleteElementId(t),e.tabIndex=-1,e.style.position="absolute",e.style.opacity="0",e.style.zIndex="-1",e.addEventListener("change",this._handleChange),e},t.prototype._getAutocompleteElementId=function(t){return"autocomplete-"+Object(l.kebabCase)(t)},t}(),g=n(0),_=n(73),y=n(63),b=n(45),v=function(){function t(t,e,n,r,i,a,o,s,u,c,d,p){var l=this;this._type=t,this._containerId=e,this._placeholder=n,this._accessibilityLabel=r,this._autocomplete=i,this._styles=a,this._fontUrls=o,this._eventListener=s,this._eventPoster=u,this._inputAggregator=c,this._inputValidator=d,this._paymentHandler=p,this._isTouched=!1,this._handleInput=function(t){var e=t.target;l._processChange(e.value)},this._handleBlur=function(){l._applyStyles(l._styles.default),l._validateForm(),l._eventPoster.post({type:b.a.Blurred,payload:{fieldType:l._type}})},this._handleFocus=function(){l._applyStyles(l._styles.focus),l._eventPoster.post({type:b.a.Focused,payload:{fieldType:l._type}})},this._handleValidate=function(){l._validateForm()},this._input=document.createElement("input"),this._input.addEventListener("input",this._handleInput),this._input.addEventListener("blur",this._handleBlur),this._input.addEventListener("focus",this._handleFocus),this._eventListener.addListener(y.a.ValidateRequested,this._handleValidate),this._eventListener.addListener(y.a.SubmitRequested,this._paymentHandler.handle),this._configureInput()}return t.prototype.getType=function(){return this._type},t.prototype.getValue=function(){return this._input.value},t.prototype.setValue=function(t){this._processChange(t)},t.prototype.isTouched=function(){return this._isTouched},t.prototype.attach=function(){var t=document.getElementById(this._containerId);if(!t)throw new m.a("Unable to proceed because the provided container ID is not valid.");t.appendChild(this._input),this._loadFonts(),this._eventPoster.setTarget(window.parent),this._eventListener.listen(),window.hostedInput=this,this._eventPoster.post({type:b.a.AttachSucceeded})},t.prototype.detach=function(){this._input.parentElement&&this._input.parentElement.removeChild(this._input),this._unloadFonts(),this._eventListener.stopListen()},t.prototype._formatValue=function(t){this._input.value=t},t.prototype._notifyChange=function(t){this._eventPoster.post({type:b.a.Changed,payload:{fieldType:this._type}})},t.prototype._configureInput=function(){this._input.style.backgroundColor="transparent",this._input.style.border="0",this._input.style.display="block",this._input.style.height="100%",this._input.style.margin="0",this._input.style.outline="none",this._input.style.padding="0",this._input.style.width="100%",this._input.id=Object(l.kebabCase)(this._type),this._input.placeholder=this._placeholder,this._input.autocomplete=this._autocomplete,this._input.setAttribute("aria-label",this._accessibilityLabel),this._applyStyles(this._styles.default)},t.prototype._applyStyles=function(t){var e=this;void 0===t&&(t={});var n={color:t.color,fontFamily:t.fontFamily,fontSize:t.fontSize,fontWeight:t.fontWeight};Object.keys(n).forEach((function(t){n[t]&&(e._input.style[t]=n[t]||"")}))},t.prototype._loadFonts=function(){this._fontLinks||(this._fontLinks=this._fontUrls.filter((function(t){return"fonts.googleapis.com"===Object(_.a)(t).hostname})).filter((function(t){return!document.querySelector("link[href='"+t+"'][rel='stylesheet']")})).map((function(t){var e=document.createElement("link");return e.rel="stylesheet",e.href=t,document.head.appendChild(e),e})))},t.prototype._unloadFonts=function(){this._fontLinks&&(this._fontLinks.forEach((function(t){t.parentElement&&t.parentElement.removeChild(t)})),this._fontLinks=void 0)},t.prototype._validateForm=function(){return Object(g.__awaiter)(this,void 0,void 0,(function(){var t,e;return Object(g.__generator)(this,(function(n){switch(n.label){case 0:return t=this._inputAggregator.getInputValues(),[4,this._inputValidator.validate(t)];case 1:return(e=n.sent()).isValid?this._applyStyles(this._styles.default):this._applyStyles(this._styles.error),this._eventPoster.post({type:b.a.Validated,payload:e}),[2]}}))}))},t.prototype._processChange=function(t){t!==this._previousValue&&(this._isTouched=!0,this._validateForm(),this._formatValue(t),this._notifyChange(t),this._previousValue=t)},t}(),C=function(t){function e(e,n,r,i,a,o,s,u,d,p,l,m){var f=t.call(this,c.CardExpiry,e,n,r,i,a,o,s,u,d,p,l)||this;return f._formatter=m,f}return Object(g.__extends)(e,t),e.prototype._formatValue=function(t){this._input.value=this._formatter.format(t)},e}(v),O=n(28),I=function(t){function e(e,n,r,i,a,o,s,u,d,p,l,m,f){var h=t.call(this,c.CardNumber,e,n,r,i,a,o,s,u,d,p,l)||this;return h._autocompleteFieldset=m,h._formatter=f,h}return Object(g.__extends)(e,t),e.prototype.attach=function(){t.prototype.attach.call(this),this._autocompleteFieldset.attach()},e.prototype._notifyChange=function(t){var e=Object(O.number)(t).card,n=this._previousValue&&Object(O.number)(this._previousValue).card;Object(l.get)(n,"type")!==Object(l.get)(e,"type")&&this._eventPoster.post({type:b.a.CardTypeChanged,payload:{cardType:e?e.type:void 0}});var r=t.length>=6&&Object(O.number)(t).isPotentiallyValid?t.substr(0,6):"";r!==(this._previousValue&&this._previousValue.length>=6?this._previousValue.substr(0,6):"")&&this._eventPoster.post({type:b.a.BinChanged,payload:{bin:r}})},e.prototype._formatValue=function(t){var e=this._input.selectionEnd,n=this._formatter.format(t);e===t.length&&t.length<n.length?this._input.setSelectionRange(n.length,n.length):this._input.setSelectionRange(e||0,e||0),this._input.value=n},e}(v),j=function(){function t(t){this._parentWindow=t}return t.prototype.getInputs=function(t){return Array.prototype.slice.call(this._parentWindow.frames).reduce((function(e,n){try{var r=n.hostedInput;return!r||t&&!t(r)?e:Object(g.__spreadArrays)(e,[r])}catch(t){if(t instanceof DOMException)return e;throw t}}),[])},t.prototype.getInputValues=function(t){return this.getInputs(t).reduce((function(t,e){var n;return Object(g.__assign)(Object(g.__assign)({},t),((n={})[e.getType()]=e.getValue(),n))}),{})},t}(),E=n(164),w=function(){function t(t,e,n,r,i){var a=this;this._inputAggregator=t,this._inputValidator=e,this._eventPoster=n,this._paymentRequestSender=r,this._paymentRequestTransformer=i,this.handle=function(t){var e=t.payload.data;return Object(g.__awaiter)(a,void 0,void 0,(function(){var t,n,r,i;return Object(g.__generator)(this,(function(a){switch(a.label){case 0:return t=this._inputAggregator.getInputValues(),[4,this._inputValidator.validate(t)];case 1:if(n=a.sent(),this._eventPoster.post({type:b.a.Validated,payload:n}),!n.isValid)return r=new E.a(n.errors),[2,this._eventPoster.post({type:b.a.SubmitFailed,payload:{error:{code:Object(l.snakeCase)(r.name),message:r.message}}})];a.label=2;case 2:return a.trys.push([2,4,,5]),[4,this._paymentRequestSender.submitPayment(this._paymentRequestTransformer.transformWithHostedFormData(t,e))];case 3:return a.sent(),this._eventPoster.post({type:b.a.SubmitSucceeded}),[3,5];case 4:return i=a.sent(),this._eventPoster.post({type:b.a.SubmitFailed,payload:this._isPaymentErrorResponse(i)?{error:i.body.errors[0],response:i}:{error:{code:Object(l.snakeCase)(i.name),message:i.message}}}),[3,5];case 5:return[2]}}))}))}}return t.prototype._isPaymentErrorResponse=function(t){var e=(t||{}).body,n=(void 0===e?{}:e).errors,r=void 0===n?[]:n;return"string"==typeof(r[0]&&r[0].code)&&"string"==typeof(r[0]&&r[0].message)},t}(),T=n(74),A=function(){function t(t){this._cardInstrument=t,this._configureCardValidator()}return t.prototype.validate=function(t){return Object(g.__awaiter)(this,void 0,void 0,(function(){var e,n,r,i;return Object(g.__generator)(this,(function(a){switch(a.label){case 0:e=Object.keys(t),n={},r={errors:{},isValid:!0},Object(l.includes)(e,c.CardCode)&&(n.cardCode=this._getCardCodeSchema(),r.errors.cardCode=[]),Object(l.includes)(e,c.CardCodeVerification)&&(n.cardCodeVerification=this._getCardCodeVerificationSchema(),r.errors.cardCodeVerification=[]),Object(l.includes)(e,c.CardExpiry)&&(n.cardExpiry=this._getCardExpirySchema(),r.errors.cardExpiry=[]),Object(l.includes)(e,c.CardName)&&(n.cardName=this._getCardNameSchema(),r.errors.cardName=[]),Object(l.includes)(e,c.CardNumber)&&(n.cardNumber=this._getCardNumberSchema(),r.errors.cardNumber=[]),Object(l.includes)(e,c.CardNumberVerification)&&(n.cardNumberVerification=this._getCardNumberVerificationSchema(),r.errors.cardNumberVerification=[]),a.label=1;case 1:return a.trys.push([1,3,,4]),[4,Object(T.object)(n).validate(t,{abortEarly:!1})];case 2:return a.sent(),[2,r];case 3:if("ValidationError"!==(i=a.sent()).name)throw i;return[2,{errors:Object.keys(r.errors).reduce((function(t,e){var n;return Object(g.__assign)(Object(g.__assign)({},t),((n={})[e]=i.inner.filter((function(t){return t.path===e})).map((function(t){return{fieldType:t.path,message:t.errors.join(" "),type:t.type}})),n))}),{}),isValid:!1}];case 4:return[2]}}))}))},t.prototype._configureCardValidator=function(){var t=O.creditCardType.getTypeInfo("discover"),e=O.creditCardType.getTypeInfo("visa");O.creditCardType.updateCard("visa",{lengths:Object(g.__spreadArrays)([13],e.lengths||[])}),O.creditCardType.updateCard("discover",{patterns:Object(g.__spreadArrays)(t.patterns||[],[[810,817]])})},t.prototype._getCardCodeSchema=function(){return Object(T.string)().required("CVV is required").test({message:"CVV must be valid",name:"invalid_card_code",test:function(t){var e=Object(O.number)(this.parent.cardNumber||"").card;return Object(O.cvv)(t,e&&e.code?e.code.size:void 0).isValid}})},t.prototype._getCardCodeVerificationSchema=function(){var t=this;return Object(T.string)().required("CVV is required").test({message:"CVV must be valid",name:"invalid_card_code",test:function(e){void 0===e&&(e="");var n=t._cardInstrument&&t._mapFromInstrumentCardType(t._cardInstrument.brand),r=n&&O.creditCardType.getTypeInfo(n);return Object(O.cvv)(e,r&&r.code?r.code.size:void 0).isValid}})},t.prototype._getCardExpirySchema=function(){return Object(T.string)().required("Expiration date is required").test({message:"Expiration date must be a valid future date in MM / YY format",name:"invalid_card_expiry",test:function(t){return Object(O.expirationDate)(t).isValid}})},t.prototype._getCardNameSchema=function(){return Object(T.string)().max(200).required("Full name is required")},t.prototype._getCardNumberSchema=function(){return Object(T.string)().required("Credit card number is required").test({message:"Credit card number must be valid",name:"invalid_card_number",test:function(t){return Object(O.number)(t).isValid}})},t.prototype._getCardNumberVerificationSchema=function(){var t=this;return Object(T.string)().required("Credit card number is required").test({message:"Credit card number must be valid",name:"invalid_card_number",test:function(t){return void 0===t&&(t=""),Object(O.number)(t).isValid}}).test({message:"The card number entered does not match the card stored in your account",name:"mismatched_card_number",test:function(e){return void 0===e&&(e=""),!!t._cardInstrument&&e.slice(-t._cardInstrument.last4.length)===t._cardInstrument.last4}})},t.prototype._mapFromInstrumentCardType=function(t){switch(t){case"amex":case"american_express":return"american-express";case"diners":return"diners-club";default:return t}},t}();var P=function(){function t(t){this._parentOrigin=t}return t.prototype.create=function(t,e,n,r,i,a,o){void 0===n&&(n={}),void 0===r&&(r=[]),void 0===i&&(i=""),void 0===a&&(a=function(t){switch(t){case c.CardCode:case c.CardCodeVerification:return"CVC";case c.CardExpiry:return"Expiration";case c.CardName:return"Name on card";case c.CardNumber:case c.CardNumberVerification:return"Credit card number"}}(e));var s=f(e);return e===c.CardNumber?this._createNumberInput(t,n,r,i,a,s):e===c.CardNumberVerification?this._createNumberInput(t,n,r,i,a,s,o):e===c.CardExpiry?this._createExpiryInput(t,n,r,i,a,s):e===c.CardCodeVerification?this._createInput(e,t,n,r,i,a,s,o):this._createInput(e,t,n,r,i,a,s)},t.prototype._createExpiryInput=function(t,e,n,r,a,s){return void 0===a&&(a=""),void 0===s&&(s=""),new C(t,r,a,s,e,n,new i.a(this._parentOrigin),new o.a(this._parentOrigin,window.parent),new j(window.parent),new A,this._createPaymentHandler(),new d.a)},t.prototype._createNumberInput=function(t,e,n,r,a,s,u){return void 0===a&&(a=""),void 0===s&&(s=""),new I(t,r,a,s,e,n,new i.a(this._parentOrigin),new o.a(this._parentOrigin,window.parent),new j(window.parent),new A(u),this._createPaymentHandler(u),new h(t,[c.CardCode,c.CardExpiry,c.CardName],new j(window.parent)),new p.a)},t.prototype._createInput=function(t,e,n,r,a,s,u,c){return void 0===s&&(s=""),void 0===u&&(u=""),new v(t,e,a,s,u,n,r,new i.a(this._parentOrigin),new o.a(this._parentOrigin,window.parent),new j(window.parent),new A(c),this._createPaymentHandler(c))},t.prototype._createPaymentHandler=function(t){return new w(new j(window.parent),new A(t),new o.a(this._parentOrigin,window.parent),new s.a(Object(a.createClient)()),new u.a)},t}(),x=n(3),M=n(8),N=function(){function t(t,e){this._factory=t,this._eventListener=e}return t.prototype.initialize=function(t){var e=this;return this._resetPageStyles(t),this._eventListener.listen(),Object(x.fromEvent)(this._eventListener,y.a.AttachRequested).pipe(Object(M.map)((function(n){var r=n.payload,i=r.accessibilityLabel,a=r.cardInstrument,o=r.fontUrls,s=r.placeholder,u=r.styles,c=r.type,d=e._factory.create(t,c,u,o,s,i,a);return d.attach(),d})),Object(M.take)(1)).toPromise()},t.prototype._resetPageStyles=function(t){[document.querySelector("html"),document.querySelector("body"),document.getElementById(t)].forEach((function(t){t&&(t.style.height="100%",t.style.width="100%",t.style.overflow="hidden",t.style.padding="0",t.style.margin="0")}))},t}();function S(t){var e=t.containerId,n=t.parentOrigin;return new N(new P(n),new i.a(n)).initialize(e)}var D=new o.a("*",window.parent);function V(t){D.post({type:b.a.AttachFailed,payload:{error:t}})}n.d(e,"initializeHostedInput",(function(){return S})),n.d(e,"notifyInitializeError",(function(){return V}))},2:function(t,e){t.exports=require("lodash")},22:function(t,e,n){"use strict";var r=n(0);var i=function(t){function e(e){var n,r,i=this.constructor,a=t.call(this,e||"An unexpected error has occurred.")||this;return a.name="StandardError",a.type="standard",n=a,r=i.prototype,Object.setPrototypeOf?Object.setPrototypeOf(n,r):n.__proto__=r,"function"==typeof Error.captureStackTrace?Error.captureStackTrace(a,i):a.stack=new Error(a.message).stack,a}return Object(r.__extends)(e,t),e}(Error);e.a=i},28:function(t,e){t.exports=require("card-validator")},3:function(t,e){t.exports=require("rxjs")},37:function(t,e,n){"use strict";function r(t){return Boolean(t.instrumentId)}function i(t){return Boolean(t.instrumentId)&&!t.hasOwnProperty("ccNumber")&&!t.hasOwnProperty("ccCvv")}function a(t){var e=t.formattedPayload;return!!e&&("string"==typeof e.bigpay_token||Boolean(e.bigpay_token&&e.bigpay_token.token))}n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return a}))},45:function(t,e,n){"use strict";var r;n.d(e,"a",(function(){return r})),function(t){t.AttachSucceeded="HOSTED_INPUT:ATTACH_SUCCEEDED",t.AttachFailed="HOSTED_INPUT:ATTACH_FAILED",t.BinChanged="HOSTED_INPUT:BIN_CHANGED",t.Blurred="HOSTED_INPUT:BLURRED",t.Changed="HOSTED_INPUT:CHANGED",t.CardTypeChanged="HOSTED_INPUT:CARD_TYPE_CHANGED",t.Focused="HOSTED_INPUT:FOCUSED",t.SubmitSucceeded="HOSTED_INPUT:SUBMIT_SUCCEEDED",t.SubmitFailed="HOSTED_INPUT:SUBMIT_FAILED",t.Validated="HOSTED_INPUT:VALIDATED"}(r||(r={}))},49:function(t,e,n){"use strict";function r(t,e){return t.type===e}n.d(e,"a",(function(){return r}))},50:function(t,e,n){"use strict";var r=n(0),i=function(t){function e(e){var n=t.call(this,e||"Invalid arguments have been provided.")||this;return n.name="InvalidArgumentError",n.type="invalid_argument",n}return Object(r.__extends)(e,t),e}(n(22).a);e.a=i},53:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return i}));var r="PAYMENT_TYPE_HOSTED",i="PAYMENT_TYPE_OFFLINE"},54:function(t,e,n){"use strict";function r(t,e){var n;return!function(t){return void 0!==t.id}(t)?e&&e.length&&(n=e[0].id):n=t.id,{id:n,firstName:t.firstName,lastName:t.lastName,company:t.company,addressLine1:t.address1,addressLine2:t.address2,city:t.city,province:t.stateOrProvince,provinceCode:t.stateOrProvinceCode,postCode:t.postalCode,country:t.country,countryCode:t.countryCode,phone:t.phone,customFields:t.customFields}}n.d(e,"a",(function(){return r}))},59:function(t,e,n){"use strict";var r=n(0),i=n(72);var a=n(67);function o(t,e,n){return void 0===n&&(n="id"),Object.keys(t).reduce((function(o,s){return Object(r.__spreadArrays)(o,t[s].map((function(t){return"giftCertificates"===s?function(t,e){var n=new i.a(e);return{id:t.id,imageUrl:"",name:t.name,amount:t.amount,amountAfterDiscount:t.amount,discount:0,integerAmount:n.toInteger(t.amount),integerAmountAfterDiscount:n.toInteger(t.amount),integerUnitPrice:n.toInteger(t.amount),integerUnitPriceAfterDiscount:n.toInteger(t.amount),integerDiscount:0,quantity:1,sender:t.sender,recipient:t.recipient,type:"ItemGiftCertificateEntity",attributes:[],variantId:null}}(t,e):Object(a.a)(t,function(t){switch(t){case"physicalItems":return"ItemPhysicalEntity";case"digitalItems":return"ItemDigitalEntity";case"giftCertificates":return"ItemGiftCertificateEntity";default:return""}}(s),e,n)})))}),[])}n.d(e,"a",(function(){return o}))},63:function(t,e,n){"use strict";var r;n.d(e,"a",(function(){return r})),function(t){t.AttachRequested="HOSTED_FIELD:ATTACH_REQUESTED",t.SubmitRequested="HOSTED_FIELD:SUBMITTED_REQUESTED",t.ValidateRequested="HOSTED_FIELD:VALIDATE_REQUESTED"}(r||(r={}))},67:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(72);function i(t,e,n,i){void 0===i&&(i="id");var a=new r.a(n);return{id:t[i],imageUrl:t.imageUrl,amount:t.extendedListPrice,amountAfterDiscount:t.extendedSalePrice,discount:t.discountAmount,integerAmount:a.toInteger(t.extendedListPrice),integerAmountAfterDiscount:a.toInteger(t.extendedSalePrice),integerDiscount:a.toInteger(t.discountAmount),integerUnitPrice:a.toInteger(t.listPrice),integerUnitPriceAfterDiscount:a.toInteger(t.salePrice),downloadsPageUrl:t.downloadPageUrl,name:t.name,quantity:t.quantity,brand:t.brand,sku:t.sku,categoryNames:t.categoryNames,variantId:t.variantId,productId:t.productId,attributes:(t.options||[]).map((function(t){return{name:t.name,value:t.value}})),addedByPromotion:t.addedByPromotion,type:e}}},69:function(t,e,n){"use strict";function r(t,e){return{description:t.description,module:t.type,price:t.cost,id:t.id,selected:e,isRecommended:t.isRecommended,imageUrl:t.imageUrl,transitTime:t.transitTime}}n.d(e,"a",(function(){return r}))},72:function(t,e,n){"use strict";var r=function(){function t(t){this._decimalPlaces=t}return t.prototype.toInteger=function(t){return Math.round(t*Math.pow(10,this._decimalPlaces))},t}();e.a=r},73:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(50);function i(t){if(!/^(https?:)?\/\//.test(t))throw new r.a("The provided URL must be absolute.");var e=document.createElement("a");e.href=t;var n=e.port&&-1!==t.indexOf(e.hostname+":"+e.port)?e.port:"";return{hash:e.hash,hostname:e.hostname,href:e.href,origin:e.protocol+"//"+e.hostname+(n?":"+n:""),pathname:e.pathname,port:n,protocol:e.protocol,search:e.search}}},74:function(t,e){t.exports=require("yup")},8:function(t,e){t.exports=require("rxjs/operators")},84:function(t,e,n){"use strict";var r=n(0);function i(t,e,n){if("function"!=typeof n.value)return n;var i=n.value;return{get:function(){var t=i.bind(this);return Object.defineProperty(this,e,Object(r.__assign)(Object(r.__assign)({},n),{value:t})),t},set:function(t){i=t}}}e.a=function(t,e,n){return e&&n?i(t,e,n):function(t){var e=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return Object(r.__extends)(e,t),e}(t);return Object.getOwnPropertyNames(t.prototype).forEach((function(n){var r=Object.getOwnPropertyDescriptor(t.prototype,n);r&&"constructor"!==n&&Object.defineProperty(e.prototype,n,i(t.prototype,n,r))})),e}(t)}},85:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(54);function i(t,e){var n=t.firstName||e.firstName||"",i=t.lastName||e.lastName||"";return{addresses:(t.addresses||[]).map((function(t){return Object(r.a)(t)})),customerId:t.id,isGuest:t.isGuest,storeCredit:t.storeCredit,email:t.email||e.email||"",firstName:n,lastName:i,name:t.fullName||[n,i].join(" "),customerGroupName:t.customerGroup&&t.customerGroup.name}}},86:function(t,e,n){"use strict";n.d(e,"a",(function(){return u}));var r=n(0),i=n(2),a=n(59),o=n(72),s=n(94);n(53);function u(t,e){void 0===e&&(e={});var n,r,u=t.currency.decimalPlaces,c=new o.a(u);return{id:t.orderId,items:Object(a.a)(t.lineItems,t.currency.decimalPlaces,"productId"),orderId:t.orderId,currency:t.currency.code,customerCanBeCreated:t.customerCanBeCreated,payment:p(t.payments,e.payment),subtotal:{amount:t.baseAmount,integerAmount:c.toInteger(t.baseAmount)},coupon:{discountedAmount:Object(i.reduce)(t.coupons,(function(t,e){return t+e.discountedAmount}),0),coupons:t.coupons.map(s.a)},discount:{amount:t.discountAmount,integerAmount:c.toInteger(t.discountAmount)},token:e.orderToken,callbackUrl:e.callbackUrl,discountNotifications:[],giftCertificate:(n=t.payments,r=Object(i.filter)(n,{providerId:"giftcertificate"}),{totalDiscountedAmount:Object(i.reduce)(r,(function(t,e){return e.amount+t}),0),appliedGiftCertificates:Object(i.keyBy)(r.map((function(t){return{code:t.detail.code,discountedAmount:t.amount,remainingBalance:t.detail.remaining,giftCertificate:{balance:t.amount+t.detail.remaining,code:t.detail.code,purchaseDate:""}}})),"code")}),socialData:m(t),status:t.status,hasDigitalItems:t.hasDigitalItems,isDownloadable:t.isDownloadable,isComplete:t.isComplete,shipping:{amount:t.shippingCostTotal,integerAmount:c.toInteger(t.shippingCostTotal),amountBeforeDiscount:t.shippingCostBeforeDiscount,integerAmountBeforeDiscount:c.toInteger(t.shippingCostBeforeDiscount)},storeCredit:{amount:d(t.payments)},taxes:t.taxes,taxTotal:{amount:t.taxTotal,integerAmount:c.toInteger(t.taxTotal)},handling:{amount:t.handlingCostTotal,integerAmount:c.toInteger(t.handlingCostTotal)},grandTotal:{amount:t.orderAmount,integerAmount:t.orderAmountAsInteger}}}function c(t){return"PAYMENT_STATUS_"+t}function d(t){var e=Object(i.find)(t,{providerId:"storecredit"});return e?e.amount:0}function p(t,e){void 0===e&&(e={});var n=Object(i.find)(t,l);return n?{id:n.providerId,status:c(n.detail.step),helpText:n.detail.instructions,returnUrl:e.returnUrl}:{}}function l(t){return"giftcertificate"!==t.providerId&&"storecredit"!==t.providerId}function m(t){var e={};return Object(r.__spreadArrays)(t.lineItems.physicalItems,t.lineItems.digitalItems).forEach((function(t){var n;e[t.id]=(n=t,["fb","tw","gp"].reduce((function(t,e){var r=n.socialMedia&&Object(i.find)(n.socialMedia,(function(t){return t.code===e}));return r?(t[e]={name:n.name,description:n.name,image:n.imageUrl,url:r.link,shareText:r.text,sharingLink:r.link,channelName:r.channel,channelCode:r.code},t):t}),{}))})),e}},87:function(t,e,n){"use strict";var r=n(2),i=n(72),a=n(94),o=n(133);var s=n(59);function u(t){var e,n,u=t.cart.currency.decimalPlaces,c=new i.a(u);return{id:t.cart.id,items:Object(s.a)(t.cart.lineItems,u),currency:t.cart.currency.code,coupon:{discountedAmount:Object(r.reduce)(t.cart.coupons,(function(t,e){return t+e.discountedAmount}),0),coupons:t.cart.coupons.map(a.a)},discount:{amount:t.cart.discountAmount,integerAmount:c.toInteger(t.cart.discountAmount)},discountNotifications:(e=t.promotions,n=[],(e||[]).forEach((function(t){(t.banners||[]).forEach((function(t){n.push({placeholders:[],discountType:null,message:"",messageHtml:t.text})}))})),n),giftCertificate:{totalDiscountedAmount:Object(r.reduce)(t.giftCertificates,(function(t,e){return t+e.used}),0),appliedGiftCertificates:Object(r.keyBy)(t.giftCertificates.map(o.a),"code")},shipping:{amount:t.shippingCostTotal,integerAmount:c.toInteger(t.shippingCostTotal),amountBeforeDiscount:t.shippingCostBeforeDiscount,integerAmountBeforeDiscount:c.toInteger(t.shippingCostBeforeDiscount),required:Object(r.some)(t.cart.lineItems.physicalItems,(function(t){return t.isShippingRequired}))},subtotal:{amount:t.subtotal,integerAmount:c.toInteger(t.subtotal)},storeCredit:{amount:t.customer?t.customer.storeCredit:0},taxSubtotal:{amount:t.taxTotal,integerAmount:c.toInteger(t.taxTotal)},taxes:t.taxes,taxTotal:{amount:t.taxTotal,integerAmount:c.toInteger(t.taxTotal)},handling:{amount:t.handlingCostTotal,integerAmount:c.toInteger(t.handlingCostTotal)},grandTotal:{amount:t.grandTotal,integerAmount:c.toInteger(t.grandTotal)}}}n.d(e,"a",(function(){return u}))},89:function(t,e){t.exports=require("@bigcommerce/bigpay-client")},92:function(t,e,n){"use strict";var r=function(){function t(){}return t.prototype.format=function(t){var e=t.split(new RegExp("\\s*/\\s*")),n=e[0],r=void 0===n?"":n,i=e[1],a=void 0===i?"":i,o=r.slice(0,2),s=4===a.length?a.slice(-2):a?a.slice(0,2):r.slice(2);return t.length<2?r:t.length>3&&!s?o:o+" / "+s},t.prototype.toObject=function(t){var e=t.split(new RegExp("\\s*/\\s*")),n=e[0],r=void 0===n?"":n,i=e[1],a=void 0===i?"":i;return/^\d+$/.test(r)&&/^\d+$/.test(a)?{month:1===r.length?"0"+r:r.slice(0,2),year:2===a.length?"20"+a:a.slice(0,4)}:{month:"",year:""}},t}();e.a=r},93:function(t,e,n){"use strict";var r=n(28),i=n(2),a=function(){function t(){}return t.prototype.format=function(t){var e=Object(r.number)(t).card;if(!e)return t;var n=Object(i.max)(Object(r.creditCardType)(t).map((function(t){return Object(i.max)(t.lengths)}))),a=this.unformat(t).slice(0,n);return e.gaps.filter((function(t){return a.length>t})).reduce((function(t,e,n){return[t.slice(0,e+n),t.slice(e+n)].join(" ")}),a)},t.prototype.unformat=function(t){return Object(r.number)(t).card?t.replace(new RegExp(" ","g"),""):t},t}();e.a=a},94:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=["per_item_discount","percentage_discount","per_total_discount","shipping_discount","free_shipping"];function i(t){return{code:t.code,discount:t.displayName,discountType:r.indexOf(t.couponType)}}}});
//# sourceMappingURL=hosted-form.js.map