export const formatShortOrderId = (orderId?: string): string => {
  if (!orderId) return '—';
  const parts = orderId.split('-');
  if (parts.length >= 4 && parts[0] === 'TOPUP') {
    return `#${parts[2]}`;
  }
  if (parts.length >= 2 && parts[0] === 'CHKIN') {
    return `#${parts[1]}`;
  }
  return `#${orderId.slice(-8)}`;
};
