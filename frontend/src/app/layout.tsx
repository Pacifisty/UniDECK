import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UniDECK - Sistema Municipal de Gestão Documental',
  description: 'Sistema Municipal de Gestão Documental e Protocolo Eletrônico',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
