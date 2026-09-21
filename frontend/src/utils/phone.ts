/**
 * Utility to launch the device's default phone dialer/call app.
 */
export const triggerPhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;
  // Strip out all characters except digits and leading +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  if (cleaned) {
    window.location.href = `tel:${cleaned}`;
  }
};
