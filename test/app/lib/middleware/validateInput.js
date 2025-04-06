export function validateInput(data, requiredFields) {
  const errors = {};

  requiredFields.forEach(field => {
    // Handle alternative fields (field1|field2 means either is required)
    if (field.includes('|')) {
      const alternatives = field.split('|');
      const hasAny = alternatives.some(alt => data[alt] !== undefined && data[alt] !== null && data[alt] !== '');
      
      if (!hasAny) {
        errors[field] = `At least one of ${alternatives.join(' or ')} is required`;
      }
    } else {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors[field] = `${field} is required`;
      }
    }
  });

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}
