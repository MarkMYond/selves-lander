<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Duotone Icons Demo</h2>
    
    <div class="space-y-6">
      <!-- nuxt-icon approach -->
      <div>
        <h3 class="text-lg font-medium mb-2">&lt;Icon&gt; Component Method</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex flex-col items-center">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="userDuotone" size="24" />
            </div>
            <span class="text-xs mt-1">user</span>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="houseDuotone" size="24" />
            </div>
            <span class="text-xs mt-1">house</span>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="heartDuotone" size="24" class="text-red-500" />
            </div>
            <span class="text-xs mt-1">heart</span>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="lightningDuotone" size="24" class="text-amber-500" />
            </div>
            <span class="text-xs mt-1">lightning</span>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="starDuotone" size="24" class="text-indigo-500" />
            </div>
            <span class="text-xs mt-1">star</span>
          </div>
        </div>
      </div>
      
      <!-- Direct component approach -->
      <div>
        <h3 class="text-lg font-medium mb-2">Direct Component Method</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex flex-col items-center" v-for="(icon, index) in iconExamples" :key="index">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="icon.name" size="24" :class="icon.class" />
            </div>
            <span class="text-xs mt-1">{{ icon.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- Comparison with other variants -->
      <div>
        <h3 class="text-lg font-medium mb-2">Variant Comparison</h3>
        <div class="flex flex-wrap gap-6">
          <div class="flex flex-col items-center" v-for="(variant, index) in iconVariants" :key="index">
            <div class="p-2 rounded-md bg-brand-50">
              <Icon :name="variant.name" size="24" />
            </div>
            <span class="text-xs mt-1">{{ variant.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Use our icon composable
const { getIconName } = useIcons();

// Create icon name constants
const userDuotone = getIconName('user', 'duotone');
const houseDuotone = getIconName('house', 'duotone');
const heartDuotone = getIconName('heart', 'duotone');
const lightningDuotone = getIconName('lightning', 'duotone');
const starDuotone = getIconName('star', 'duotone');

// Icon examples for the direct component approach
const iconExamples = [
  { name: userDuotone, label: 'user' },
  { name: houseDuotone, label: 'house' },
  { name: heartDuotone, label: 'heart', class: 'text-red-500' },
  { name: lightningDuotone, label: 'lightning', class: 'text-amber-500' },
  { name: starDuotone, label: 'star', class: 'text-indigo-500' }
];

// Variants for comparison
const iconVariants = [
  { name: getIconName('user', 'light'), label: 'Light' },
  { name: getIconName('user', 'regular'), label: 'Regular' },
  { name: getIconName('user', 'bold'), label: 'Bold' },
  { name: getIconName('user', 'fill'), label: 'Fill' },
  { name: getIconName('user', 'duotone'), label: 'Duotone' }
];
</script>
