/**
 * Composable for working with icons in the application
 * Supports both Icon component and direct component imports
 */

export function useIcons() {
  // Get the nuxt app instance
  const nuxtApp = useNuxtApp();
  
  // Check if Phosphor icons are enabled (set by plugins/icons.ts)
  const phosphorEnabled = nuxtApp.phosphorEnabled || false;
  
  /**
   * Get the full icon name with prefix
   * @param name Base icon name (e.g. "user")
   * @param variant Icon variant (e.g. "duotone", "bold", "fill")
   * @returns Full icon name with prefix (e.g. "ph:user-duotone")
   */
  function getIconName(name: string, variant: 'regular' | 'bold' | 'duotone' | 'fill' | 'light' = 'regular'): string {
    // Always prefix Phosphor icons with "ph:"
    const prefix = 'ph:';
    
    // For regular variant, don't add a suffix
    const suffix = variant === 'regular' ? '' : `-${variant}`;
    
    // Return the full icon name
    return `${prefix}${name}${suffix}`;
  }
  
  return {
    phosphorEnabled,
    getIconName
  };
}
