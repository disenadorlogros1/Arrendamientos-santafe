'use client';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Términos y condiciones
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Condiciones de uso del sitio web de Arrendamientos Santa Fe.
          </p>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6 text-brand-gray leading-relaxed">
          <p className="text-sm text-gray-400 italic">
            Versión preliminar — pendiente de revisión por el equipo legal de
            Arrendamientos Santa Fe.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            1. Aceptación de los términos
          </h2>
          <p>
            Al ingresar y usar este sitio web, aceptas los presentes Términos y
            Condiciones. Si no estás de acuerdo con alguno de los apartados, te
            sugerimos abstenerte de usar la plataforma.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            2. Información publicada
          </h2>
          <p>
            La información sobre inmuebles, servicios y procesos publicada en
            este sitio tiene carácter informativo. Arrendamientos Santa Fe
            procura mantener la información actualizada, pero la disponibilidad
            y características de los inmuebles pueden variar.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            3. Propiedad intelectual
          </h2>
          <p>
            Los contenidos, marcas, logos, fotografías y demás elementos de
            este sitio son propiedad de Arrendamientos Santa Fe o se utilizan
            con autorización. Queda prohibida su reproducción sin autorización
            previa.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            4. Enlaces a terceros
          </h2>
          <p>
            Este sitio contiene enlaces a plataformas externas (PSE, Google
            Forms, WhatsApp). Arrendamientos Santa Fe no se hace responsable de
            las prácticas de privacidad o el contenido de sitios web de
            terceros.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            5. Contacto
          </h2>
          <p>
            Para consultas sobre estos términos, escríbenos al correo{' '}
            <a
              href="mailto:santafe@arrendamientossantafe.com"
              className="text-brand-red hover:underline"
            >
              santafe@arrendamientossantafe.com
            </a>
            .
          </p>

          <p className="text-xs text-gray-400 mt-10 pt-6 border-t border-gray-200">
            Última actualización: pendiente. Documento informativo, no
            constituye versión final.
          </p>
        </div>
      </section>
    </div>
  );
}
