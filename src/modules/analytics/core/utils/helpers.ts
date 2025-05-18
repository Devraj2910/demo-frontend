/**
 * Helper to get full name from first and last name
 */
export const getFullName = (firstName: string | null, lastName: string | null): string => {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return 'Anonymous User';
};
