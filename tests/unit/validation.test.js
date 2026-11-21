import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateName,
  validatePhone,
  validatePincode,
  validateAddress,
  validateCity,
  validateCheckoutForm,
} from '../../src/js/validation.js';

describe('Validation Module', () => {
  describe('validateName()', () => {
    it('should validate valid names', () => {
      assert.strictEqual(validateName('Amit Shah').valid, true);
      assert.strictEqual(validateName('Jo').valid, true);
    });

    it('should fail on empty or too short names', () => {
      assert.strictEqual(validateName('').valid, false);
      assert.strictEqual(validateName('   ').valid, false);
      assert.strictEqual(validateName('A').valid, false);
    });
  });

  describe('validatePhone()', () => {
    it('should accept valid 10-digit Indian mobile numbers starting with 6, 7, 8, or 9', () => {
      assert.strictEqual(validatePhone('9876543210').valid, true);
      assert.strictEqual(validatePhone('8123456789').valid, true);
      assert.strictEqual(validatePhone('7000123456').valid, true);
      assert.strictEqual(validatePhone('6999888777').valid, true);
      // Spaces or dashes should be cleaned
      assert.strictEqual(validatePhone('98765 43210').valid, true);
      assert.strictEqual(validatePhone('9876-543-210').valid, true);
    });

    it('should reject invalid phone numbers', () => {
      assert.strictEqual(validatePhone('').valid, false);
      assert.strictEqual(validatePhone('1234567890').valid, false); // starts with 1
      assert.strictEqual(validatePhone('5555555555').valid, false); // starts with 5
      assert.strictEqual(validatePhone('987654321').valid, false);  // 9 digits
      assert.strictEqual(validatePhone('98765432100').valid, false); // 11 digits
      assert.strictEqual(validatePhone('abcdefghij').valid, false);
    });
  });

  describe('validatePincode()', () => {
    it('should accept exactly 6 digits', () => {
      assert.strictEqual(validatePincode('400001').valid, true);
      assert.strictEqual(validatePincode('110001').valid, true);
    });

    it('should reject non-6-digit or non-numeric pincodes', () => {
      assert.strictEqual(validatePincode('').valid, false);
      assert.strictEqual(validatePincode('40001').valid, false); // 5 digits
      assert.strictEqual(validatePincode('4000001').valid, false); // 7 digits
      assert.strictEqual(validatePincode('40000A').valid, false);
    });
  });

  describe('validateAddress() and validateCity()', () => {
    it('should accept valid addresses and cities', () => {
      assert.strictEqual(validateAddress('Flat 402, Sea View Apts').valid, true);
      assert.strictEqual(validateCity('Mumbai').valid, true);
    });

    it('should reject too short addresses or cities', () => {
      assert.strictEqual(validateAddress('').valid, false);
      assert.strictEqual(validateAddress('A').valid, false);
      assert.strictEqual(validateCity('').valid, false);
      assert.strictEqual(validateCity('X').valid, false);
    });
  });

  describe('validateCheckoutForm()', () => {
    it('should approve valid checkout form data', () => {
      const validData = {
        name: 'Priya Sharma',
        phone: '9876543210',
        address: '123 Marine Drive, Flat 5B',
        city: 'Mumbai',
        pincode: '400020',
      };
      const res = validateCheckoutForm(validData);
      assert.strictEqual(res.valid, true);
      assert.deepStrictEqual(res.errors, {});
    });

    it('should report errors for all invalid fields', () => {
      const invalidData = {
        name: '',
        phone: '123',
        address: 'No',
        city: '',
        pincode: '99',
      };
      const res = validateCheckoutForm(invalidData);
      assert.strictEqual(res.valid, false);
      assert.ok(res.errors.name);
      assert.ok(res.errors.phone);
      assert.ok(res.errors.address);
      assert.ok(res.errors.city);
      assert.ok(res.errors.pincode);
    });
  });
});
