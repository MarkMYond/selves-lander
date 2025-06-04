// This plugin ensures Phosphor duotone icons are properly registered with nuxt-icon
// and customizes the duotone secondary color

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Phosphor icons plugin loaded - ensuring duotone icons are available');
  
  // Only run in client-side to avoid SSR issues
  if (process.client) {
    // Add CSS to customize the duotone secondary color to #E6D8FF
    const style = document.createElement('style');
    style.textContent = `
      /* Set the secondary color of duotone icons to #E6D8FF */
      .ph-duotone > :nth-child(2),
      [name*="duotone"] > :nth-child(2) {
        color: #E6D8FF !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  return {
    provide: {
      phosphorDuotoneEnabled: true
    }
  };
});
