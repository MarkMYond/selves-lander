/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
    safelist: [
    // Ensure dynamic background classes are included
    'bg-brand-50',
    'bg-white', // Added missing comma here
    'bg-gray-100', // Keep if still used for 'light-grey' mapping below
    'bg-light-grey', // Add the actual color name
    'bg-brand-900', // Added
    'bg-brand-primary', // Added
    // Brand theme colors for Why Choose Us icons
    'bg-brandTheme-01',
    'bg-brandTheme-02',
    'bg-brandTheme-03',
    'bg-brandTheme-04',
    // Brand neutral colors for Why Choose Us icons
    'bg-brandNeutral-01',
    'bg-brandNeutral-02',
    'bg-brandNeutral-03',
    'bg-brandNeutral-04',
    // Safelist pattern for light card backgrounds
    {
       pattern: /bg-(red|blue|green|yellow|orange|purple|pink|gray)-(100|200)/,
    },
    {
      // Existing primary colors
      pattern: /^bg-primary-(25|50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      // New Micro Header colors
      // Ensure light-grey pattern is included if used elsewhere, or rely on explicit safelist above
      pattern: /^bg-(sand|pink-light|coral-light|pink-mid|purple-light|blue-light|aqua-light|green-light|light-green|grass-light|navy-dark)$/, // Removed light-grey from pattern if explicitly listed
    },
    // You might also need to safelist the default gradient if it's applied conditionally
    // 'from-indigo-500',
    // 'to-purple-600',
    // 'bg-gradient-to-r', // Already used elsewhere, probably safe, but uncomment if needed
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem', // Default padding, can be overridden with px-* utilities
  		screens: {
        sm: '640px',    // Tailwind default
        md: '768px',    // Tailwind default
        lg: '1024px',   // Tailwind default
        xl: '1280px',   // New max width
        '2xl': '1280px', // Cap at new max width
  		}
  	},
    boxShadow: {
      sm: 'none',
      DEFAULT: 'none', // for 'shadow' class
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
    },
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
          DEFAULT: '#120a0b', // Updated to brandNeutral.04
          foreground: '#fff',    // Updated to brandNeutral.01 for contrast
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Add RemixCo specific colors
  			'remixco-blue': '#0066ff',
  			'remixco-text-primary': '#111827', // Dark Gray (Keep for now, might be overridden by hero)
  			'remixco-text-muted': '#6b7280',   // Medium Gray (Keep for now)
  			// Hero specific colors from JSON
  			'remixco-hero-bg': '#E7DEFD',
  			'remixco-purple-accent': '#A78BFA',
  				'remixco-dark-purple': '#1E0D43',
  				'remixco-icon-purple': '#714AE3',
  				// Brand Colors (add more as needed)
          // 'brand-primary': '#3713A2', // Removed, as primary is now brandNeutral.04
  				'brand-50': '#F7F3FF',  // Brand 50 purple
          'brand-100': '#F0E7FE', // Added Brand 100 purple
          'brand-900': '#280772', // Brand 900 purple
          // Add new Micro Header colors
          'sand': '#fefce7',
          'pink-light': '#fef1e7',
          'coral-light': '#fee7e8',
          'pink-mid': '#fee7fa',
          'purple-light': '#f0e7fe',
          'blue-light': '#e7f0fe',
          'aqua-light': '#e7f9fe',
          'green-light': '#e7fcfe',
          'light-green': '#e7fef9',
          'grass-light': '#e7fee8',
          'light-grey': '#F1F1F1',
          'navy-dark': '#002C3A',
          'webflow-theme-1': '#9886fe', // Added for dashboard background
  				chart: {
  					'1': 'hsl(var(--chart-1))',
  					'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        brandNeutral: {
          '01': '#fff',      // --neutral-neutral-01
          '02': '#FBF8FF',   // --neutral-neutral-02 (New value)
          '03': '#454140',   // --neutral-neutral-03
          '04': '#120a0b',   // --neutral-neutral-04
          'stroke': '#e3e2e2', // --neutral-stroke
        },
        brandTheme: {
          '01': '#e6e1f0', // --theme-colors-color-01 (light purple)
          '02': '#d9e8f0', // --theme-colors-color-02 (light blue)
          '03': '#d8eae7', // --theme-colors-color-03 (light green)
          '04': '#fbf2d6', // --theme-colors-color-04 (light yellow)
        },
        // Semantic colors for light and dark modes
        semantic: {
          'neutral-200': '#e5e7eb',     // Light mode neutral
          'neutral-200-dark': '#374151', // Dark mode neutral
          'warning-400': '#fbbf24',      // Light mode warning
          'warning-400-dark': '#f59e0b', // Dark mode warning
        },
  		},
  		borderRadius: {
  			lg: 'var(--radius)', // This is 0.5rem (8px) from your CSS variables
  			md: 'calc(var(--radius) - 2px)', // This would be 6px
  			sm: 'calc(var(--radius) - 4px)', // This would be 4px
        xl: '0.75rem' // Added 12px border radius
  		},
  		fontFamily: {
  			sans: ['Satoshi', 'sans-serif'], // Set Satoshi as default sans font
  		},
      fontSize: {
        'display-h1': '4rem',    // 64px
        'h2': '3.375rem',        // 54px
        'h3': '2.25rem',         // 36px
        'h4': '1.5rem',          // 24px
        'body-22': '1.375rem',   // 22px
        'body-20': '1.25rem',    // 20px
        'body-18': '1.125rem',   // 18px
        'body-16': '1rem',       // 16px (Tailwind 'base')
        'body-14': '0.875rem',   // 14px (Tailwind 'sm')
      },
      letterSpacing: {
        'custom-tightest': '-2px',
        'custom-tighterer': '-1.5px',
        'custom-tight': '-1px',
        'custom-tighter': '-0.5px',
        // 'normal' is already available as 'tracking-normal' (0px)
      },
      lineHeight: {
        '1': '1',               // For .HeadlineDisplay-H1
        '1.07': '1.07',         // For .HeadlineH2
        '1.15': '1.15',         // For .HeadlineH1
        // '1.25': '1.25',      // For .Body22pxRegular (Tailwind 'tight')
        '1.4': '1.4',           // For .HeadlineH3, .HeadlineH4
        // '1.5': '1.5',        // For .Body20pxMedium, .Body18pxMedium, .Body16pxMedium (Tailwind 'normal')
        '1.7': '1.7',           // For .Body20pxBold, .Body18pxBold, .Body18pxRegular, .Body16pxBold, .Body16pxRegular, .Body14pxMedium, .Body14pxBold, .Body14pxRegular
        // Tailwind already has leading-tight (1.25), leading-normal (1.5), leading-relaxed (1.625), leading-loose (2)
        // Adding only those not closely matched by existing Tailwind values or those specified exactly.
      },
  		keyframes: {
        'slide-ltr': {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-40%)' }, // Slide 40%
        },
        'slide-rtl': {
          '0%, 100%': { transform: 'translateX(-40%)' }, // Start offset
          '50%': { transform: 'translateX(0%)' }, // Slide back to origin
        },
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			}
  		},
  		animation: {
        'slide-ltr': 'slide-ltr 15s ease-in-out infinite alternate', // Slower, ease, alternate direction
        'slide-rtl': 'slide-rtl 15s ease-in-out infinite alternate', // Slower, ease, alternate direction
  			'accordion-down': 'accordion-down 200ms cubic-bezier(0.215, 0.61, 0.355, 1)',
  			'accordion-up': 'accordion-up 200ms cubic-bezier(0.215, 0.61, 0.355, 1)',
  		},
      typography: ({ theme }) => ({
        DEFAULT: { // Standard prose styles
          css: {
            '--tw-prose-body': theme('colors.brandNeutral.04'),
            '--tw-prose-headings': theme('colors.brandNeutral.04'),
            '--tw-prose-lead': theme('colors.brandNeutral.04'), // Also update lead to match body/headings
            '--tw-prose-links': theme('colors.brand-primary'), // Links might need separate consideration, keeping for now
            '--tw-prose-bold': theme('colors.brandNeutral.04'), // Also update bold to match
            // Inverted (dark mode) colors
            '--tw-prose-invert-body': theme('colors.brand-100'),
            '--tw-prose-invert-headings': theme('colors.brand-100'),
            '--tw-prose-invert-lead': theme('colors.brand-100'),
            '--tw-prose-invert-links': theme('colors.primary.300'), // Lighter primary for dark links
            '--tw-prose-invert-bold': theme('colors.brand-100'),
            // For list markers
            '--tw-prose-bullets': theme('colors.brand-primary'),
            '--tw-prose-invert-bullets': theme('colors.primary.400'), // Lighter primary shade for dark mode
            '--tw-prose-counters': theme('colors.brand-900'),
            '--tw-prose-invert-counters': theme('colors.primary.400'), // Lighter primary shade for dark mode
            p: {
              fontSize: theme('fontSize.base'), // Changed to text-base
              lineHeight: theme('lineHeight.relaxed'), // Changed to leading-relaxed
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
            },
            h2: {
              color: 'var(--tw-prose-headings)',
              fontWeight: theme('fontWeight.normal'), // Explicitly set to normal weight
              fontSize: theme('fontSize.3xl'), // Further reduced from 4xl to 3xl (original was 5xl)
              lineHeight: theme('lineHeight.tight'),
              letterSpacing: theme('letterSpacing.tight'),
              marginTop: theme('spacing.8'), // Matches SectionHeaderBlock H2 mt-8
              marginBottom: theme('spacing.4'), // Matches SectionHeaderBlock H2 mb-4
            },
            h3: {
              color: 'var(--tw-prose-headings)',
              fontWeight: theme('fontWeight.normal'), // Explicitly set to normal weight
              fontSize: theme('fontSize.2xl'), // User specified text-2xl
              lineHeight: theme('lineHeight.8'), // User specified leading-8
              textAlign: 'center', // User specified text-center
              // letterSpacing: theme('letterSpacing.tight'), // User H3 example did not have tracking-tight
              marginTop: theme('spacing.6'), // Matches SectionHeaderBlock H3 mt-6
              marginBottom: theme('spacing.3'), // Matches SectionHeaderBlock H3 mb-3
            },
            // Add styles for other headings (h4, h5, h6) if needed
            ul: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.6'),
              listStyleType: 'disc', // Default
            },
            ol: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.6'),
              listStyleType: 'decimal', // Default
            },
            li: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.base'), // Match paragraph
              lineHeight: theme('lineHeight.relaxed'), // Match paragraph
              color: 'var(--tw-prose-body)', // Explicitly set li text color
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
              // Markers will inherit color from --tw-prose-bullets/counters
            },
            // Ensure nested list items also get the font feature settings
            'li > p': { // If paragraphs are nested inside list items
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.relaxed'),
              color: 'var(--tw-prose-body)', // Explicitly set li > p text color
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
              marginTop: theme('spacing.2'), // Adjust if needed
              marginBottom: theme('spacing.2'), // Adjust if needed
            },
            a: {
              fontWeight: '500', // medium
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
        xl: { // Larger prose styles variant
          css: {
            // Note: If you use prose-xl, you might want to adjust these p, ul, ol, li styles here too.
            // For now, focusing on DEFAULT prose.
            p: {
              fontSize: theme('fontSize.lg'), // Example: text-lg for prose-xl paragraphs
              lineHeight: theme('lineHeight.relaxed'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.5'),
              fontVariantLigatures: 'stylistic',
              fontFeatureSettings: '"ss01"',
            },
             h2: { // Adjust H2 size for larger context if needed
              fontSize: theme('fontSize.2xl'), // Further reduced from 3xl to 2xl for prose-xl (original was 4xl)
              letterSpacing: theme('letterSpacing.tight'), // Added tighter tracking to match h3
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.5'),
            },
            h3: { // Adjust H3 size for larger context
              fontSize: theme('fontSize.3xl'), // Example: 3xl for H3 in prose-xl
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
            // ... potentially adjust other elements for prose-xl
          },
        },
      }),
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"), // Add the typography plugin
  ],
}
