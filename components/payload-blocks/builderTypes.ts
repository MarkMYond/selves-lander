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

interface Image {
  id: string
  url?: string | null
  alt?: string | null
  createdAt?: string
  updatedAt?: string
}

interface ImageGridItem {
  id: string
  image: Image
}

export interface ImageGridBlock {
  blockType: 'imageGrid'
  title?: string | null
  description?: string | null
  images: ImageGridItem[]
}

interface CtaButton {
  text: string
  url: string
}
export interface PeopleSectionBlock {
  blockType: 'peopleSection'
  title?: string | null
  description?: string | null
  image?: Image | null
  ctaButton?: CtaButton | null
}

export interface CareerSectionBlock {
  blockType: 'careerSection'
  title?: string | null
  description?: string | null
  ctaButton?: CtaButton | null
}

interface AiBenefit {
  id: string
  title?: string | null
  description?: string | null
}
interface Link {
  text: string
  url: string
}
export interface AiSupportSectionBlock {
  blockType: 'aiSupportSection'
  title?: string | null
  description?: string | null
  benefits?: AiBenefit[] | null
  link?: Link | null
}

interface ChatButton {
  text: string;
  url: string;
  style?: 'primary' | 'secondary';
}

export interface InteractiveChatBlock {
  blockType: 'interactiveChatBlock';
  title?: string;
  description?: string;
  buttons?: ChatButton[];
  sectionBackgroundColor?: 'brand-50' | 'white' | 'light-grey' | 'brand-900' | 'transparent' | null;
  contentBackgroundColor?: 'brand-50' | 'white' | 'light-grey' | 'brand-900' | null;
  containerWidth?: 'fluid' | 'xl' | 'lg' | 'md' | null;
  removeTopPadding?: boolean | null;
  removeBottomPadding?: boolean | null;
  titleStyle?: 'normal' | 'large' | null;
}
