/** @type {import('tailwindcss').Config} */
export default {
  content: ["./resources/**/*.{blade.php,js}"],
  theme: {
    extend: {
        colors: {
            mart: '#DD8888',
            mainColor: '#0c535d',
        }
    },
  },
  plugins: [
      require("daisyui")
  ],
}

