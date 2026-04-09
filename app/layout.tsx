export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Homerun Tracker</title>
      </head>
      <body style={{ margin: 0, background: "#0a0a0f", fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
