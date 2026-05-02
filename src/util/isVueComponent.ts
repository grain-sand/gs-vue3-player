const VueRequiredProperties = new Set([
  '$el',
  '$options',
  '$emit'
]);

export function isVueComponent(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const component = obj as Record<string, unknown>;
  
  if (component.__vccOpts !== undefined) {
    return true;
  }
  
  if (typeof component.setup === 'function') {
    return true;
  }
  
  if (typeof component.render === 'function') {
    return true;
  }
  
  if (typeof component.template === 'string') {
    return true;
  }
  
  if (typeof component.components === 'object' && component.components !== null) {
    return true;
  }
  
  for (const key of Object.keys(component)) {
    if (VueRequiredProperties.has(key)) {
      return true;
    }
  }
  
  return false;
}
