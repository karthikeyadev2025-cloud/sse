/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f0', 100: '#d5ecda', 200: '#a9d7b3', 300: '#6fb97f', 400: '#3f9853',
          500: '#227a38', 600: '#17632b', 700: '#124f23', 800: '#0f3f1e', 900: '#0b3018', 950: '#061c0e',
        },
        gold: { 50: '#fff9e6', 100: '#fff0bf', 200: '#ffe07a', 300: '#fdcf3a', 400: '#f8bd12', 500: '#eaa707', 600: '#c98503', 700: '#9f6106' },
        ink: '#10201a',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,32,26,.06), 0 8px 24px -12px rgba(16,32,26,.18)',
        lift: '0 18px 40px -18px rgba(11,48,24,.45)',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'none' } },
        pulseRing: { '0%': { transform: 'scale(1)', opacity: .6 }, '100%': { transform: 'scale(1.7)', opacity: 0 } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        kenburns: { '0%': { transform: 'scale(1.0)' }, '100%': { transform: 'scale(1.12)' } },
        progress: { '0%': { width: '0%' }, '100%': { width: '100%' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        fadeUp: 'fadeUp .7s cubic-bezier(.2,.7,.2,1) both',
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        marquee: 'marquee 40s linear infinite',
        kenburns: 'kenburns 9s ease-out both',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
