import { memo } from 'react'
import { motion } from 'motion/react'
import { MapProvider } from 'react-map-gl/maplibre'
import { MapBase } from '../../../components/map/MapBase'
import { CaldeiraBoundary } from '../../../components/map/CaldeiraBoundary'
import { LicenseOverlay } from '../../../components/map/LicenseOverlay'
import { OpsPlantSitesOverlay } from '../../../components/map/OpsPlantSitesOverlay'
import data from './data.json'
import css from './prefeitura.module.css'

const ACCENT = {
  green: '#22D68A',
  cyan: '#00D4C8',
  violet: '#7C5CFC',
  amber: '#F5A623',
} as const

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

function brl(n: number): string {
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `R$ ${(n / 1_000).toFixed(0)}K`
  return `R$ ${n}`
}

interface KpiProps {
  label: string
  value: string
  unit?: string
  sub?: string
  color: string
}

function Kpi({ label, value, unit, sub, color }: KpiProps) {
  return (
    <motion.div
      className={css.kpiCard}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={css.kpiLabel}>{label}</div>
      <div className={css.kpiValue} style={{ color }}>
        {value}
        {unit && <span className={css.kpiUnit}>{unit}</span>}
      </div>
      {sub && <div className={css.kpiSub}>{sub}</div>}
    </motion.div>
  )
}

interface SectionHeadProps {
  title: string
  color: string
}

function SectionHead({ title, color }: SectionHeadProps) {
  return (
    <div className={css.sectionHeader}>
      <div className={css.sectionDot} style={{ background: color }} />
      <h2 className={css.sectionTitle}>{title}</h2>
      <div className={css.sectionLine} />
    </div>
  )
}

const MAP_VIEW = {
  longitude: -46.56,
  latitude: -21.87,
  zoom: 11.5,
  pitch: 30,
  bearing: 0,
} as const

export const PrefeituraPage = memo(function PrefeituraPage() {
  const { economia: eco, social: soc, ambiental: amb, operacao: ops, meta } = data

  return (
    <div className={css.page}>
      {/* Hero */}
      <header className={css.hero}>
        <div className={css.heroLogos}>
          <span className={css.heroLogoText}>Meteoric Resources</span>
          <span className={css.heroLogoText} style={{ color: 'rgba(255,255,255,0.15)' }}>
            &times;
          </span>
          <span className={css.heroLogoText}>Prefeitura de Pocos de Caldas</span>
        </div>
        <h1 className={css.heroTitle}>
          Painel de Impacto Social e Ambiental
        </h1>
        <p className={css.heroSubtitle}>
          Projeto Caldeira de Terras Raras — {meta.partner}
        </p>
        <hr className={css.heroDivider} />
      </header>

      <div className={css.content}>
        {/* Economia */}
        <section className={css.section}>
          <SectionHead title="Impacto Economico" color={ACCENT.green} />
          <div className={`${css.kpiGrid} ${css.kpiGrid4}`}>
            <Kpi label="Empregos Diretos" value={fmt(eco.empregos_diretos)} unit="postos" color={ACCENT.green} />
            <Kpi label="Empregos Indiretos" value={fmt(eco.empregos_indiretos)} unit="postos" color={ACCENT.green} sub="Cadeia produtiva local" />
            <Kpi label="ISS Estimado" value={brl(eco.iss_anual_brl)} unit="/ano" color={ACCENT.cyan} />
            <Kpi label="Investimento Local" value={brl(eco.investimento_local_brl)} color={ACCENT.violet} />
          </div>
          <div className={`${css.kpiGrid} ${css.kpiGrid2}`} style={{ marginTop: 10 }}>
            <Kpi label="Royalties CFEM" value={brl(eco.royalties_cfem_brl)} unit="/ano" color={ACCENT.amber} sub="Compensacao financeira mineraria" />
            <Kpi label="Contribuicao PIB Municipal" value={`${eco.pib_contribuicao_pct}%`} color={ACCENT.cyan} sub="Estimativa de impacto" />
          </div>
        </section>

        {/* Operacao */}
        <section className={css.section}>
          <SectionHead title="Operacao Mineraria" color={ACCENT.violet} />
          <div className={`${css.kpiGrid} ${css.kpiGrid3}`}>
            <Kpi label="Producao NdPr" value={fmt(ops.producao_ndpr_tpa)} unit="t/ano" color={ACCENT.violet} />
            <Kpi label="Terras Raras (TREO)" value={fmt(ops.treo_tpa)} unit="tpa" color={ACCENT.cyan} />
            <Kpi label="Vida Util (LOM)" value={String(ops.lom_anos)} unit="anos" color={ACCENT.green} />
          </div>
          <div className={`${css.kpiGrid} ${css.kpiGrid3}`} style={{ marginTop: 10 }}>
            <Kpi label="Recurso Mineral" value={fmt(ops.recurso_mt)} unit="Mt" color={ACCENT.violet} sub={`Teor medio ${fmt(ops.teor_medio_ppm)} ppm TREO`} />
            <Kpi label="Areas de Licenca" value={String(ops.licencas_areas)} color={ACCENT.amber} />
            <Kpi label="Area Total" value={String(ops.area_total_km2)} unit="km²" color={ACCENT.cyan} />
          </div>
        </section>

        {/* Ambiental */}
        <section className={css.section}>
          <SectionHead title="Compromisso Ambiental" color={ACCENT.cyan} />
          <div className={`${css.kpiGrid} ${css.kpiGrid4}`}>
            <Kpi label="Nascentes Preservadas" value={fmt(amb.nascentes_preservadas)} unit={`de ${fmt(amb.nascentes_total)}`} color={ACCENT.cyan} sub="100% preservacao" />
            <Kpi label="Recirculacao Hidrica" value={`${amb.recirculacao_hidrica_pct}%`} color={ACCENT.green} sub="Reuso e recirculacao" />
            <Kpi label="Disposicao Solida" value={amb.disposicao} color={ACCENT.violet} sub="Zero barragens de rejeitos" />
            <Kpi label="Energia Renovavel" value={`${amb.energia_renovavel_pct}%`} color={ACCENT.green} sub="Matriz energetica limpa" />
          </div>
          <div className={`${css.kpiGrid} ${css.kpiGrid3}`} style={{ marginTop: 10 }}>
            <Kpi label="CO₂ por Tonelada" value={String(amb.co2_por_tonelada)} unit="t CO₂e/t" color={ACCENT.green} sub={`${Math.round((1 - amb.co2_por_tonelada / amb.media_industria_co2) * 100)}% abaixo da media da industria`} />
            <Kpi label="Estacoes de Monitoramento" value={String(amb.estacoes_monitoramento)} color={ACCENT.cyan} sub="Rede em tempo real" />
            <Kpi label="Area Recuperada" value={String(amb.area_recuperada_ha)} unit="ha" color={ACCENT.green} />
          </div>
        </section>

        {/* Social */}
        <section className={css.section}>
          <SectionHead title="Programas Sociais" color={ACCENT.amber} />
          <div className={`${css.kpiGrid} ${css.kpiGrid4}`}>
            <Kpi label="Programas Ativos" value={String(soc.programas_ativos)} color={ACCENT.amber} />
            <Kpi label="Jovem Aprendiz" value={String(soc.jovem_aprendiz_vagas)} unit="vagas/ano" color={ACCENT.green} sub={`${soc.parcerias_senai} parcerias SENAI`} />
            <Kpi label="Fundo Comunitario" value={brl(soc.fundo_comunitario_brl)} unit="/ano" color={ACCENT.cyan} sub="Educacao, saude e cultura" />
            <Kpi label="Familias Beneficiadas" value={fmt(soc.familias_beneficiadas)} color={ACCENT.violet} />
          </div>
          <div className={`${css.kpiGrid} ${css.kpiGrid3}`} style={{ marginTop: 10 }}>
            <Kpi label="Treinamentos" value={String(soc.treinamentos_realizados)} sub="Capacitacao profissional" color={ACCENT.green} />
            <Kpi label="Bolsas de Estudo" value={String(soc.bolsas_estudo)} unit="/ano" color={ACCENT.violet} sub="Ensino tecnico e superior" />
            <Kpi label="Monitoramento Participativo" value="Tempo real" color={ACCENT.cyan} sub="Dados abertos para a comunidade" />
          </div>
        </section>

        {/* Map */}
        <section className={css.section}>
          <SectionHead title="Area do Projeto" color={ACCENT.violet} />
          <MapProvider>
            <div className={css.mapWrap}>
              <MapBase
                initialViewState={MAP_VIEW}
                interactiveLayerIds={[]}
                highlightWater={false}
              >
                <CaldeiraBoundary />
                <LicenseOverlay hoveredLicenseId={null} selectedLicenseId={null} />
                <OpsPlantSitesOverlay hoveredId={null} selectedId={null} />
              </MapBase>
            </div>
          </MapProvider>
        </section>
      </div>

      {/* Footer */}
      <footer className={css.footer}>
        <div className={css.footerPartners}>
          <span className={css.footerPartnerName}>Meteoric Resources</span>
          <span className={css.footerX}>&times;</span>
          <span className={css.footerPartnerName}>Prefeitura de Pocos de Caldas</span>
        </div>
        <p className={css.footerLegal}>
          Este painel apresenta dados estimados e projetados para o Projeto Caldeira de Terras Raras.
          Os valores sao baseados em estudos de viabilidade e podem sofrer alteracoes conforme o avanco do projeto.
          Informacoes atualizadas periodicamente em colaboracao entre Meteoric Resources NL e a Prefeitura Municipal de Pocos de Caldas.
        </p>
        <p className={css.footerUpdate}>
          Ultima atualizacao: {meta.updated}
        </p>
      </footer>
    </div>
  )
})
