// Zorvani Wear (DEMO) - Validation Module
// Form validation helpers for checkout.

/**
 * Validate a name field.
 * @param {string} name
 * @returns {{ valid: boolean, error: string }}
 */
export function validateName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate an Indian mobile phone number (10 digits starting with 6-9).
 * @param {string} phone
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePhone(phone) {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }
  const cleaned = phone.trim().replace(/[\s-]/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'Enter a valid 10-digit Indian mobile number starting with 6-9' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate an Indian pincode (exactly 6 digits).
 * @param {string} pincode
 * @returns {{ valid: boolean, error: string }}
 */
export function validatePincode(pincode) {
  if (!pincode || pincode.trim().length === 0) {
    return { valid: false, error: 'Pincode is required' };
  }
  const cleaned = pincode.trim();
  if (!/^\d{6}$/.test(cleaned)) {
    return { valid: false, error: 'Enter a valid 6-digit pincode' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate an address field.
 * @param {string} address
 * @returns {{ valid: boolean, error: string }}
 */
export function validateAddress(address) {
  if (!address || address.trim().length === 0) {
    return { valid: false, error: 'Address is required' };
  }
  if (address.trim().length < 5) {
    return { valid: false, error: 'Address must be at least 5 characters' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate a city field.
 * @param {string} city
 * @returns {{ valid: boolean, error: string }}
 */
export function validateCity(city) {
  if (!city || city.trim().length === 0) {
    return { valid: false, error: 'City is required' };
  }
  if (city.trim().length < 2) {
    return { valid: false, error: 'City must be at least 2 characters' };
  }
  return { valid: true, error: '' };
}

/**
 * Validate the entire checkout form.
 * @param {Object} formData - { name, phone, pincode, address, city }
 * @returns {{ valid: boolean, errors: Object }}
 */
export function validateCheckoutForm(formData) {
  const errors = {};
  let valid = true;

  const nameResult = validateName(formData.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
    valid = false;
  }

  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.error;
    valid = false;
  }

  const pincodeResult = validatePincode(formData.pincode);
  if (!pincodeResult.valid) {
    errors.pincode = pincodeResult.error;
    valid = false;
  }

  const addressResult = validateAddress(formData.address);
  if (!addressResult.valid) {
    errors.address = addressResult.error;
    valid = false;
  }

  const cityResult = validateCity(formData.city);
  if (!cityResult.valid) {
    errors.city = cityResult.error;
    valid = false;
  }

  return { valid, errors };
}
