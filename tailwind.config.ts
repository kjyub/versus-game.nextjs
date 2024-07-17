import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                zero: "0px",
                "3xl": "1800px",
            },
            backgroundSize: {
                "size-200": "200% 200%",
            },
            backgroundPosition: {
                "pos-0": "0% 0%",
                "pos-100": "100% 100%",
            },
            colors: {
                gray: {
                    75: "#f6f7f8",
                    150: "#eceef1",
                    250: "#c7ccd4",
                    275: "#cbced1",
                },
                slate: {
                    60: "#f7f9ff",
                    150: "#e8eef4",
                    350: "#b0bccc",
                },
                nightblue: {
                    10: "#fcfdfe",
                    20: "#f8fbff",
                    50: "#eff6ff",
                    100: "#dee7f3",
                    200: "#bfdbfe",
                    300: "#85addb",
                    400: "#5195cc",
                    500: "#347FBD",
                    600: "#2a5f9c",
                    700: "#1f528c",
                    800: "#093e7a",
                    900: "#1e3a8a",
                },
            },
            spacing: {
                n1: "-0.25rem",
                n2: "-0.5rem",
                n4: "-1rem",
                n8: "-2rem",
                0.25: "0.0625rem",
                0.5: "0.125rem",
                0.75: "0.1875rem",
                1.25: "0.3125rem",
                1.5: "0.375rem",
                1.75: "0.4375rem",
                2.5: "0.625rem",
                128: "32rem",
                192: "48rem",
                256: "64rem",
            },
            width: {
                128: "32rem",
                136: "36rem",
                156: "44rem",
                192: "48rem",
                256: "64rem",
                384: "96rem",
                512: "128rem",
                inherit: "inherit",
            },
            height: {
                112: "28rem",
                128: "32rem",
                156: "44rem",
                192: "48rem",
                256: "64rem",
                384: "96rem",
                512: "128rem",
                "1/12": "8.333333%",
                "2/12": "16.666667%",
                "3/12": "25%",
                "4/12": "33.333333%",
                "5/12": "41.666667%",
                "6/12": "50%",
                "7/12": "58.333333%",
                "8/12": "66.666667%",
                "9/12": "75%",
                "10/12": "83.333333%",
                "11/12": "91.666667%",
            },
        },
    },
    plugins: [
        function({ addUtilities }) {
          const newUtilities = {
            '.backdrop-blur': {
              '-webkit-backdrop-filter': 'blur(10px)',
              'backdrop-filter': 'blur(10px)',
            },
          }
          addUtilities(newUtilities, ['responsive', 'hover']);
        }
    ],
}
export default config
