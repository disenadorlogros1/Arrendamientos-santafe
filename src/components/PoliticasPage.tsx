'use client';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const SECTIONS = [
  {
    number: '01',
    title: 'Responsable del tratamiento',
    content: [
      'ARRENDAMIENTOS SANTA FE E.U., NIT 890907752-3, con sedes en Medellín, Envigado y Rionegro, es el responsable del tratamiento de los datos personales recopilados a través de sus canales de atención, formularios físicos y digitales, y el sitio web www.arrendamientossantafe.com.',
      'Esta política se aplica a clientes, propietarios, arrendatarios, proveedores y empleados, y se rige por la Ley 1581 de 2012, la Ley 1266 de 2008 y el Decreto 1074 de 2015.',
    ],
  },
  {
    number: '02',
    title: 'Información recopilada',
    content: [
      'Los datos personales se recogen mediante llamadas telefónicas, visitas presenciales, formularios físicos, correo electrónico, aplicaciones de mensajería instantánea, el sitio web, bases de datos públicas, centrales de riesgo y plataformas de redes sociales.',
    ],
    list: [
      'Nombres completos (razón social para personas jurídicas)',
      'Número de cédula de ciudadanía o NIT',
      'Información laboral e ingresos salariales',
      'Género',
      'Teléfonos de contacto y aplicaciones de mensajería',
      'Dirección residencial y laboral',
      'Correo electrónico',
      'Referencias personales y comerciales',
      'Información de entidad financiera y número de cuenta bancaria',
    ],
  },
  {
    number: '03',
    title: 'Finalidad del tratamiento',
    content: [
      'Al suministrar sus datos, el titular autoriza a ARRENDAMIENTOS SANTA FE E.U. para recopilar, almacenar, transferir, procesar, administrar y eliminar su información personal con los siguientes fines:',
    ],
    list: [
      'Fines administrativos y comerciales internos',
      'Investigación de mercados y análisis estadístico',
      'Encuestas de satisfacción y oferta de servicios',
      'Gestión de cobranza directa o a través de terceros',
      'Mantenimiento de registros históricos',
      'Gestión de relaciones con proveedores',
    ],
    extraContent: [
      'De manera específica, la empresa podrá consultar centrales de riesgo, verificar la información suministrada, compartir datos con proveedores de servicios terceros contratados, comunicarse con accionistas, realizar controles de prevención de fraude y lavado de activos, ejecutar contratos comerciales, y realizar gestiones de cobro telefónicas, por SMS y digitales.',
    ],
  },
  {
    number: '04',
    title: 'Transmisión de datos a terceros',
    content: [
      'La empresa se compromete a no vender ni compartir de forma no autorizada la información personal. No obstante, podrá revelar información para:',
    ],
    list: [
      'Cumplir con obligaciones legales',
      'Acatar leyes, reglamentos, citaciones judiciales o órdenes de tribunales',
      'Atender requerimientos de autoridades gubernamentales o regulatorias',
      'Apoyar servicios de cobranza de terceros',
    ],
    extraContent: [
      'Toda transmisión mantendrá las protecciones legales que amparan a los titulares de datos.',
    ],
  },
  {
    number: '05',
    title: 'Medidas de protección',
    content: [
      'La organización implementa protocolos seguros que incluyen:',
    ],
    list: [
      'Procedimientos de acceso restringido',
      'Prácticas de desarrollo de software seguro',
      'Acceso administrativo limitado a bases de datos',
      'Acuerdos de confidencialidad con terceros',
      'Procedimientos que previenen el tratamiento parcial, incompleto o engañoso de datos',
    ],
  },
  {
    number: '06',
    title: 'Derechos del titular',
    content: [
      'Como titular de los datos personales, usted tiene derecho a:',
    ],
    list: [
      'Acceder, actualizar y corregir su información personal',
      'Solicitar prueba de la autorización otorgada al responsable',
      'Recibir información sobre el uso de sus datos',
      'Presentar quejas ante la Superintendencia de Industria y Comercio de Colombia',
      'Revocar la autorización y solicitar la eliminación de sus datos',
      'Obtener acceso gratuito a sus datos personales tratados',
    ],
  },
  {
    number: '07',
    title: 'Canal de atención al titular',
    content: [
      'Para ejercer sus derechos, solicitar información o presentar reclamaciones relacionadas con el tratamiento de sus datos personales, puede contactarnos por los siguientes medios:',
    ],
    contact: [
      { label: 'Teléfono', value: '448 40 15 ext. 101' },
      { label: 'Correo electrónico', value: 'santafe@arrendamientossantafe.com', href: 'mailto:santafe@arrendamientossantafe.com' },
      { label: 'Dirección', value: 'Calle 44 #71-34, Medellín, Antioquia' },
    ],
  },
  {
    number: '08',
    title: 'Vigencia de la política',
    content: [
      'Esta política rige los datos recopilados desde el 25 de julio de 2013 y permanece vigente hasta que se cumpla la finalidad del tratamiento original.',
      'Última actualización: octubre de 2023.',
    ],
  },
];

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: FONT }}>

      {/* Encabezado oscuro */}
      <div
        className="bg-brand-dark"
        style={{ marginTop: '-86px', paddingTop: 'calc(86px + 52px)', paddingBottom: '52px' }}
      >
        <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-10">
          <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Arrendamientos Santa Fe · NIT 890907752-3
          </p>
          <h1 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(26px, 3vw, 40px)', color: '#fff', lineHeight: 1.15, margin: 0 }}>
            Política de tratamiento<br />
            <span style={{ fontWeight: 300 }}>de datos personales</span>
          </h1>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
            Ley 1581 de 2012 · Ley 1266 de 2008 · Decreto 1074 de 2015
          </p>
        </div>
      </div>

      {/* Cuerpo del documento */}
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-10 py-14">

        {SECTIONS.map((section) => (
          <div key={section.number} style={{ marginBottom: '44px' }}>

            {/* Número + título */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
              <span style={{
                fontFamily: FONT,
                fontSize: '11px',
                fontWeight: 700,
                color: RED,
                letterSpacing: '0.08em',
                flexShrink: 0,
                paddingTop: '3px',
              }}>
                {section.number}
              </span>
              <h2 style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 'clamp(15px, 1.2vw, 18px)',
                color: '#1a1a1a',
                margin: 0,
                lineHeight: 1.3,
              }}>
                {section.title}
              </h2>
            </div>

            {/* Línea roja izquierda */}
            <div style={{ borderLeft: `2px solid ${RED}`, paddingLeft: '20px' }}>

              {section.content.map((para, i) => (
                <p key={i} style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: '14px',
                  color: '#444',
                  lineHeight: 1.7,
                  margin: '0 0 10px',
                }}>
                  {para}
                </p>
              ))}

              {section.list && (
                <ul style={{ margin: '6px 0 10px', padding: '0 0 0 16px' }}>
                  {section.list.map((item, i) => (
                    <li key={i} style={{
                      fontFamily: FONT,
                      fontWeight: 300,
                      fontSize: '14px',
                      color: '#555',
                      lineHeight: 1.65,
                      marginBottom: '4px',
                    }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.extraContent?.map((para, i) => (
                <p key={i} style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: '14px',
                  color: '#444',
                  lineHeight: 1.7,
                  margin: '10px 0 0',
                }}>
                  {para}
                </p>
              ))}

              {section.contact && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {section.contact.map((c) => (
                    <div key={c.label} style={{ display: 'flex', gap: '10px', fontSize: '14px', fontWeight: 300 }}>
                      <span style={{ color: '#999', flexShrink: 0, minWidth: '130px' }}>{c.label}:</span>
                      {c.href ? (
                        <a href={c.href} style={{ color: RED, textDecoration: 'none' }}>{c.value}</a>
                      ) : (
                        <span style={{ color: '#444' }}>{c.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

        {/* Pie */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '8px' }}>
          <p style={{ fontSize: '12px', color: '#aaa', fontWeight: 300, margin: 0 }}>
            © Arrendamientos Santa Fe E.U. · Todos los derechos reservados.
            Este documento tiene carácter informativo y no reemplaza asesoría jurídica especializada.
          </p>
        </div>

      </div>
    </div>
  );
}
