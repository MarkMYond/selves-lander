import type { WebPage } from '@/src/payload-types'; // Assuming WebPage is the type for internalLink relation

// Define a more specific type for the button data if possible, based on your Payload field structure.
export interface LinkFieldData { // Renamed and exported for potential reuse
  label?: string; // Optional label for the link itself
  type?: ('internal' | 'external') | null;
  internalLink?: (string | null) | WebPage; // string for ID, WebPage for populated object
  externalLink?: string | null;
  newTab?: boolean | null;
  // Other fields like 'variant' are specific to the component using the link, not the link itself.
}

interface ResolvedLinkProps {
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export function useLinkResolver() {
  const isTrulyExternalUrl = (url?: string): boolean => {
    if (!url) return false;
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//')
    );
  };

  const determineLinkType = (button?: LinkFieldData): 'internal' | 'external' | 'none' => {
    if (!button) return 'none';

    // Explicit type field takes precedence
    if (button.type === 'internal') return 'internal';
    if (button.type === 'external') {
      // If externalLink is a root-relative path, treat as internal for NuxtLink
      if (button.externalLink && button.externalLink.startsWith('/') && !isTrulyExternalUrl(button.externalLink)) {
        return 'internal';
      }
      return 'external';
    }

    // Infer if type is not set
    if (button.internalLink) return 'internal';
    if (button.externalLink) {
      return button.externalLink.startsWith('/') && !isTrulyExternalUrl(button.externalLink) ? 'internal' : 'external';
    }
    
    return 'none';
  };

  const getResolvedUrl = (button?: LinkFieldData): string => {
    if (!button) return '#';

    const linkType = determineLinkType(button);

    if (linkType === 'internal') {
      if (button.internalLink) {
        const internalValue = button.internalLink;
        if (typeof internalValue === 'object' && internalValue !== null && 'slug' in internalValue && typeof internalValue.slug === 'string') {
          // internalLink is a populated WebPage object
          return `/${internalValue.slug.startsWith('/') ? internalValue.slug.substring(1) : internalValue.slug}`;
        }
        // If internalLink is a string, it's an ID from Payload if not populated.
        // We cannot form a slug-based URL from an ID without another fetch.
        if (typeof internalValue === 'string') { 
          // This indicates the data wasn't populated deeply enough if 'type' was 'internal'.
          // Or, if type was 'external' but it's a root-relative path, that's handled below.
          // For a true 'internalLink' that is a string ID, we cannot proceed.
          if (button.type === 'internal' || (!button.type && button.internalLink)) { // Explicitly internal or inferred internal via internalLink field
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[useLinkResolver] internalLink is a string (ID: "${internalValue}") but expected a populated object with a slug for internal links. ` +
                `Ensure 'depth' is sufficient in Payload fetch for the related document. Falling back to '#'.`
              );
            }
            return '#'; // Cannot resolve ID to slug here.
          }
          // If it reached here as a string, and type wasn't 'internal', it might be an externalLink that's root-relative,
          // which is handled by the 'determineLinkType' and the block below.
          // However, this specific 'if (typeof internalValue === 'string')' block is inside 'if (button.internalLink)',
          // so it must be an internalLink ID.
        }
      }
      // If type was 'external' but determined internal (root-relative path like '/about')
      if (button.type === 'external' && button.externalLink && button.externalLink.startsWith('/') && !isTrulyExternalUrl(button.externalLink)) {
        return button.externalLink;
      }
    } else if (linkType === 'external' && button.externalLink) {
      return button.externalLink;
    }
    
    return '#'; // Fallback
  };

  const resolveLinkProps = (button?: LinkFieldData): ResolvedLinkProps => {
    if (!button) return { href: '#' }; // Default to href="#"

    const props: ResolvedLinkProps = {};
    const url = getResolvedUrl(button);
    const linkType = determineLinkType(button);

    if (linkType === 'internal') {
      props.to = url;
    } else if (linkType === 'external') {
      props.href = url;
    } else {
      props.href = '#'; // Fallback for 'none' type
    }
    
    // Determine target and rel
    const openInNewTab = button.newTab === true || (linkType === 'external' && button.newTab !== false && isTrulyExternalUrl(url));

    if (openInNewTab) {
      props.target = '_blank';
      props.rel = 'noopener noreferrer'; // Good practice for security and SEO
    }

    return props;
  };

  return {
    resolveLinkProps,
    // Expose sub-functions if they need to be used independently, though usually not necessary
    // isTrulyExternalUrl, 
    // determineLinkType,
    // getResolvedUrl,
  };
}
