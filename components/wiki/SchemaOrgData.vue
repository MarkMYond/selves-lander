<template>
  <!-- This is a utility component with no visual output -->
</template>

<script setup lang="ts">
/**
 * SchemaOrgData component
 * 
 * This component injects Schema.org structured data into the page <head> as JSON-LD.
 * It takes a wiki page as input and generates appropriate structured data.
 */
import { computed, watch } from 'vue';

// Accept the wiki page as a prop
const props = defineProps({
  page: {
    type: Object,
    required: true
  }
});

// Compute the JSON-LD data based on the page
const schemaData = computed(() => {
  if (!props.page) return null;
  
  // Check if the page has custom JSON-LD content
  if (props.page.schemaOrg?.jsonLd) {
    try {
      // Try to parse the custom JSON-LD
      return JSON.parse(props.page.schemaOrg.jsonLd);
    } catch (error) {
      console.error('Error parsing custom JSON-LD:', error);
    }
  }
  
  // Default schema based on the page type or fallback to Article
  const schemaType = props.page.schemaOrg?.type || 'Article';
  
  // Base schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: props.page.title,
    description: props.page.description || '',
    dateModified: props.page._updatedAt || new Date().toISOString(),
  };
  
  // Add additional fields based on schema type
  switch (schemaType) {
    case 'TechArticle':
      return {
        ...schema,
        category: 'Technical Documentation',
      };
    
    case 'FAQPage':
      // For FAQ pages, we would extract questions and answers from content
      // This is simplified for now
      return {
        ...schema,
        mainEntity: []
      };
    
    case 'HowTo':
      // For HowTo pages, we would extract steps from content
      // This is simplified for now
      return {
        ...schema,
        tool: [],
        step: []
      };
      
    default: // Article or other types
      return schema;
  }
});

// Add the schema data to the page head
watch(() => schemaData.value, (newSchema) => {
  if (newSchema) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(newSchema)
        }
      ]
    });
  }
}, { immediate: true });
</script>
