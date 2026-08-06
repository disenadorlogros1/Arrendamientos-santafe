'use client';

import type { PageType } from '@/components/Header';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

const MAPS_MEDELLIN  = 'https://www.google.com/maps/search/?api=1&query=Calle+44+San+Juan+%2371-34+Medell%C3%ADn+Colombia';
const MAPS_ENVIGADO  = 'https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Metrosur+Envigado+Colombia';
const MAPS_RIONEGRO  = 'https://www.google.com/maps/place/Arrendamientos+Santa+Fe+(Sede+Oriente)/@6.1510685,-75.3909208,17z/data=!3m1!4b1!4m6!3m5!1s0x8e469f8d247f8ce7:0xc523feec61704f93!8m2!3d6.1510685!4d-75.3909208!16s%2Fg%2F11zct5lk41?entry=ttu&g_ep=EgoyMDI2MDcyMC4wIKXMDSoASAFQAw%3D%3D';
const PSE_URL = 'https://www.psepagos.co/PSEHostingUI/ShowTicketOffice.aspx?ID=9011';
const SOLICITUD_ARRENDAMIENTO_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfAg9SMibueBBUy-Pe1rQuO1Rz7U4z7z9uq91pv-gp-0-dCgQ/viewform';
const REPARACIONES_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdwCAaLU5ApyfAvf-yEEgj-fMQmnBRIh4614LhDIWtKhBDzyQ/viewform';
const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe.';
const FACEBOOK_URL = 'https://www.facebook.com/arrendamientossantafe';
const INSTAGRAM_URL = 'https://www.instagram.com/arrendamientossantafe';
const TIKTOK_URL = 'https://www.tiktok.com/@arrendamientossantafe';

export default function Footer({ onNavigate }: FooterProps = {}) {
  return (
    <footer className="relative bg-brand-dark text-white" style={{ zIndex: 5 }}>
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Marca */}
          <div className="space-y-4">
            <img
              src="/icons/Logotipo_Logoblanco.svg"
              alt="Arrendamientos Santa Fe"
              className="h-10 w-auto object-contain"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              Una empresa antioqueña con historia. Para quienes buscan, para quienes confían.
            </p>
            <div className="flex gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                aria-label="Facebook Arrendamientos Santa Fe"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                aria-label="Instagram Arrendamientos Santa Fe"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition-colors"
                aria-label="TikTok Arrendamientos Santa Fe"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>

          {/* Sedes */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Nuestras sedes
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <img src="/icons/icon-location-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                <a href={MAPS_MEDELLIN} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors font-semibold">
                  Medellín
                </a>
              </li>
              <li className="flex items-center gap-2">
                <img src="/icons/icon-location-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                <a href={MAPS_ENVIGADO} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors font-semibold">
                  Envigado
                </a>
              </li>
              <li className="flex items-center gap-2">
                <img src="/icons/icon-location-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                <a href={MAPS_RIONEGRO} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors font-semibold">
                  Rionegro
                </a>
              </li>
            </ul>
          </div>

          {/* Accesos rápidos / operativos */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Accesos rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={PSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-credit-card-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  Pagar en línea (PSE)
                </a>
              </li>
              <li>
                <a
                  href={SOLICITUD_ARRENDAMIENTO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-FileText-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  Solicitud de arrendamiento
                </a>
              </li>
              <li>
                <a
                  href={REPARACIONES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-wrench-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  Reportar una reparación
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-whatsapp-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  Hablar con un asesor
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+5746044484015"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-phone-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  (604) 448 4015
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-whatsapp-red.svg" className="h-4 w-4 shrink-0" alt="" aria-hidden="true" />
                  (+57) 300 655 7529
                </a>
              </li>
              <li>
                <a
                  href="mailto:santafe@arrendamientossantafe.com"
                  className="flex items-start gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <img src="/icons/icon-mail-red.svg" className="h-4 w-4 shrink-0 mt-[2px]" alt="" aria-hidden="true" />
                  <span style={{ wordBreak: 'break-all' }}>santafe@arrendamientossantafe.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Horarios
            </h4>
            <div className="flex items-start gap-2 text-sm text-white/60">
              <img src="/icons/icon-clock-red.svg" className="h-4 w-4 mt-0.5 shrink-0" alt="" aria-hidden="true" />
              <span>
                <span className="block font-medium text-white/80 whitespace-nowrap">Lunes a viernes:</span>
                <span className="block whitespace-nowrap">8:00 a.m. – 12:00 m.</span>
                <span className="block whitespace-nowrap">1:00 p.m. – 5:00 p.m.</span>
                <span className="block mt-2 font-medium text-white/80 whitespace-nowrap">Sábado:</span>
                <span className="block whitespace-nowrap">8:00 a.m. – 1:00 p.m.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright + legales */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Arrendamientos Santa Fe. Todos los derechos reservados.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            Antioquia, Colombia
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            {onNavigate ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('politicas')}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  Política de datos
                </button>
                <span className="text-white/20">·</span>
                <button
                  type="button"
                  onClick={() => onNavigate('terminos')}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  Términos y condiciones
                </button>
              </>
            ) : (
              <span className="text-white/40">60 años de experiencia inmobiliaria</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
