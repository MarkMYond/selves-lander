export interface Testimonial {
  quote: string
  author: string
  position: string
}

export interface Solution {
  name: string
  value: string
  icon: string
  description: string
}

export interface ApproachStep {
  number: number
  description: string
}

// --- Common Types ---

// Basic Image type (can be expanded)
interface Image {
  id: string;
  url?: string | null;
  alt?: string | null;
  // Add other relevant Payload Media fields if needed (e.g., width, height)
  createdAt?: string; // From example data
  updatedAt?: string; // From example data
}

// --- Block Specific Types ---

// Image Grid Block
interface ImageGridItem {
  id: string;
  image: Image; // Nested image object
}

export interface ImageGridBlock {
  blockType: 'imageGrid';
  title?: string | null;
  description?: string | null;
  images: ImageGridItem[];
}

// People Section Block
interface CtaButton { // Re-declare or import if defined elsewhere
  text: string;
  url: string;
}
export interface PeopleSectionBlock {
  blockType: 'peopleSection';
  title?: string | null; // Allowing for potential rich text/emphasis later
  description?: string | null; // Can be simple text or rich text
  image?: Image | null; // Single image for the section
  ctaButton?: CtaButton | null; // Optional CTA button
}

// Career Section Block (No image prop needed, as it's hardcoded in component)
export interface CareerSectionBlock {
  blockType: 'careerSection';
  title?: string | null;
  description?: string | null;
  ctaButton?: CtaButton | null; 
}

// AI Support Section Block
interface AiBenefit {
  id: string;
  title?: string | null;
  description?: string | null;
}
interface Link {
    text: string;
    url: string;
}
export interface AiSupportSectionBlock {
    blockType: 'aiSupportSection';
    title?: string | null;
    description?: string | null;
    benefits?: AiBenefit[] | null;
    link?: Link | null;
}


// Add other block types as needed below...
