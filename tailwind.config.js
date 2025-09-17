/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  safelist: [
    // Primary micro header colors
    'bg-sand',
    'bg-pink-light',
    'bg-coral-light',
    'bg-pink-mid',
    'bg-purple-light',
    'bg-blue-light',
    'bg-aqua-light',
    'bg-green-light',
    'bg-light-green',
    'bg-grass-light',
    
    // Neutral colors
    'bg-neutral-white',
    'bg-neutral-off-white',
    'bg-neutral-light-grey',
    'bg-neutral-medium',
    'bg-neutral-dark',
    'bg-navy-dark',
    
    // Legacy support (remove these as you migrate)
    'bg-brandTheme-01',
    'bg-brandTheme-02',
    'bg-brandTheme-03',
    'bg-brandTheme-04',
    'bg-brandNeutral-01',
    'bg-brandNeutral-02',
    'bg-brandNeutral-03',
    'bg-brandNeutral-04',
    'bg-light-grey',
    'bg-brand-50',
    'bg-brand-100',
    'bg-brand-900',
    
    // Pattern for additional light backgrounds if needed
    {
      pattern: /bg-(red|blue|green|yellow|orange|purple|pink|gray)-(100|200)/,
    },
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px', 
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',
      },
    },
    boxShadow: {
      sm: 'none',
      DEFAULT: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
    },
    extend: {
      colors: {
        // Shadcn UI color system
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#120a0b', // neutral-dark
          foreground: '#fff', // neutral-white
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        // PRIMARY COLOR PALETTE - Micro Header Colors
        sand: '#fefce7',
        'pink-light': '#fef1e7',
        'coral-light': '#fee7e8',
        'pink-mid': '#fee7fa',
        'purple-light': '#f0e7fe',
        'blue-light': '#e7f0fe',
        'aqua-light': '#e7f9fe',
        'green-light': '#e7fcfe',
        'light-green': '#e7fef9',
        'grass-light': '#e7fee8',

        // NEUTRAL COLORS (consolidated)
        'neutral-white': '#fff',
        'neutral-off-white': '#FBF8FF',
        'neutral-light-grey': '#F1F1F1',
        'neutral-stroke': '#e3e2e2',
        'neutral-medium': '#454140',
        'neutral-dark': '#120a0b',
        'navy-dark': '#002C3A',

        // ALIAS MAPPING for backward compatibility
        // These map the old naming to the new consolidated system
        brandNeutral: {
          '01': '#fff', // neutral-white
          '02': '#FBF8FF', // neutral-off-white
          '03': '#454140', // neutral-medium
          '04': '#120a0b', // neutral-dark
          stroke: '#e3e2e2', // neutral-stroke
        },

        // Legacy brand theme colors (map to micro header colors)
        brandTheme: {
          '01': '#f0e7fe', // purple-light
          '02': '#e7f0fe', // blue-light
          '03': '#e7fcfe', // green-light
          '04': '#fefce7', // sand
        },

        // Legacy aliases
        'light-grey': '#F1F1F1', // neutral-light-grey
        'brand-50': '#f0e7fe', // purple-light
        'brand-100': '#F0E7FE', // purple-light (same)
        'brand-900': '#280772', // Keep for now if needed

        // Semantic colors
        semantic: {
          'neutral-200': '#e5e7eb',
          'neutral-200-dark': '#374151',
          'warning-400': '#fbbf24',
          'warning-400-dark': '#f59e0b',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1.5rem', // 24px
      },
      fontFamily: {
        sans: ['Rebond Grotesque', 'sans-serif'],
      },
      fontSize: {
        'display-h1': '4rem', // 64px
        h2: '3.375rem', // 54px
        h3: '2.25rem', // 36px
        h4: '1.5rem', // 24px
        'body-22': '1.375rem', // 22px
        'body-20': '1.25rem', // 20px
        'body-18': '1.125rem', // 18px
        'body-16': '1rem', // 16px
        'body-14': '0.875rem', // 14px
      },
      letterSpacing: {
        'custom-tightest': '-2px',
        'custom-tighterer': '-1.5px',
        'custom-tight': '-1px',
        'custom-tighter': '-0.5px',
      },
      lineHeight: {
        1: '1',
        1.07: '1.07',
        1.15: '1.15',
        1.4: '1.4',
        1.7: '1.7',
      },
      keyframes: {
        'slide-ltr': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-40%)' },
        },
        'slide-rtl': {
          '0%, 100%': { transform: 'translateX(-40%)' },
          '50%': { transform: 'translateX(0%)' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'slide-ltr': 'slide-ltr 15s ease-in-out infinite alternate',
        'slide-rtl': 'slide-rtl 15s ease-in-out infinite alternate',
        'accordion-down': 'accordion-down 200ms cubic-bezier(0.215, 0.61, 0.355, 1)',
        'accordion-up': 'accordion-up 200ms cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.brandNeutral.04'),
            '--tw-prose-headings': theme('colors.brandNeutral.04'),
            '--tw-prose-lead': theme('colors.brandNeutral.04'),
            '--tw-prose-links': theme('colors.brand-900'),
            '--tw-prose-bold': theme('colors.brandNeutral.04'),
            '--tw-prose-invert-body': theme('colors.brand-100'),
            '--tw-prose-invert-headings': theme('colors.brand-100'),
            '--tw-prose-invert-lead': theme('colors.brand-100'),
            '--tw-prose-invert-links': theme('colors.brand-100'),
            '--tw-prose-invert-bold': theme('colors.brand-100'),
            '--tw-prose-bullets': theme('colors.brand-900'),
            '--tw-prose-invert-bullets': theme('colors.brand-100'),
            '--tw-prose-counters': theme('colors.brand-900'),
            '--tw-prose-invert-counters': theme('colors.brand-100'),
            p: {
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.relaxed'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
            },
            h2: {
              color: 'var(--tw-prose-headings)',
              fontWeight: theme('fontWeight.normal'),
              fontSize: theme('fontSize.3xl'),
              lineHeight: theme('lineHeight.tight'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
            h3: {
              color: 'var(--tw-prose-headings)',
              fontWeight: theme('fontWeight.normal'),
              fontSize: theme('fontSize.2xl'),
              lineHeight: theme('lineHeight.8'),
              textAlign: 'center',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
            },
            ul: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.6'),
              listStyleType: 'disc',
            },
            ol: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.6'),
              listStyleType: 'decimal',
            },
            li: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.relaxed'),
              color: 'var(--tw-prose-body)',
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
            },
            'li > p': {
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.relaxed'),
              color: 'var(--tw-prose-body)',
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            a: {
              fontWeight: '500',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
        xl: {
          css: {
            p: {
              fontSize: theme('fontSize.lg'),
              lineHeight: theme('lineHeight.relaxed'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
            },
            h2: {
              fontSize: theme('fontSize.2xl'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.5'),
            },
            h3: {
              fontSize: theme('fontSize.3xl'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}