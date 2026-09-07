export const metadata = {
  title: 'Tallaght Gaels Hub',
  description: 'Nature of Enterprise CA',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
