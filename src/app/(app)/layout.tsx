import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='flex flex-col min-h-screen'>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
