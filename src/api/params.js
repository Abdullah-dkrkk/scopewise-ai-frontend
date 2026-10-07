/** Strip empty values so we never send `?search=&page=` to the API. */
export function buildParams(input = {}) {
  const params = {};
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    params[key] = value;
  });
  return Object.keys(params).length > 0 ? params : undefined;
}
