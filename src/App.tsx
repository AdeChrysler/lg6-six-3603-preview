import React, { FormEvent, ReactNode, useMemo, useState } from 'react';
import { ArrowRight, BadgeAlert, Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { PRIORITY_1_CTA_URL, PRIORITY_2_CTA_URL } from './lib/constants';

type RevenueBand = '<1 Miliar' | '1-3 Miliar' | '3-5 Miliar' | '5-10 Miliar' | '10 Miliar+';
type TeamSize = '1-5' | '6-20' | '21-50' | '51-100' | '>100';
type BusinessChallenge =
  | 'Penjualan tidak stabil'
  | 'Profit margin menurun'
  | 'Operasional tidak efisien'
  | 'Tim sulit dikontrol'
  | 'Cashflow bermasalah'
  | 'Growth mentok'
  | 'Kompetitor makin agresif'
  | 'Belum tahu bottleneck utama';
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

const initialForm: FormState = {
  omzet: '',
  industri: '',
  jumlahTim: '',
  tantangan: '',
  dampak: '',
  timeline: '',
};

const leakPoints = [
  {
    label: 'Owner Dependency',
    title: 'Keputusan kecil tetap naik ke owner',
    body: 'Tim terlihat bergerak, tetapi ritme keputusan tetap bergantung pada Anda untuk menjaga semuanya tetap jalan.',
  },
  {
    label: 'Execution Drift',
    title: 'SOP ada, eksekusi tetap bocor',
    body: 'Standar kerja mungkin sudah pernah ditulis, tetapi belum hidup cukup kuat di lapangan untuk menjaga kualitas hasil.',
  },
  {
    label: 'Growth Pressure',
    title: 'Bisnis membesar, kontrol justru menipis',
    body: 'Omzet dan kompleksitas naik bersamaan, sementara sistem kerja belum cukup kuat untuk menopang skala berikutnya.',
  },
];

const pressureCards = [
  {
    title: 'Owner jadi titik singgah semua keputusan',
    body: 'Tim masih menunggu owner untuk keputusan operasional yang seharusnya sudah bisa berjalan lewat standar yang jelas.',
  },
  {
    title: 'Masalah harian terasa datang tanpa pola',
    body: 'Komplain, revisi, telat, dan miskomunikasi terlihat seperti masalah terpisah padahal akar sistemnya sama.',
  },
  {
    title: 'Growth menambah beban, bukan kontrol',
    body: 'Bisnis makin besar, tetapi owner justru makin sulit lepas karena struktur dan ritme kerja belum cukup kuat.',
  },
  {
    title: 'Profit bocor lewat kerja ulang dan chaos',
    body: 'Bocornya bukan hanya uang, tapi juga waktu, energi, keputusan, dan fokus leadership yang habis di operasional harian.',
  },
];

const diagnosticModules = [
  {
    title: 'Decision Flow',
    body: 'Apakah keputusan-keputusan penting sudah turun ke tim dengan standar yang cukup jelas, atau masih naik semua ke owner?',
  },
  {
    title: 'Execution Rhythm',
    body: 'Apakah tim bekerja dalam ritme yang terukur, atau bisnis masih bergerak dari urgensi ke urgensi tanpa pola yang stabil?',
  },
  {
    title: 'Control System',
    body: 'Apakah owner sudah punya sistem kontrol yang membuat bisnis tetap berjalan saat owner tidak ikut turun ke detail?',
  },
];

const fitBullets = [
  'Omzet bisnis Anda sudah masuk level yang menuntut sistem kerja yang lebih matang.',
  'Tim sudah ada, tetapi owner masih menjadi pusat terlalu banyak keputusan.',
  'Anda ingin membedah bottleneck bisnis secara konkret, bukan mencari motivasi umum.',
  'Anda siap menjelaskan kondisi bisnis dan urgensi masalah secara jujur.',
];

const notFitBullets = [
  'Belum punya bisnis berjalan.',
  'Masih tahap ide tanpa revenue nyata.',
  'Mencari webinar gratis atau sekadar harga cepat.',
  'Belum siap membuka kondisi bisnis dan tantangan utamanya secara konkret.',
];

const faqItems = [
  {
    question: 'Kenapa harus isi form dulu sebelum masuk WhatsApp?',
    answer:
      'Karena jalur konsultasi dibedakan berdasarkan skala omzet, urgensi masalah, dan konteks bottleneck bisnis Anda. Form ini memastikan owner masuk ke jalur yang sesuai.',
  },
  {
    question: 'Apakah ini webinar atau sesi motivasi umum?',
    answer:
      'Tidak. Ini halaman untuk mengarahkan owner ke percakapan awal yang lebih relevan dengan konteks bisnisnya, bukan pendaftaran event umum.',
  },
  {
    question: 'Apa yang dilihat lebih dulu oleh tim Coach Ferly?',
    answer:
      'Fokus awalnya adalah membaca bottleneck inti: alur keputusan, ritme eksekusi, kontrol owner, dan seberapa besar dampaknya terhadap growth bisnis.',
  },
];

const requiredFields: Array<{ key: FieldName; label: string }> = [
  { key: 'omzet', label: 'Omzet bisnis' },
  { key: 'industri', label: 'Industri bisnis' },
  { key: 'jumlahTim', label: 'Jumlah tim aktif' },
  { key: 'tantangan', label: 'Tantangan bisnis terbesar' },
  { key: 'dampak', label: 'Dampak masalah' },
  { key: 'timeline', label: 'Timeline perbaikan' },
];

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
    'Halo Coach Ferly Team, saya sudah mengisi form diagnosa bisnis.',
    '',
    'Campaign: @lg6',
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
        'Berdasarkan skala omzet yang Anda pilih, sesi ini belum menjadi jalur paling tepat. Fokus terbaik saat ini adalah memperkuat product-market fit, sales harian, dan cash discipline sebelum masuk ke tahap pembenahan sistem yang lebih berat.',
      ctaLabel: 'Kembali Ke Form',
    };
  }

  if (form.omzet === '1-3 Miliar' || form.omzet === '3-5 Miliar') {
    return {
      kind: 'priority-2',
      title: 'Anda Masuk Jalur Prioritas 2',
      body:
        'Bisnis Anda sudah melewati fase awal dan mulai membutuhkan sistem kerja yang lebih rapi. Tim Coach Ferly dapat membantu menilai apakah bottleneck utama Anda sudah siap dibahas dalam sesi strategis.',
      ctaLabel: 'Lanjutkan Via WhatsApp',
      href: `${PRIORITY_2_CTA_URL}?text=${encodeURIComponent(buildPriorityTwoMessage(form))}`,
      fallback: 'Jika WhatsApp tidak terbuka otomatis, gunakan tombol di bawah untuk melanjutkan manual.',
    };
  }

  return {
    kind: 'priority-main',
    title: 'Anda Masuk Jalur Prioritas Utama',
    body:
      'Skala bisnis Anda sudah cukup besar untuk membahas bottleneck bisnis sebagai isu strategis. Lanjutkan ke WhatsApp agar tim Coach Ferly dapat membaca konteks Anda sebelum sesi.',
    ctaLabel: 'Lanjutkan Ke WhatsApp Prioritas',
    href: PRIORITY_1_CTA_URL,
    fallback: 'Jika tab WhatsApp tidak muncul otomatis, gunakan tombol prioritas di bawah.',
  };
};

type FieldProps = {
  children: ReactNode;
  error?: string;
  fullWidth?: boolean;
  htmlFor: string;
  label: string;
};

const Field = ({ children, error, fullWidth = false, htmlFor, label }: FieldProps) => (
  <div className={fullWidth ? 'lg:col-span-2' : ''}>
    <label className="mb-3 block font-ui text-sm font-semibold text-[var(--brand-cream)]" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {error ? (
      <p className="mt-2 text-sm text-[var(--brand-danger)]" id={`${htmlFor}-error`}>
        {error}
      </p>
    ) : null}
  </div>
);

const App: React.FC = () => {
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

  const scrollToQualification = () => {
    document.getElementById('qualification-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetToForm = () => {
    setOutcome(null);
    scrollToQualification();
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
      document.getElementById('consultation-path')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    if (nextOutcome.href) {
      window.open(nextOutcome.href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-cream)]">
      <div className="campaign-bg" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[var(--brand-line)] bg-[rgba(5,5,5,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.32em] text-[var(--brand-muted)]">
              Business Bottleneck Diagnostic
            </p>
            <p className="font-display text-lg text-[var(--brand-cream)]">Coach Ferly F. Raya</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="h-11 px-5 text-sm sm:h-12 sm:px-7 sm:text-base"
            onClick={scrollToQualification}
          >
            Cek Jalur Konsultasi
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:gap-8">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="hero-reveal">
                <Badge className="border-[var(--brand-gold)]/25 bg-[var(--brand-gold)]/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--brand-gold)]">
                  Untuk Owner Dengan Bisnis Yang Sudah Berat Dibawa Sendiri
                </Badge>
              </div>

              <div className="hero-reveal hero-reveal-delay-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="font-display text-[2.7rem] leading-[0.92] tracking-[-0.05em] text-[var(--brand-cream)] sm:text-6xl lg:max-w-4xl lg:text-[5.4rem]">
                    Omzet Naik,
                    <span className="block text-[var(--brand-gold)]">Tapi Semua Masih Bertumpu Pada Anda?</span>
                  </h1>
                  <p className="max-w-2xl font-ui text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                    Kalau tim masih menunggu owner, SOP belum hidup di lapangan, dan growth justru terasa makin
                    melelahkan, masalahnya bukan kurang kerja keras. Yang perlu dibedah adalah bottleneck bisnisnya.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/5 px-4 py-2 text-sm text-[var(--brand-cream)]">
                    <ShieldCheck className="h-4 w-4 text-[var(--brand-gold)]" />
                    Fokus pada alur keputusan, ritme eksekusi, dan kontrol owner
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/5 px-4 py-2 text-sm text-[var(--brand-muted)]">
                    <BadgeAlert className="h-4 w-4 text-[var(--brand-danger)]" />
                    Bukan webinar. Bukan pitch generik.
                  </div>
                </div>
              </div>

              <div className="hero-reveal hero-reveal-delay-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-14 px-8 text-base shadow-[0_24px_60px_rgba(212,175,106,0.22)]"
                  onClick={scrollToQualification}
                >
                  Mulai Diagnosa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="font-ui text-sm text-[var(--brand-muted)]">
                  Isi form singkat dulu agar owner masuk ke jalur konsultasi yang tepat.
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

            <div className="lg:sticky lg:top-28">
              <div className="hero-portrait-frame relative overflow-hidden rounded-[2rem] border border-[var(--brand-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.48)]">
                <div className="absolute inset-x-6 top-6 z-20 flex items-center justify-between rounded-full border border-[var(--brand-line)] bg-[rgba(5,5,5,0.7)] px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[var(--brand-muted)]">
                  <span>Strategic Review</span>
                  <span className="text-[var(--brand-gold)]">Owner Focused</span>
                </div>

                <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0d0d0d]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,106,0.16),transparent_35%)]" />
                  <img
                    src="/coach-ferly.png"
                    alt="Coach Ferly F. Raya"
                    className="h-[580px] w-full object-cover object-center sm:h-[640px] lg:h-[760px]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(5,5,5,0),rgba(5,5,5,0.9))]" />
                </div>

                <Card className="relative z-20 -mt-24 ml-auto mr-2 max-w-[340px] border-[var(--brand-line)] bg-[rgba(11,11,11,0.92)] p-5 backdrop-blur-xl lg:-mt-40 lg:mr-4">
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-[var(--brand-gold)]">
                      Diagnostic Focus
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

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div
            className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--brand-line)] bg-[rgba(255,255,255,0.03)] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-10 lg:px-14 lg:py-14"
            id="qualification-form"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
              <div className="space-y-5">
                <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                  Qualification Form
                </Badge>
                <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                  Cek Apakah Sesi Ini Relevan Untuk Kondisi Bisnis Anda
                </h2>
                <p className="max-w-xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                  Jawab beberapa pertanyaan singkat. Kami hanya mengarahkan owner ke jalur yang sesuai dengan skala
                  bisnis dan urgensi masalahnya.
                </p>

                <div className="space-y-3">
                  <div className="inline-flex min-h-9 items-center rounded-full border border-[var(--brand-line)] bg-white/5 px-4 text-sm text-[var(--brand-cream)]">
                    {completedCount}/6 bidang terisi
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-gold),var(--brand-action))] transition-all"
                      style={{ width: `${(completedCount / 6) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm leading-7 text-[var(--brand-muted)]">
                    Tidak ada WhatsApp yang akan dibuka sebelum form ini lengkap.
                  </p>
                </div>
              </div>

              <Card className="border-[var(--brand-line)] bg-[rgba(11,11,11,0.72)] p-6 lg:p-7">
                <form className="grid gap-5 lg:grid-cols-2" noValidate onSubmit={onSubmit}>
                  <Field error={errors.omzet} htmlFor="omzet" label="Omzet bisnis per bulan">
                    <select
                      aria-describedby={errors.omzet ? 'omzet-error' : undefined}
                      aria-invalid={Boolean(errors.omzet)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="omzet"
                      onChange={(event) => updateField('omzet', event.target.value as RevenueBand)}
                      value={form.omzet}
                    >
                      <option value="">Pilih omzet bulanan</option>
                      <option value="<1 Miliar">&lt;1 Miliar</option>
                      <option value="1-3 Miliar">1-3 Miliar</option>
                      <option value="3-5 Miliar">3-5 Miliar</option>
                      <option value="5-10 Miliar">5-10 Miliar</option>
                      <option value="10 Miliar+">10 Miliar+</option>
                    </select>
                  </Field>

                  <Field error={errors.industri} htmlFor="industri" label="Industri bisnis">
                    <input
                      aria-describedby={errors.industri ? 'industri-error' : undefined}
                      aria-invalid={Boolean(errors.industri)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] placeholder:text-[var(--brand-muted)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="industri"
                      onChange={(event) => updateField('industri', event.target.value)}
                      placeholder="Contoh: retail, F&B, jasa, manufaktur"
                      type="text"
                      value={form.industri}
                    />
                  </Field>

                  <Field error={errors.jumlahTim} htmlFor="jumlahTim" label="Jumlah tim aktif saat ini">
                    <select
                      aria-describedby={errors.jumlahTim ? 'jumlahTim-error' : undefined}
                      aria-invalid={Boolean(errors.jumlahTim)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="jumlahTim"
                      onChange={(event) => updateField('jumlahTim', event.target.value as TeamSize)}
                      value={form.jumlahTim}
                    >
                      <option value="">Pilih ukuran tim</option>
                      <option value="1-5">1-5</option>
                      <option value="6-20">6-20</option>
                      <option value="21-50">21-50</option>
                      <option value="51-100">51-100</option>
                      <option value=">100">&gt;100</option>
                    </select>
                  </Field>

                  <Field error={errors.timeline} htmlFor="timeline" label="Dalam berapa lama ingin diperbaiki?">
                    <select
                      aria-describedby={errors.timeline ? 'timeline-error' : undefined}
                      aria-invalid={Boolean(errors.timeline)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="timeline"
                      onChange={(event) => updateField('timeline', event.target.value as FixTimeline)}
                      value={form.timeline}
                    >
                      <option value="">Pilih target waktu</option>
                      <option value="7 hari">7 hari</option>
                      <option value="14 hari">14 hari</option>
                      <option value="30 hari">30 hari</option>
                      <option value="1-3 bulan">1-3 bulan</option>
                      <option value="Belum urgent">Belum urgent</option>
                    </select>
                  </Field>

                  <Field
                    error={errors.tantangan}
                    fullWidth
                    htmlFor="tantangan"
                    label="Tantangan bisnis terbesar saat ini apa?"
                  >
                    <select
                      aria-describedby={errors.tantangan ? 'tantangan-error' : undefined}
                      aria-invalid={Boolean(errors.tantangan)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="tantangan"
                      onChange={(event) => updateField('tantangan', event.target.value as BusinessChallenge)}
                      value={form.tantangan}
                    >
                      <option value="">Pilih tantangan utama</option>
                      <option value="Penjualan tidak stabil">Penjualan tidak stabil</option>
                      <option value="Profit margin menurun">Profit margin menurun</option>
                      <option value="Operasional tidak efisien">Operasional tidak efisien</option>
                      <option value="Tim sulit dikontrol">Tim sulit dikontrol</option>
                      <option value="Cashflow bermasalah">Cashflow bermasalah</option>
                      <option value="Growth mentok">Growth mentok</option>
                      <option value="Kompetitor makin agresif">Kompetitor makin agresif</option>
                      <option value="Belum tahu bottleneck utama">Belum tahu bottleneck utama</option>
                    </select>
                  </Field>

                  <Field
                    error={errors.dampak}
                    fullWidth
                    htmlFor="dampak"
                    label="Dampak masalah tersebut terhadap bisnis seberapa besar?"
                  >
                    <select
                      aria-describedby={errors.dampak ? 'dampak-error' : undefined}
                      aria-invalid={Boolean(errors.dampak)}
                      className="w-full rounded-2xl border border-[var(--brand-line)] bg-black/25 px-4 py-3 text-sm text-[var(--brand-cream)] focus:border-[var(--brand-gold)] focus:outline-none"
                      id="dampak"
                      onChange={(event) => updateField('dampak', event.target.value as BusinessImpact)}
                      value={form.dampak}
                    >
                      <option value="">Pilih besarnya dampak</option>
                      <option value="Kecil, belum terlalu terasa">Kecil, belum terlalu terasa</option>
                      <option value="Sedang, mulai mengganggu">Sedang, mulai mengganggu</option>
                      <option value="Besar, sudah menghambat growth">Besar, sudah menghambat growth</option>
                      <option value="Sangat besar, harus segera ditangani">Sangat besar, harus segera ditangani</option>
                    </select>
                  </Field>

                  <div className="lg:col-span-2 flex flex-col gap-3 pt-2">
                    <Button
                      className="h-13 justify-center px-8 text-base shadow-[0_24px_60px_rgba(212,175,106,0.22)]"
                      size="lg"
                      type="submit"
                      variant="primary"
                    >
                      Lihat Jalur Konsultasi Saya
                    </Button>
                    <p className="text-sm leading-7 text-[var(--brand-muted)]">
                      Kami akan menampilkan salah satu dari tiga jalur: lanjutkan ke WhatsApp prioritas 2, lanjutkan
                      ke jalur prioritas utama, atau ditahan dulu di halaman ini bila belum relevan.
                    </p>
                  </div>
                </form>
              </Card>
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
                Banyak bisnis tidak kekurangan penjualan. Masalahnya owner masih menjadi pusat terlalu banyak keputusan,
                tim belum bergerak dengan standar yang konsisten, dan growth terasa menambah tekanan setiap bulan.
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
                Bukan tambah aktivitas dulu.
                <span className="mt-2 block text-[var(--brand-gold)]">Rapikan bottleneck-nya dulu.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Saat owner sudah capek mendorong semuanya sendiri, yang dibutuhkan bukan lebih banyak semangat, tapi
                sistem kerja yang membuat keputusan, eksekusi, dan kontrol bisa berjalan lebih stabil.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                  3 Titik Diagnosa
                </Badge>
                <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl">
                  3 Titik Yang Harus Dibaca Lebih Dulu
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                Percakapan awal harus membantu owner melihat di mana bisnis tertahan sebelum skala berikutnya dipaksa
                datang.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1fr]">
              {diagnosticModules.map((item, index) => (
                <Card
                  key={item.title}
                  className={`border-[var(--brand-line)] bg-[var(--brand-panel)] p-6 lg:p-7 ${
                    index === 1 ? 'lg:translate-y-10' : ''
                  }`}
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

        <section
          className="px-5 py-6 sm:px-6 lg:px-8"
          id="consultation-path"
        >
          <div
            className={`mx-auto w-full max-w-7xl rounded-[2rem] border px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.36)] sm:px-10 lg:px-14 lg:py-14 ${
              outcome?.kind === 'reject'
                ? 'border-[var(--brand-danger)]/30 bg-[rgba(196,81,58,0.08)]'
                : 'border-[var(--brand-line)] bg-[rgba(255,255,255,0.03)]'
            }`}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-5">
                <Badge className="border-[var(--brand-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--brand-muted)]">
                  Consultation Path
                </Badge>
                <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--brand-cream)] sm:text-5xl lg:text-6xl">
                  {outcome ? outcome.title : 'Jalur konsultasi Anda akan muncul di sini setelah form dikirim.'}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[var(--brand-muted)] sm:text-lg">
                  {outcome
                    ? outcome.body
                    : 'Setelah form lengkap, halaman ini hanya akan menampilkan satu dari tiga jalur: ditahan di halaman ini, diarahkan ke WhatsApp prioritas 2, atau diarahkan ke jalur prioritas utama.'}
                </p>
                {outcome?.fallback ? (
                  <p className="text-sm leading-7 text-[var(--brand-muted)]">{outcome.fallback}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                {outcome ? (
                  outcome.kind === 'reject' ? (
                    <Button
                      className="h-14 min-w-[220px] border border-black/10 px-8 text-base shadow-[0_20px_50px_rgba(5,5,5,0.18)]"
                      onClick={resetToForm}
                      size="lg"
                      variant="white"
                    >
                      Kembali Ke Form
                    </Button>
                  ) : (
                    <>
                      <a href={outcome.href} rel="noreferrer" target="_blank">
                        <Button
                          className="h-14 min-w-[220px] border border-black/10 px-8 text-base shadow-[0_20px_50px_rgba(5,5,5,0.18)]"
                          size="lg"
                          variant="white"
                        >
                          {outcome.ctaLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                      <Button className="min-w-[220px]" onClick={scrollToQualification} size="lg" variant="ghost">
                        Edit Jawaban
                      </Button>
                    </>
                  )
                ) : (
                  <Button className="min-w-[220px]" onClick={scrollToQualification} size="lg" variant="primary">
                    Isi Form Sekarang
                  </Button>
                )}
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
                Tidak Untuk Bisnis Yang Masih Mencari Arah Dasar
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
                Pertanyaan Yang Biasanya Muncul Sebelum Lanjut
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
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--brand-line)] bg-[rgba(5,5,5,0.94)] p-4 backdrop-blur-xl sm:hidden">
        <Button className="h-12 w-full text-sm" onClick={scrollToQualification} size="lg" variant="primary">
          Cek Jalur Konsultasi
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default App;
