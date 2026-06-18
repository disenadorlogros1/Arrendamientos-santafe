'use client';

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark pb-12 md:pb-16" style={{ marginTop: '-43px', paddingTop: 'calc(43px + 48px)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Política de tratamiento de datos personales
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Información sobre el tratamiento de tus datos personales en
            Arrendamientos Santa Fe.
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
            1. Responsable del tratamiento
          </h2>
          <p>
            Arrendamientos Santa Fe, con sedes en Medellín, Envigado y Rionegro,
            es responsable del tratamiento de los datos personales recopilados a
            través de este sitio web y sus canales de atención.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            2. Finalidad del tratamiento
          </h2>
          <p>
            Los datos personales que recopilamos son utilizados para gestionar
            solicitudes de información sobre inmuebles, atender requerimientos
            de propietarios e inquilinos, brindar asesoría inmobiliaria y
            cumplir con obligaciones legales y contractuales.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            3. Derechos del titular
          </h2>
          <p>
            Como titular de los datos, tienes derecho a conocer, actualizar,
            rectificar y solicitar la supresión de tu información personal, de
            acuerdo con la Ley 1581 de 2012 y demás normas aplicables en
            Colombia.
          </p>

          <h2 className="text-xl font-semibold text-brand-dark mt-6">
            4. Contacto
          </h2>
          <p>
            Para ejercer tus derechos o consultar más información sobre el
            tratamiento de tus datos, escríbenos al correo{' '}
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
