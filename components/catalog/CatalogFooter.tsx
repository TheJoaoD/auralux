/**
 * Catalog Footer Component
 * Epic 1 - Story 1.4: Estrutura de Rotas e Layout
 */

import Link from 'next/link'
import { Instagram, Facebook, Mail } from 'lucide-react'

export function CatalogFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Auralux
            </h3>
            <p className="text-sm text-muted-foreground">
              Perfumes de luxo com qualidade e elegância para cada ocasião.
            </p>
          </div>

          {/* Links - Catálogo */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Catálogo</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/catalogo"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ver Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo/produtos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo/solicitar-produto"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Solicitar Produto
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/5563984830308"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@auralux.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  E-mail
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Redes Sociais</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:contato@auralux.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Auralux. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
