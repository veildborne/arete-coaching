'use client'
import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page:        { backgroundColor: '#ffffff', padding: 40, fontFamily: 'Helvetica' },
  header:      { marginBottom: 24, borderBottomWidth: 2, borderBottomColor: '#D4B570', paddingBottom: 12 },
  logo:        { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#D4B570', letterSpacing: 4, marginBottom: 2 },
  subtitle:    { fontSize: 9, color: '#8F9AAF', letterSpacing: 2 },
  section:     { marginBottom: 18 },
  sectionTitle:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#D4B570', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' },
  row:         { flexDirection: 'row', marginBottom: 4 },
  label:       { fontSize: 9, color: '#8F9AAF', width: 140 },
  value:       { fontSize: 9, color: '#1a1a2e', flex: 1 },
  card:        { backgroundColor: '#f8f7f4', borderRadius: 6, padding: 10, marginBottom: 6 },
  cardTitle:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1a1a2e', marginBottom: 4 },
  cardText:    { fontSize: 8, color: '#555', lineHeight: 1.5 },
  macroRow:    { flexDirection: 'row', gap: 8, marginBottom: 6 },
  macroBox:    { flex: 1, backgroundColor: '#f0ede6', borderRadius: 4, padding: 8, alignItems: 'center' },
  macroVal:    { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
  macroLabel:  { fontSize: 7, color: '#8F9AAF', marginTop: 2 },
  footer:      { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e5e0d5', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:  { fontSize: 7, color: '#8F9AAF' },
  badge:       { backgroundColor: '#EF6B7318', borderRadius: 3, padding: '2 6', marginRight: 4 },
  badgeText:   { fontSize: 7, color: '#EF6B73' },
  successBadge:{ backgroundColor: '#47D18C18', borderRadius: 3, padding: '2 6' },
  successText: { fontSize: 7, color: '#47D18C' },
  weightRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2, borderBottomWidth: 0.5, borderBottomColor: '#e5e0d5' },
})

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function calculateCompliance(logs, plans) {
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const recentLogs = logs.filter(l => new Date(l.session_date) >= fourWeeksAgo)
  const activePlan = plans.find(p => p.is_active)
  if (!activePlan) return null
  const sessions = activePlan.plan_data?.sessions || {}
  const sessionsPerWeek = Object.keys(sessions).length
  if (!sessionsPerWeek) return null
  return Math.round((recentLogs.length / (sessionsPerWeek * 4)) * 100)
}

function ClientPDF({ data }) {
  const { client, plans, logs, checkins, questionnaire, nutritionTargets, weightLogs, generatedAt } = data
  const q = questionnaire?.data || {}
  const compliance = calculateCompliance(logs, plans)
  const activePlan = plans.find(p => p.is_active)
  const avg7 = weightLogs.length >= 3
    ? (weightLogs.slice(0, 7).reduce((s, l) => s + parseFloat(l.weight_kg), 0) / Math.min(7, weightLogs.length)).toFixed(1)
    : null

  const totalVolume = logs.flatMap(l => l.exercises || []).flatMap(e => e.sets || [])
    .reduce((s, set) => s + ((set.weight_kg || 0) * (set.reps || 0)), 0)

  const pendingCheckins = checkins.filter(ci => !ci.coach_feedback).length

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ARETÉ</Text>
          <Text style={styles.subtitle}>RAPORT KLIENTA · α 0.1</Text>
        </View>

        {/* Client info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dane klienta</Text>
          {[
            ['Imię i nazwisko', client?.full_name || '—'],
            ['Email', client?.email || '—'],
            ['Pakiet', client?.package_tier || '—'],
            ['Data dołączenia', formatDate(client?.created_at)],
            ['Cel', q.cel || '—'],
            ['Staż treningowy', q.staz || '—'],
            ['Waga (ankieta)', q.waga_kg ? `${q.waga_kg} kg` : '—'],
            ['Wzrost', q.wzrost_cm ? `${q.wzrost_cm} cm` : '—'],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Trening */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postęp treningowy</Text>
          {[
            ['Łączne sesje', logs.length],
            ['Realizacja planu (4 tyg.)', compliance !== null ? `${compliance}%` : '—'],
            ['Łączna objętość', totalVolume > 0 ? `${Math.round(totalVolume / 1000)}k kg` : '—'],
            ['Aktywny plan', activePlan?.name || 'Brak'],
            ['Podział tygodnia', activePlan?.plan_data?.split_name || '—'],
            ['Aktualny tydzień', activePlan?.current_week || '—'],
          ].map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </View>
          ))}
        </View>

        {/* Waga */}
        {weightLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historia wagi</Text>
            {avg7 && (
              <View style={styles.row}>
                <Text style={styles.label}>Średnia 7 dni</Text>
                <Text style={styles.value}>{avg7} kg</Text>
              </View>
            )}
            {weightLogs.slice(0, 7).map((l, i) => (
              <View key={i} style={styles.weightRow}>
                <Text style={{ fontSize: 8, color: '#555' }}>{formatDate(l.logged_at)}</Text>
                <Text style={{ fontSize: 8, color: '#1a1a2e', fontFamily: 'Helvetica-Bold' }}>{parseFloat(l.weight_kg).toFixed(1)} kg</Text>
              </View>
            ))}
          </View>
        )}

        {/* Żywienie */}
        {nutritionTargets && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cele żywieniowe</Text>
            <View style={styles.macroRow}>
              {[
                { label: 'Kalorie', value: `${nutritionTargets.calories} kcal` },
                { label: 'Białko', value: `${nutritionTargets.protein_g}g` },
                { label: 'Tłuszcz', value: `${nutritionTargets.fat_g}g` },
                { label: 'Węgle', value: `${nutritionTargets.carbs_g}g` },
              ].map(m => (
                <View key={m.label} style={styles.macroBox}>
                  <Text style={styles.macroVal}>{m.value}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
            {nutritionTargets.notes && (
              <Text style={[styles.cardText, { marginTop: 4 }]}>{nutritionTargets.notes}</Text>
            )}
          </View>
        )}

        {/* Check-iny */}
        {checkins.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ostatnie check-iny</Text>
            {checkins.slice(0, 3).map((ci, i) => (
              <View key={i} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.cardTitle}>Tydzień {ci.week_number}</Text>
                  <Text style={{ fontSize: 8, color: '#8F9AAF' }}>{formatDate(ci.submitted_at)}</Text>
                </View>
                <View style={styles.row}>
                  {[
                    ['Waga', ci.body_weight ? `${ci.body_weight} kg` : '—'],
                    ['Energia', ci.energy_level ? `${ci.energy_level}/10` : '—'],
                    ['Sen', ci.sleep_quality ? `${ci.sleep_quality}/10` : '—'],
                    ['Realizacja diety', ci.adherence_pct ? `${ci.adherence_pct}%` : '—'],
                  ].map(([label, value]) => (
                    <View key={label} style={{ flex: 1 }}>
                      <Text style={{ fontSize: 7, color: '#8F9AAF' }}>{label}</Text>
                      <Text style={{ fontSize: 9, color: '#1a1a2e' }}>{value}</Text>
                    </View>
                  ))}
                </View>
                {ci.coach_feedback && (
                  <Text style={[styles.cardText, { marginTop: 4, color: '#D4B570' }]}>
                    Trener: {ci.coach_feedback}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ARETÉ α 0.1 · {formatDate(generatedAt)}</Text>
          <Text style={styles.footerText}>{client?.full_name}</Text>
        </View>

      </Page>
    </Document>
  )
}

export default function ClientReport({ clientId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/report/client/${clientId}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError('Błąd generowania raportu')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#1a1a1a] border-2 border-[rgba(212,181,112,0.35)] rounded-[10px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-widest">Raport PDF</p>
          <p className="text-xs text-muted/60 mt-0.5">Pełny raport do pobrania</p>
        </div>
        {!data && (
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-xs px-4 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition disabled:opacity-40"
          >
            {loading ? 'Generuję...' : '⬇ Generuj PDF'}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {data && (
        <PDFDownloadLink
          document={<ClientPDF data={data} />}
          fileName={`Arete_Raport_${data.client?.full_name?.replace(/\s/g, '_') || 'klient'}_${new Date().toISOString().split('T')[0]}.pdf`}
        >
          {({ loading: pdfLoading }) => (
            <button
              className="w-full py-2.5 rounded-lg text-sm font-bold font-body tracking-wider"
              style={{ background: pdfLoading ? 'rgba(212,181,112,0.2)' : 'linear-gradient(135deg,#b8a677,#d4c494)', color: '#0f1a2e' }}
            >
              {pdfLoading ? 'Przygotowuję...' : '⬇ Pobierz PDF'}
            </button>
          )}
        </PDFDownloadLink>
      )}
    </div>
  )
}
