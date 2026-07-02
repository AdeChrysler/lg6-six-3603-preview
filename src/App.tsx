import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, BadgeAlert, Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { PRIMARY_CTA_URL, PRIORITY_CAMPAIGN_TAG, SECONDARY_CTA_URL } from './lib/constants';
import { cn } from './lib/utils';

type RevenueBand = '<1 Miliar' | '1-3 Miliar' | '3-5 Miliar' | '5-10 Miliar' | '10 Miliar';
type TeamSize = '1-5' | '6-20' | '21-50' | '51-100' | '100+';
type BusinessChallenge =
  | 'Penjualan tidak stabil'
  | 'Profit margin menurun'
  | 'Operasional tidak efisien'
  | 'Tim sulit dikontrol'
  | 'Cashflow bermasalah'
  | 'Growth mentok'
  | 'Kompetitor makin agresif'
  | 'Belum yakin area yang paling menahan saya';
type BusinessImpact =
  | 'Kecil, belum terlalu terasa'
  | 'Sedang, mulai mengganggu'
  | 'Besar, sudah menghambat growth'
  | 'Sangat besar, harus segera ditangani';
type FixTimeline = '7 hari' | '14 hari' | '30 hari' | '1-3 bulan' | 'Belum urgent';
type FieldName = 'omzet' | 'industri' | 'jumlahTim' | 'tantangan' | 'dampak' | 'timeline';
type OutcomeKind = 'reject' | 'priority-2' | 'priority-main';

type FormState = {
  omzet: RevenueBand | '';
  industri: string;
  jumlahTim: TeamSize | '';
  tantangan: BusinessChallenge | '';
  dampak: BusinessImpact | '';
  timeline: FixTimeline | '';
};

type OutcomeState = {
  kind: OutcomeKind;
  title: string;
  body: string;
  ctaLabel?: string;
  href?: string;
  fallback?: string;
};

const leakPoints = [
  {
    label: 'Owner Dependency',
    title: 'Semua keputusan tetap naik ke owner',
    body: 'Tim terlihat jalan, tetapi hal penting maupun hal kecil tetap menunggu arah dari Anda.',
  },
  {
    label: 'Execution Drift',
    title: 'Tim sibuk, hasil belum terasa rapi',
    body: 'Meeting berjalan, orang bekerja, tetapi ritme eksekusi dan standar keputusan belum cukup solid.',
  },
  {
    label: 'Hidden Pressure',
    title: 'Bisnis terlihat sehat, owner tetap berat',
    body: 'Dari luar bisnis tampak tumbuh, tetapi di dalam owner sulit lepas, sulit tenang, dan sulit hadir penuh untuk keluarga.',
  },
];

const pressureCards = [
  {
    title: 'Owner sulit benar-benar off',
    body: 'Walau bisnis sudah besar, pikiran Anda tetap tertahan di operasional harian dan keputusan yang berulang.',
  },
  {
    title: 'Tim masih bergantung pada Anda',
    body: 'Tanpa owner hadir penuh, banyak hal langsung melambat karena standar keputusan belum hidup di tim.',
  },
  {
    title: 'Masalah kecil terasa tidak ada habisnya',
    body: 'Kerja ulang, miskomunikasi, prioritas berubah-ubah, dan follow-up yang lepas bikin energi owner terus terkuras.',
  },
  {
    title: 'Rumah ikut merasakan bebannya',
    body: 'Secara finansial bisnis terlihat berhasil, tetapi waktu, fokus, dan ruang mental owner makin sempit.',
  },
];

const diagnosticModules = [
  {
    title: 'Decision Flow',
    body: 'Apakah keputusan penting punya ritme dan standar yang jelas, atau semuanya tetap naik ke owner?',
  },
  {
    title: 'Team Execution',
    body: 'Apakah tim benar-benar bisa jalan dengan akuntabilitas, atau hanya terlihat sibuk tanpa gerak yang tajam?',
  },
  {
    title: 'Business Control',
    body: 'Apakah owner masih memegang kendali sehat atas bisnis, termasuk cash, prioritas, dan tempo pertumbuhan?',
  },
];

const fitBullets = [
  'Owner atau director dengan bisnis yang sudah berjalan dan siap bicara angka secara konkret.',
  'Revenue bulanan sudah signifikan dan Anda merasa bisnis terlihat sukses, tetapi secara pribadi masih sulit lepas dari operasional.',
  'Mencari kejelasan mengapa bisnis terus meminta kehadiran Anda, bukan sekadar tambahan motivasi.',
  'Siap masuk ke percakapan awal yang relevan dengan tim Coach Ferly setelah lolos kualifikasi.',
];

const notFitBullets = [
  'Belum punya bisnis berjalan atau masih tahap ide.',
  'Mencari webinar gratis, promo, atau penawaran harga instan.',
  'Tidak siap membuka kondisi omzet, tekanan operasional, dan pola keputusan bisnis secara jujur.',
  'Belum punya urgensi untuk merapikan sistem bisnis dan cara kerja tim.',
];

const faqItems = [
  {
    question: 'Apakah ini sesi motivasi atau webinar penjualan?',
    answer:
      'Tidak. Ini jalur konsultasi awal untuk mengecek apakah kondisi bisnis Anda relevan dibahas lebih lanjut bersama tim Coach Ferly.',
  },
  {
    question: 'Kenapa harus isi form dulu sebelum WhatsApp?',
    answer:
      'Karena tim perlu membedakan owner yang masih perlu nurture, owner yang cocok ke jalur prioritas 2, dan owner yang sudah siap ke jalur prioritas utama.',
  },
  {
    question: 'Apa yang akan dilihat lebih dulu dalam konsultasi awal?',
    answer:
      'Tiga area utama: owner dependency, ritme eksekusi tim, dan kontrol bisnis, ditambah besarnya dampak masalah dan urgensi perbaikannya.',
  },
];

const initialForm: FormState = {
  omzet: '',
  industri: '',
  jumlahTim: '',
  tantangan: '',
  dampak: '',
  timeline: '',
};

const requiredFields: Array<{ key: FieldName; label: string }> = [
  { key: 'omzet', label: 'Omzet' },
  { key: 'industri', label: 'Industri bisnis' },
  { key: 'jumlahTim', label: 'Jumlah tim' },
  { key: 'tantangan', label: 'Tantangan bisnis terbesar' },
  { key: 'dampak', label: 'Dampak masalah' },
  { key: 'timeline', label: 'Timeline perbaikan' },
];

const fieldBaseClasses =
  'w-full rounded-2xl border border-[var(--brand-line)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--brand-cream)] outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[rgba(212,175,106,0.2)]';

const trimForm = (form: FormState): FormState => ({
  omzet: form.omzet,
  industri: form.industri.trim(),
  jumlahTim: form.jumlahTim,
  tantangan: form.tantangan,
  dampak: form.dampak,
  timeline: form.timeline,
});

const buildPriorityTwoMessage = (form: FormState) =>
  [
    'Halo Coach Ferly Team, saya sudah mengisi private fit check.',
    '',
    `Campaign: ${PRIORITY_CAMPAIGN_TAG}`,
    `Omzet: ${form.omzet}`,
    `Industri: ${form.industri}`,
    `Jumlah tim: ${form.jumlahTim}`,
    `Tantangan terbesar: ${form.tantangan}`,
    `Dampak masalah: ${form.dampak}`,
    `Timeline perbaikan: ${form.timeline}`,
    '',
    'Saya ingin tahu apakah sesi ini relevan untuk kondisi bisnis saya.',
  ].join('\n');

const getOutcome = (form: FormState): OutcomeState => {
  if (form.omzet === '<1 Miliar') {
    return {
      kind: 'reject',
      title: 'Saat Ini Belum Jalur Yang Tepat',
      body:
        'Berdasarkan skala omzet yang Anda pilih, sesi ini belum menjadi jalur paling tepat. Fokus terbaik saat ini adalah memperkuat offer, penjualan harian, dan ritme eksekusi sebelum masuk ke pembenahan sistem yang lebih berat.',
      ctaLabel: 'Kembali Ke Form',
    };
  }

  if (form.omzet === '1-3 Miliar' || form.omzet === '3-5 Miliar') {
    return {
      kind: 'priority-2',
      title: 'Anda Masuk Jalur Prioritas 2',
      body:
        'Bisnis Anda sudah melewati fase awal. Tim Coach Ferly dapat membantu menilai apakah sesi lanjut ini tepat untuk membantu Anda membangun bisnis yang tetap bertumbuh tanpa terus bergantung pada Anda di setiap titik.',
      ctaLabel: 'Lanjutkan Via WhatsApp',
      href: `${SECONDARY_CTA_URL}?text=${encodeURIComponent(buildPriorityTwoMessage(form))}`,
      fallback: 'Jika WhatsApp tidak terbuka otomatis, gunakan tombol di bawah untuk melanjutkan manual.',
    };
  }

  return {
    kind: 'priority-main',
    title: 'Anda Masuk Jalur Prioritas Utama',
    body:
      'Skala bisnis Anda sudah cukup besar untuk masuk ke percakapan strategis yang lebih serius. Lanjutkan ke WhatsApp agar tim Coach Ferly bisa membaca konteks Anda sebelum sesi.',
    ctaLabel: 'Lanjutkan Ke WhatsApp Prioritas',
    href: PRIMARY_CTA_URL,
    fallback: 'Jika tab WhatsApp tidak muncul otomatis, gunakan tombol prioritas di bawah.',
  };
};

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Field = ({
  children,
  error,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="font-ui text-sm font-semibold text-[var(--brand-cream)]">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="text-sm text-[var(--brand-danger)]">
        {error}
      </p>
    ) : null}
  </div>
);

const App = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [outcome, setOutcome] = useState<OutcomeState | null>(null);

  const completedCount = useMemo(
    () => requiredFields.filter(({ key }) => String(form[key]).trim().length > 0).length,
    [form],
  );

  const updateField = <T extends FieldName>(field: T, value: FormState[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const openQualifiedPath = (href?: string) => {
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextForm = trimForm(form);
    const nextErrors: Partial<Record<FieldName, string>> = {};

    requiredFields.forEach(({ key, label }) => {
      if (!String(nextForm[key]).trim()) {
        nextErrors[key] = `${label} wajib diisi.`;
      }
    });

    setForm(nextForm);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstField = requiredFields.find(({ key }) => nextErrors[key]);
      if (firstField) {
        document.getElementById(firstField.key)?.focus();
      }
      return;
    }

    const nextOutcome = getOutcome(nextForm);
    setErrors({});
    setOutcome(nextOutcome);

    requestAnimationFrame(() => {
      scrollToId('consultation-path');
    });

    if (nextOutcome.kind !== 'reject') {
      openQualifiedPath(nextOutcome.href);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-cream)]">
      <div className="campaign-bg" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[var(--brand-line)] bg-[rgba(5,5,5,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-ui text-[10px] tracking-[0.28em] text-[var(--brand-muted)]">
              Private fit check for scaling owners
            </p>
            <p className="font-display text-lg text-[var(--brand-cream)]">Coach Ferly F. Raya</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="h-11 px-5 text-sm sm:h-12 sm:px-7 sm:text-base"
            onClick={() => scrollToId('qualification-form')}
          >
            Isi Form Dulu
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(380px,0.98fr)] lg:gap-8">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="hero-reveal">
                <Badge className="border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/10 px-4 py-1 text-[11px] tracking-[0.22em] text-[var(--brand-gold)]">
                  Untuk Owner Bisnis Multi-Miliar
                </Badge>
              </div>

              <div className="hero-reveal hero-reveal-delay-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="font-display text-[2.45rem] leading-[0.96] tracking-[-0.04em] text-[var(--brand-cream)] sm:text-[4.35rem] lg:max-w-4xl lg:text-[5rem]">
                    Bisnis Terlihat Sudah Jadi,
                    <span className="block text-[var(--brand-gold)]">Tapi Anda Masih Sulit Lepas.</span>
                  </h1>
                  <p className="max-w-2xl font-ui text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                    Dari luar bisnis tampak tumbuh, tetapi di dalam owner masih jadi pusat keputusan,
                    sulit benar-benar off, dan keluarga ikut merasakan bebannya. Masalahnya biasanya
                    bukan kurang kerja keras, tetapi sistem bisnis yang belum cukup kuat.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/5 px-4 py-2 text-sm text-[var(--brand-cream)]">
                    <ShieldCheck className="h-4 w-4 text-[var(--brand-gold)]" />
                    Untuk owner yang bisnisnya sudah besar, tetapi hidupnya belum terasa lebih ringan
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/5 px-4 py-2 text-sm text-[var(--brand-muted)]">
                    <BadgeAlert className="h-4 w-4 text-[var(--brand-danger)]" />
                    Tidak ada WhatsApp sebelum form lengkap
                  </div>
                </div>
              </div>

              <div className="hero-reveal hero-reveal-delay-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-14 px-8 text-base shadow-[0_24px_60px_rgba(212,175,106,0.22)]"
                  onClick={() => scrollToId('qualification-form')}
                >
                  Cek Kecocokan Saya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="font-ui text-sm text-[var(--brand-muted)]">
                  Jalur konsultasi ditentukan setelah kualifikasi selesai.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {leakPoints.map((item) => (
                  <Card
                    key={item.label}
                    className="border-[var(--brand-line)] bg-[var(--brand-panel)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
                  >
                    <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--brand-danger)]">
                      {item.label}
                    </p>
                    <h2 className="font-display text-2xl text-[var(--brand-cream)]">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <section
                id="qualification-form"
                aria-labelledby="form-title"
                className="rounded-[2rem] border border-[var(--brand-line)] bg-[rgba(8,8,8,0.92)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7"
              >
                <div className="space-y-4">
                  <Badge className="border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/10 px-4 py-1 tracking-[0.2em] text-[var(--brand-gold)]">
                    Private Fit Check
                  </Badge>
                  <div className="space-y-2">
                    <h2 id="form-title" className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)]">
                      Lihat Apakah Sesi Ini Tepat Untuk Fase Bisnis Anda
                    </h2>
                    <p className="text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
                      Jawab enam pertanyaan singkat dan privat. Ini membantu tim menilai apakah
                      percakapan lanjut memang relevan untuk fase bisnis Anda sekarang.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--brand-line)] bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between gap-4 text-sm text-[var(--brand-muted)]">
                      <span>{completedCount}/6 bidang terisi</span>
                      <span>Kelayakan privat</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all"
                        style={{ width: `${(completedCount / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
                  <Field label="Omzet bisnis per bulan" htmlFor="omzet" error={errors.omzet}>
                    <select
                      id="omzet"
                      className={fieldBaseClasses}
                      value={form.omzet}
                      onChange={(event) => updateField('omzet', event.target.value as RevenueBand)}
                      aria-invalid={Boolean(errors.omzet)}
                      aria-describedby={errors.omzet ? 'omzet-error' : undefined}
                    >
                      <option value="">Pilih omzet bulanan</option>
                      <option value="<1 Miliar">&lt;1 Miliar</option>
                      <option value="1-3 Miliar">1-3 Miliar</option>
                      <option value="3-5 Miliar">3-5 Miliar</option>
                      <option value="5-10 Miliar">5-10 Miliar</option>
                      <option value="10 Miliar">10 Miliar</option>
                    </select>
                  </Field>

                  <Field label="Industri bisnis" htmlFor="industri" error={errors.industri}>
                    <input
                      id="industri"
                      type="text"
                      className={fieldBaseClasses}
                      value={form.industri}
                      onChange={(event) => updateField('industri', event.target.value)}
                      placeholder="Contoh: retail, F&B, manufaktur, jasa"
                      aria-invalid={Boolean(errors.industri)}
                      aria-describedby={errors.industri ? 'industri-error' : undefined}
                    />
                  </Field>

                  <Field label="Jumlah tim aktif" htmlFor="jumlahTim" error={errors.jumlahTim}>
                    <select
                      id="jumlahTim"
                      className={fieldBaseClasses}
                      value={form.jumlahTim}
                      onChange={(event) => updateField('jumlahTim', event.target.value as TeamSize)}
                      aria-invalid={Boolean(errors.jumlahTim)}
                      aria-describedby={errors.jumlahTim ? 'jumlahTim-error' : undefined}
                    >
                      <option value="">Pilih ukuran tim</option>
                      <option value="1-5">1-5</option>
                      <option value="6-20">6-20</option>
                      <option value="21-50">21-50</option>
                      <option value="51-100">51-100</option>
                      <option value="100+">100+</option>
                    </select>
                  </Field>

                  <Field label="Target waktu perbaikan" htmlFor="timeline" error={errors.timeline}>
                    <select
                      id="timeline"
                      className={fieldBaseClasses}
                      value={form.timeline}
                      onChange={(event) => updateField('timeline', event.target.value as FixTimeline)}
                      aria-invalid={Boolean(errors.timeline)}
                      aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                    >
                      <option value="">Pilih target waktu</option>
                      <option value="7 hari">7 hari</option>
                      <option value="14 hari">14 hari</option>
                      <option value="30 hari">30 hari</option>
                      <option value="1-3 bulan">1-3 bulan</option>
                      <option value="Belum urgent">Belum urgent</option>
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field
                      label="Tantangan bisnis terbesar saat ini"
                      htmlFor="tantangan"
                      error={errors.tantangan}
                    >
                      <select
                        id="tantangan"
                        className={fieldBaseClasses}
                        value={form.tantangan}
                        onChange={(event) => updateField('tantangan', event.target.value as BusinessChallenge)}
                        aria-invalid={Boolean(errors.tantangan)}
                        aria-describedby={errors.tantangan ? 'tantangan-error' : undefined}
                      >
                        <option value="">Pilih tantangan utama</option>
                        <option value="Penjualan tidak stabil">Penjualan tidak stabil</option>
                        <option value="Profit margin menurun">Profit margin menurun</option>
                        <option value="Operasional tidak efisien">Operasional tidak efisien</option>
                        <option value="Tim sulit dikontrol">Tim sulit dikontrol</option>
                        <option value="Cashflow bermasalah">Cashflow bermasalah</option>
                        <option value="Growth mentok">Growth mentok</option>
                        <option value="Kompetitor makin agresif">Kompetitor makin agresif</option>
                        <option value="Belum yakin area yang paling menahan saya">Belum yakin area yang paling menahan saya</option>
                      </select>
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Dampak masalah terhadap bisnis"
                      htmlFor="dampak"
                      error={errors.dampak}
                    >
                      <select
                        id="dampak"
                        className={fieldBaseClasses}
                        value={form.dampak}
                        onChange={(event) => updateField('dampak', event.target.value as BusinessImpact)}
                        aria-invalid={Boolean(errors.dampak)}
                        aria-describedby={errors.dampak ? 'dampak-error' : undefined}
                      >
                        <option value="">Pilih besarnya dampak</option>
                        <option value="Kecil, belum terlalu terasa">Kecil, belum terlalu terasa</option>
                        <option value="Sedang, mulai mengganggu">Sedang, mulai mengganggu</option>
                        <option value="Besar, sudah menghambat growth">Besar, sudah menghambat growth</option>
                        <option value="Sangat besar, harus segera ditangani">
                          Sangat besar, harus segera ditangani
                        </option>
                      </select>
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Button type="submit" variant="primary" size="lg" className="h-13 w-full text-base">
                      Lihat Jalur Konsultasi Saya
                    </Button>
                    <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                      Owner dengan omzet di bawah Rp1 miliar akan berhenti di halaman ini dan tidak
                      diarahkan ke WhatsApp.
                    </p>
                  </div>
                </form>
              </section>

              <div className="hero-portrait-frame relative overflow-hidden rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.48)]">
                  <div className="absolute inset-x-6 top-6 z-20 flex items-center justify-between rounded-full border border-[var(--brand-line)] bg-[rgba(5,5,5,0.7)] px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[var(--brand-muted)]">
                  <span>Private Strategy Review</span>
                  <span className="text-[var(--brand-gold)]">Controlled</span>
                </div>

                <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0d0d0d]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,106,0.16),transparent_35%)]" />
                  <img
                    src="/coach-ferly.png"
                    alt="Coach Ferly F. Raya"
                    className="h-[520px] w-full object-cover object-center sm:h-[640px] lg:h-[760px]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(5,5,5,0),rgba(5,5,5,0.9))]" />
                </div>

                <Card className="relative z-20 -mt-24 ml-auto mr-2 max-w-[340px] border-[var(--brand-line)] bg-[rgba(11,11,11,0.92)] p-5 backdrop-blur-xl lg:-mt-40 lg:mr-4">
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-[11px] tracking-[0.2em] text-[var(--brand-gold)]">
                      Private Executive Snapshot
                    </p>
                    <CircleAlert className="h-4 w-4 text-[var(--brand-danger)]" />
                  </div>
                  <div className="mt-5 space-y-4">
                    {leakPoints.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-[var(--brand-line)] bg-white/5 px-4 py-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-display text-xl text-[var(--brand-cream)]">{item.label}</p>
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-danger)]" />
                        </div>
                        <p className="text-sm leading-6 text-[var(--brand-muted)]">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section
          id="consultation-path"
          aria-live="polite"
          className="px-5 py-6 sm:px-6 lg:px-8"
        >
          <div
            className={cn(
              'mx-auto w-full max-w-7xl rounded-[2rem] border px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-10 lg:px-14',
              outcome?.kind === 'reject'
                ? 'border-[var(--brand-danger)]/30 bg-[rgba(196,81,58,0.08)]'
                : 'border-[var(--brand-line)] bg-[linear-gradient(135deg,rgba(212,175,106,0.08),rgba(255,255,255,0.02))]',
            )}
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--brand-gold)]">
              Consultation Path
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-4">
                <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                  {outcome ? outcome.title : 'Jalur konsultasi Anda akan muncul di sini setelah form dikirim.'}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                  {outcome
                    ? outcome.body
                    : 'Setelah form dikirim, Anda akan melihat jalur lanjut yang paling sesuai untuk fase bisnis Anda saat ini.'}
                </p>
                {outcome?.fallback ? (
                  <p className="text-sm leading-7 text-[var(--brand-muted)]">{outcome.fallback}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[220px]">
                {outcome ? (
                  outcome.kind === 'reject' ? (
                    <Button variant="outline" size="lg" className="h-12 text-sm" onClick={() => scrollToId('qualification-form')}>
                      Kembali Ke Form
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="primary" size="lg" className="h-12 text-sm">
                        <a href={outcome.href} target="_blank" rel="noreferrer">
                          {outcome.ctaLabel}
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" className="h-12 text-sm" onClick={() => scrollToId('qualification-form')}>
                        Edit Jawaban
                      </Button>
                    </>
                  )
                ) : (
                  <Button variant="primary" size="lg" className="h-12 text-sm" onClick={() => scrollToId('qualification-form')}>
                    Isi Form Dulu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="space-y-5">
              <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                Problem Mirror
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                Bisnis Bisa Tembus Miliaran, Tapi Owner Tetap Tidak Tenang
              </h2>
              <p className="max-w-xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Banyak bisnis tidak kekurangan omzet. Masalahnya, owner tetap memikul terlalu banyak keputusan,
                tekanan operasional tidak benar-benar turun, dan keberhasilan bisnis belum terasa sebagai
                kebebasan di kehidupan pribadi.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pressureCards.map((item) => (
                <Card
                  key={item.title}
                  className="border-[var(--brand-line)] bg-[var(--brand-panel)] p-6 before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-[var(--brand-danger)]/60"
                >
                  <h3 className="font-display text-2xl text-[var(--brand-cream)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(135deg,rgba(212,175,106,0.08),rgba(255,255,255,0.02))] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-10 lg:px-14 lg:py-14">
            <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--brand-gold)]">Reframe</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.06em] text-[var(--brand-cream)] sm:text-5xl lg:text-6xl">
                Bukan tambah beban lagi.
                <span className="mt-2 block text-[var(--brand-gold)]">Rapikan sistem bisnis dulu.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Fokusnya bukan sekadar menambah penjualan atau aktivitas. Fokusnya merapikan cara bisnis
                berjalan supaya keputusan, tim, dan tekanan owner tidak terus menumpuk di orang yang sama.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                  3 Sumber Tekanan
                </Badge>
                <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                  3 Sumber Tekanan Yang Paling Sering Menahan Owner
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Percakapan awal perlu membantu owner melihat bagian mana yang paling sering menarik
                mereka kembali ke operasional, meski bisnisnya sendiri sudah bertumbuh.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1fr]">
              {diagnosticModules.map((item, index) => (
                <Card
                  key={item.title}
                  className={cn(
                    'border-[var(--brand-line)] bg-[var(--brand-panel)] p-6 lg:p-7',
                    index === 1 ? 'lg:translate-y-10' : '',
                  )}
                >
                  <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--brand-danger)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] text-[var(--brand-cream)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)] sm:text-base">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 rounded-[2rem] border border-[var(--brand-line)] bg-[rgba(255,255,255,0.03)] px-6 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-14">
            <div className="space-y-4">
              <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                Desired State
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                Bisnis Tetap Jalan. Owner Bisa Tidur Lebih Tenang.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Tujuannya bukan janji instan. Tujuannya membantu owner melihat jalur menuju bisnis
                yang tetap bertumbuh, sambil memberi mereka kembali ruang berpikir, ruang keluarga,
                dan kemampuan untuk benar-benar lepas dari operasional harian.
              </p>
              <div className="inline-flex items-start gap-3 rounded-2xl border border-[var(--brand-line)] bg-[rgba(212,175,106,0.08)] px-4 py-4 text-sm leading-7 text-[var(--brand-cream)]">
                <ShieldCheck className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--brand-gold)]" />
                Kualifikasi ini membantu tim Coach Ferly menjaga agar percakapan lanjut tetap serius dan relevan.
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <Card className="border-[var(--brand-line)] bg-[var(--brand-panel)] p-7 lg:p-8">
              <Badge className="border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/10 px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-gold)]">
                Cocok Untuk Anda
              </Badge>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)]">
                Cocok Jika Anda Sudah Punya Bisnis Berjalan
              </h2>
              <ul className="mt-8 space-y-4">
                {fitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--brand-gold)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-[var(--brand-line)] bg-[rgba(196,81,58,0.08)] p-7 lg:p-8">
              <Badge className="border-[var(--brand-danger)]/30 bg-[var(--brand-danger)]/10 px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-danger)]">
                Tidak Untuk Anda
              </Badge>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)]">
                Tidak Untuk Bisnis Yang Masih Mencari Ide
              </h2>
              <ul className="mt-8 space-y-4">
                {notFitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
                    <CircleAlert className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--brand-danger)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 space-y-4">
              <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                FAQ
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                Pertanyaan Yang Biasanya Muncul Sebelum Masuk Konsultasi
              </h2>
            </div>

            <div className="grid gap-4">
              {faqItems.map((item) => (
                <Card key={item.question} className="border-[var(--brand-line)] bg-[var(--brand-panel)] p-0">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-xl text-[var(--brand-cream)] marker:content-none">
                      {item.question}
                      <span className="rounded-full border border-[var(--brand-line)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--brand-muted)] transition group-open:rotate-180">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--brand-line)] px-6 pb-6 pt-4 text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
                      {item.answer}
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(135deg,rgba(212,175,106,0.14),rgba(255,255,255,0.03))] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.36)] sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-5">
                <Badge className="border-[var(--brand-line)] bg-[rgba(5,5,5,0.16)] px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-cream)]">
                  CTA
                </Badge>
                <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--brand-black)] sm:text-5xl lg:text-6xl">
                  Jika Bisnis Anda Sudah Besar, Pastikan Jalur Berikutnya Juga Tepat
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[rgba(5,5,5,0.76)] sm:text-lg">
                  Lengkapi private fit check terlebih dulu, lalu lanjut ke jalur percakapan yang
                  paling sesuai untuk fase bisnis Anda sekarang.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Button
                  variant="white"
                  size="lg"
                  className="h-14 min-w-[220px] border border-black/10 px-8 text-base shadow-[0_20px_50px_rgba(5,5,5,0.18)]"
                  onClick={() => scrollToId('qualification-form')}
                >
                  Isi Form Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-[rgba(5,5,5,0.62)]">
                  Tidak ada jalur WhatsApp langsung tanpa kualifikasi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--brand-line)] bg-[rgba(5,5,5,0.94)] p-4 backdrop-blur-xl sm:hidden">
        <Button variant="primary" size="lg" className="h-12 w-full text-sm" onClick={() => scrollToId('qualification-form')}>
          Isi Form Dulu
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default App;
