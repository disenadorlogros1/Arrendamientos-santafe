'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Percent, FileText, Handshake, MessageCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HipotecasPage() {
  const [loanAmount, setLoanAmount] = useState(150000000);
  const [term, setTerm] = useState(20);
  const [rate, setRate] = useState(12.5);

  const monthlyRate = rate / 100 / 12;
  const totalPayments = term * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : loanAmount / totalPayments;
  const totalPayment = monthlyPayment * totalPayments;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const features = [
    {
      icon: Percent,
      title: 'Orientación sobre tasas',
      description: 'Información clara sobre tasas de interés y alternativas disponibles en el mercado.',
    },
    {
      icon: FileText,
      title: 'Acompañamiento en el proceso',
      description: 'Te orientamos sobre los documentos, requisitos y etapas del crédito hipotecario.',
    },
    {
      icon: Handshake,
      title: 'Conexión con entidades',
      description: 'Te conectamos con entidades financieras reconocidas para evaluar opciones.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Asesoría hipotecaria
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Te orientamos en alternativas de préstamo sobre propiedad raíz con
              información clara y acompañamiento durante el proceso.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Calculator */}
      <section className="py-12 md:py-16 bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="h-6 w-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Calculadora hipotecaria</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Valor del crédito</span>
                      <span className="text-brand-red font-bold">{formatCurrency(loanAmount)}</span>
                    </label>
                    <input
                      type="range"
                      min={50000000}
                      max={500000000}
                      step={10000000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-[#f32735]"
                    />
                    <div className="flex justify-between text-xs text-brand-gray mt-1">
                      <span>$50M</span>
                      <span>$500M</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Plazo</span>
                      <span className="text-brand-red font-bold">{term} años</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full accent-[#f32735]"
                    />
                    <div className="flex justify-between text-xs text-brand-gray mt-1">
                      <span>5 años</span>
                      <span>30 años</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Tasa de interés</span>
                      <span className="text-brand-red font-bold">{rate}% EA</span>
                    </label>
                    <input
                      type="range"
                      min={8}
                      max={18}
                      step={0.5}
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full accent-[#f32735]"
                    />
                    <div className="flex justify-between text-xs text-brand-gray mt-1">
                      <span>8%</span>
                      <span>18%</span>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-brand-dark rounded-xl p-6 flex flex-col justify-center">
                  <p className="text-white/60 text-sm mb-1">Cuota mensual estimada</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    {formatCurrency(monthlyPayment)}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Total a pagar</span>
                      <span className="text-white font-medium">{formatCurrency(totalPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Total intereses</span>
                      <span className="text-brand-red font-medium">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Capital</span>
                      <span className="text-white font-medium">{formatCurrency(loanAmount)}</span>
                    </div>
                  </div>

                  <div className="mt-5 p-3 bg-white/10 rounded-lg flex gap-2">
                    <Info className="h-4 w-4 text-white/60 shrink-0 mt-0.5" />
                    <p className="text-xs text-white/50">
                      Este cálculo es una estimación. Los valores reales pueden variar según el banco y las condiciones del crédito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ¿Por qué elegir <span className="text-brand-red">nuestra asesoría</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-brand-red" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-brand-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              ¿Necesitas asesoría hipotecaria?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Conversemos sobre tu caso. Te orientamos con información clara
              sobre alternativas de préstamo sobre propiedad raíz.
            </p>
            <Button
              asChild
              className="mt-6 bg-white text-brand-dark hover:bg-white/90 rounded-full px-8 py-3 font-semibold"
            >
              <a
                href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20asesor%C3%ADa%20sobre%20hipotecas%20con%20Arrendamientos%20Santa%20Fe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Asesoría por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
