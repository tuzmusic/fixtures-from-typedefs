/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/customers/{customerId}/subscription': {
    get: operations['v5.customers.subscription.index'];
  };
  '/health': {
    get: operations['v5.health'];
  };
}

export interface components {
  schemas: {
    /** @description A customer's billing information (Currently only credit card payment methods are stored). */
    BillingInformation: {
      addressLineOne: string;
      addressLineTwo: string | null;
      /**
       * @description Full brand name of this credit card
       * @example American Express
       */
      brand: string | null;
      city: string;
      /**
       * @description Last 4 credit card digits, with first 2 digits masked
       * @example **12
       */
      lastFourDigits: string;
      /** @description Name printed on card */
      name: string | null;
      postalCode: string | null;
      state: string | null;
    };
    Customer: {
      /**
       * Format: email
       * @description The email address of the customer.
       */
      emailAddress: string;
      /** @description The first name of the customer. */
      firstName: string;
      /** @description The full name of the customer. */
      fullName: string;
      /** @description The ID of the customer. */
      id: number;
      /**
       * Format: date-time
       * @description The date the customer joined ButcherBox.
       * @example 2023-07-07 14:00:00
       */
      joinedAt: string;
      /** @description The last name of the customer. */
      lastName: string;
      /** @description The phone number of the customer. */
      phoneNumber: string | null;
      /**
       * @description The numeric portion of a Shopify customer ID, e.g. 54321 in gid://shopify/Customer/54321.
       * @example 54321
       */
      shopifyCustomerId: number;
      /** @description The customer's billing information. */
      billingInformation: components['schemas']['BillingInformation'];
      /** @description The customer's shipping address. */
      shippingAddress: components['schemas']['ShippingAddress'];
      /** @description The customer's shipping zone. */
      shipZone: components['schemas']['ShipZone'];
      /** @description The number of specials/deals claimed by the customer. */
      claimedDealsCount: number;
      /** @description The customer's SMS status */
      smsConsentStatus: components['schemas']['SmsConsentStatusEnumeration'];
      /** @description The segment anonymous Id of the customer */
      anonymousId: string | null;
      /**
       * @description The payment gateway attached.
       * @enum {string}
       */
      paymentGateway: 'stripe' | 'shopify';
    };
    /** @description Only includes the data required to find a particular Shopify product */
    ProductReference: {
      /**
       * @description A Shopify ProductVariant.id without the gid prefix
       * @example 532523523
       */
      productVariantId: string;
      /**
       * @description A Shopify Product.id without the gid prefix
       * @example 359239593
       */
      productId: string;
      /**
       * @description The price in cents that this customer should be charged for this product. E.g. $20.00 => 2000
       * @example 2000
       */
      price: number;
    };
    /** @description A customer's shipping address. */
    ShippingAddress: {
      firstName: string;
      lastName: string;
      addressLineOne: string;
      addressLineTwo: string | null;
      city: string;
      state: string;
      postalCode: string;
      /** @description Any special delivery instructions. Maximum character count dictated by DOM/carrier requirements. */
      deliveryInstructions: string | null;
    };
    ShipZone: {
      /** @description The 5 digit postal code of the ship zone */
      postalCode: string;
      /**
       * @description A one letter representation of the cardinal direction of the packing
       * facility associated with the ship zone
       */
      preferredFacility: string;
      /** @description The shortcode of the preferred carrier for the ship zone */
      preferredCarrier: string;
      /**
       * @description The number of days (1 or 2) that a box ought to be in transit for
       * the ship zone
       */
      daysInTransit: number;
      /**
       * @description A flag which marks whether the ship zone can receive Saturday
       * deliveries
       */
      noSaturday: boolean;
    };
    Subscription: {
      /** @description The internal ButcherBox ID of the subscription. */
      id: number;
      /** @description The numeric portion of a Shopify Subscription Contract ID, e.g. 54321 in gid://shopify/SubscriptionContract/54321. */
      shopifySubscriptionContractId: number | null;
      /**
       * @description The ID of the subscription contract line item that defines this subscription's plan
       * @example 11111111-a1a1-b2b2-c3c3-121212121212
       */
      shopifyPlanLineId: string;
      /**
       * Format: datetime
       * @description The end of this subscription's current billing cycle / the next bill date for this subscription.
       * @example 2023-07-07 01:00:00
       */
      shopifyBillingCycleEndAt: string;
      interval: components['schemas']['SubscriptionIntervalEnumeration'];
      /**
       * @description The month of the subscription. The month is the number of boxes the
       * customer has already received for the subscription plus one (the
       * upcoming box).
       */
      month: number;
      /**
       * Format: date
       * @description The period end date of the subscription.
       * @example 2023-07-07
       */
      periodEndDate: string;
      status: components['schemas']['SubscriptionStatusEnumeration'];
      /** @description The list of products active on this subscription */
      lines: components['schemas']['SubscriptionLine'][];
      customer: components['schemas']['Customer'];
    };
    SubscriptionLine: {
      product: components['schemas']['ProductReference'];
      /** @description Defines how this line item should persist on the subscription, as it is repeatedly fulfilled */
      lifecycle: components['schemas']['SubscriptionLineLifecycle'];
      /** @description The quantity of this product, deliverable at the requested interval */
      quantity: number;
    };
    /** @description Defines how a SubscriptionLine item should persist on a subscription */
    SubscriptionLineLifecycle:
      | components['schemas']['SubscriptionLineLifecycleUntilDateDelta']
      | components['schemas']['SubscriptionLineLifecycleForever']
      | components['schemas']['SubscriptionLineLifecycleUntilDate'];
    /** @description Base properties that should exist on all SubscriptionLineLifecycle types */
    BaseSubscriptionLineLifecycle: {
      /** @description The maximum number of orders this line item can be included in */
      maximumAllowedOrders: number | null;
      /** @description The list of events that should remove this line item from the customer's subscription */
      removeOnEvents?: components['schemas']['SubscriptionEventEnumeration'][];
    };
    /** @description Configures a subscription line to be delivered in every order */
    SubscriptionLineLifecycleForever: components['schemas']['BaseSubscriptionLineLifecycle'] & {
      /** @enum {string} */
      intent: 'FOREVER';
    };
    /** @description Configures a subscription line to be delivered in every box until and including a given date */
    SubscriptionLineLifecycleUntilDate: components['schemas']['BaseSubscriptionLineLifecycle'] & {
      /** @enum {string} */
      intent: 'UNTIL_DATE';
      /**
       * Format: date
       * @description The last eligible day (inclusive) for this item to be delivered in a subscription
       * @example 2023-07-07
       */
      date: string;
    };
    /** @description Configures a subscription line to be delivered in every box until a discrete length of time has passed */
    SubscriptionLineLifecycleUntilDateDelta: components['schemas']['BaseSubscriptionLineLifecycle'] & {
      /** @enum {string} */
      intent: 'UNTIL_DATE_DELTA';
      /**
       * @description The unit of time by the delta
       * @enum {string}
       */
      interval: 'DAY';
      /** @description How many intervals is allowed to elapse */
      intervalCount: number;
    };
    /**
     * @description The customer's SMS status
     * @enum {string}
     */
    SmsConsentStatusEnumeration: 'OPTED_IN' | 'OPTED_OUT' | 'PENDING' | 'FAILED';
    /**
     * @description List of actions that can be performed on a subscription
     * @enum {string}
     */
    SubscriptionEventEnumeration: 'UNSUBSCRIBED';
    /**
     * @description Describes how often a customer will receive an order/box
     * @enum {string}
     */
    SubscriptionIntervalEnumeration:
      | 'every_month'
      | 'every_2_months'
      | 'every_3_months'
      | 'every_4_months'
      | 'every_5_months'
      | 'every_14_days'
      | 'every_15_days'
      | 'every_42_days';
    /**
     * @description The status of the subscription.
     * @enum {string}
     */
    SubscriptionStatusEnumeration: 'active' | 'past_due' | 'payment_processing' | 'canceled';
  };
  responses: {
    /** Success */
    Success: {
      content: {
        'application/json': {
          /** @default Success */
          message: string;
        };
      };
    };
    /** A single subscription object */
    Subscription: {
      content: {
        'application/json': components['schemas']['Subscription'];
      };
    };
    /** Unauthorized */
    Unauthorized: {
      content: {
        'application/json': {
          /** @default Unauthorized */
          message: string;
        };
      };
    };
    /** Not found */
    NotFound: {
      content: {
        'application/json': {
          /** @default Not Found */
          message: string;
        };
      };
    };
    /** Internal Server Error */
    InternalServerError: {
      content: {
        'application/json': {
          /** @default Internal Server Error */
          message: string;
        };
      };
    };
  };
  parameters: {
    /**
     * @description The numeric portion of a Shopify customer ID, e.g. 54321 in gid://shopify/Customer/54321.
     * @example 54321
     */
    CustomerId: number;
  };
}

export interface operations {
  'v5.customers.subscription.index': {
    parameters: {
      path: {
        /** The numeric portion of a Shopify customer ID, e.g. 54321 in gid://shopify/Customer/54321. */
        customerId: components['parameters']['CustomerId'];
      };
    };
    responses: {
      200: components['responses']['Subscription'];
      401: components['responses']['Unauthorized'];
      404: components['responses']['NotFound'];
      500: components['responses']['InternalServerError'];
    };
  };
  'v5.health': {
    responses: {
      200: components['responses']['Success'];
      401: components['responses']['Unauthorized'];
      500: components['responses']['InternalServerError'];
    };
  };
}

export interface external {}
