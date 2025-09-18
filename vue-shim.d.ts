declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Allow importing assets with Vite ?url suffix (e.g., import url from '.../logo.svg?url')
declare module '*?url' {
  const url: string
  export default url
}

// Basic svg module declaration (string URL). This complements the ?url form above.
declare module '*.svg' {
  const url: string
  export default url
}
