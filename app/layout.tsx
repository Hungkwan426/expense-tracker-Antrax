export const metadata = {
  title: 'Expense Tracker',
  description: 'Simple expense tracker app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
