import '../app/globals.css';  // นำเข้าไฟล์ CSS หลัก (Tailwind CSS)

function MyApp({ Component, pageProps }) {
  // Component คือหน้าที่จะถูกเรนเดอร์ (เช่น sign-in.js)
  return <Component {...pageProps} />;
}

export default MyApp;