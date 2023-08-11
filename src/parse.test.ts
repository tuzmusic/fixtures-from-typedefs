import { describe, expect, it, test } from 'vitest';
import { defaultValues, parse } from './start.js';
import type { components } from '../fixtures/index.js';

describe('Parsing', () => {
  const fixture = parse('../fixtures/index.d.ts') as components['schemas'];
  describe('basic types', () => {
    it('Handles simple strings', () => {
      expect(fixture.BillingInformation.addressLineOne).toEqual(defaultValues.string);
      expect(fixture.Customer.emailAddress).toEqual(defaultValues.string);
    });

    it('handles "string | null"', () => {
      expect(fixture.BillingInformation.state).toEqual(defaultValues.string);
      expect(fixture.Customer.phoneNumber).toEqual(defaultValues.string);
    });

    it('handles numbers', () => {
      expect(fixture.SubscriptionLine.quantity).toEqual(defaultValues.number);
      expect(fixture.Customer.id).toEqual(defaultValues.number);
      expect(fixture.Customer.shopifyCustomerId).toEqual(defaultValues.number);
    });

    it('handles "number | null"', () => {
      expect(fixture.BaseSubscriptionLineLifecycle.maximumAllowedOrders).toEqual(defaultValues.number);
      expect(fixture.Subscription.shopifySubscriptionContractId).toEqual(defaultValues.number);
    });

    it('handles booleans', () => {
      expect(fixture.ShipZone.noSaturday).toEqual(false);
    });

    describe('inline enums', () => {
      test('strings', () => {
        expect(fixture.Customer.paymentGateway).toEqual('stripe');
      });

      test.todo('numbers', () => {});

      test.todo('other???');
    });

    it.todo('handles null/undefined');
  });

  describe.todo('single-level nested types (reference types)', () => {});

  describe.todo('using examples', () => {});

  describe.todo('complex types', () => {
    test.todo('union of multiple types', () => {
      // SubscriptionLineLifeCycle
    });

    test.todo('Join of reference type and other properties', () => {
      // SubscriptionLineLifeCycleForever
    });
  });

  describe.todo('enums', () => {});
});
