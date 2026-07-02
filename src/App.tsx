import { FormEvent, ReactNode, useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  Clock3,
  MessagesSquare,
  Search,
  ShieldCheck,
  Waypoints,
} from 'lucide-react';
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

const intakeSignals = [
  'Private fit check sebelum jalur WhatsApp terbuka.',
  'Untuk owner dengan bisnis yang sudah berjalan dan siap bicara angka.',
  'Dirancang untuk membaca bottleneck bisnis, bukan memberi motivasi umum.',
];

const pressureSignals = [
  {
    label: 'Owner Dependency',
    title: 'Keputusan penting masih parkir di owner',
    body: 'Bisnis terlihat aktif, tetapi banyak momentum tetap berhenti sampai Anda turun tangan langsung.',
  },
  {
    label: 'Execution Drift',
    title: 'Tim sibuk, hasilnya belum terasa terkunci',
    body: 'Ritme kerja ada, namun kualitas follow-up, prioritas, dan standar keputusan masih mudah goyah.',
  },
  {
    label: 'Life Cost',
    title: 'Secara angka naik, secara hidup belum ringan',
    body: 'Pendapatan tumbuh, tetapi ruang pikir, waktu keluarga, dan kemampuan benar-benar off belum ikut pulih.',
  },
];

const proofFrames = [
  {
    icon: Search,
    title: 'Membaca titik macet paling mahal',
    body: 'Kami mulai dari area yang paling mengunci pertumbuhan: keputusan, kontrol, dan ketergantungan owner.',
  },
  {
    icon: Waypoints,
    title: 'Membedakan gejala dan akar masalah',
    body: 'Masalah yang terlihat di penjualan atau tim sering hanya efek. Form ini dipakai untuk menilai sumber tekanannya.',
  },
  {
    icon: MessagesSquare,
    title: 'Menyaring percakapan yang benar-benar relevan',
    body: 'WhatsApp dibuka hanya setelah jawaban memberi sinyal bahwa percakapan lanjut memang layak diteruskan.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Isi private fit check',
    body: 'Enam pertanyaan singkat dipakai untuk membaca skala bisnis, tingkat urgensi, dan bentuk tekanan yang sedang Anda bawa.',
  },
  {
    step: '02',
    title: 'Sistem menentukan jalur lanjut',
    body: 'Owner yang belum berada di fase yang tepat berhenti di halaman ini. Owner yang lolos diarahkan ke jalur WhatsApp yang sesuai.',
  },
  {
    step: '03',
    title: 'Tim membaca konteks sebelum bicara',
    body: 'Percakapan lanjut tidak dimulai dari nol. Tim sudah punya gambaran awal tentang kondisi bisnis Anda.',
  },
];

const fitBullets = [
  'Owner atau director dengan bisnis yang sudah berjalan dan siap bicara angka secara konkret.',
  'Merasa bisnis terlihat berhasil, tetapi keputusan penting masih terlalu sering kembali ke Anda.',
  'Ingin melihat mengapa tim, ritme, dan kontrol bisnis belum benar-benar stabil.',
  'Siap masuk ke percakapan awal yang serius jika memang fase bisnis Anda relevan.',
];

const notFitBullets = [
  'Masih tahap ide, baru mulai, atau belum punya bisnis berjalan.',
  'Mencari webinar gratis, motivasi instan, atau promo cepat.',
  'Tidak siap membuka kondisi omzet, tim, dan tekanan operasional secara jujur.',
  'Belum punya urgensi untuk membenahi sistem bisnis dan ritme eksekusi.',
];

const faqItems = [
  {
    question: 'Apakah ini halaman penjualan langsung atau webinar?',
    answer:
      'Bukan. Ini halaman penyaringan awal untuk melihat apakah percakapan lanjutan memang relevan dengan fase bisnis Anda sekarang.',
  },
  {
    question: 'Kenapa WhatsApp baru terbuka setelah form?',
    answer:
      'Karena jalur percakapan harus dibedakan. Owner yang masih terlalu awal, owner yang masuk prioritas kedua, dan owner yang masuk prioritas utama tidak boleh diperlakukan sama.',
  },
  {
    question: 'Apa yang dinilai dari jawaban saya?',
    answer:
      'Skala bisnis, tekanan yang paling terasa, seberapa besar dampaknya, dan seberapa cepat Anda ingin membereskan situasinya.',
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
  'w-full rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3.5 text-sm text-[var(--paper)] outline-none transition duration-200 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:bg-[rgba(255,255,255,0.06)] focus:ring-4 focus:ring-[rgba(214,253,58,0.12)]';

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
      title: 'Fase Bisnis Anda Belum Masuk Jalur Ini',
      body:
        'Berdasarkan omzet yang Anda pilih, fokus terbaik saat ini biasanya masih di penguatan offer, ritme penjualan, dan eksekusi harian. Jalur konsultasi ini dirancang untuk owner yang sudah masuk tekanan sistem dan owner dependency yang lebih berat.',
      ctaLabel: 'Periksa Lagi Jawaban',
    };
  }

  if (form.omzet === '1-3 Miliar' || form.omzet === '3-5 Miliar') {
    return {
      kind: 'priority-2',
      title: 'Anda Masuk Jalur Prioritas 2',
      body:
        'Bisnis Anda sudah melewati fase awal. Langkah berikutnya adalah percakapan awal untuk menilai apakah masalah owner dependency, ritme tim, dan kontrol bisnis Anda memang cukup relevan untuk dibahas lebih jauh.',
      ctaLabel: 'Lanjutkan Via WhatsApp',
      href: `${SECONDARY_CTA_URL}?text=${encodeURIComponent(buildPriorityTwoMessage(form))}`,
      fallback: 'Jika WhatsApp tidak terbuka otomatis, gunakan tombol di bawah untuk melanjutkan manual.',
    };
  }

  return {
    kind: 'priority-main',
    title: 'Anda Masuk Jalur Prioritas Utama',
    body:
      'Skala bisnis Anda sudah cukup besar untuk masuk ke percakapan yang lebih strategis. Lanjutkan ke WhatsApp prioritas agar tim bisa membaca konteks Anda sebelum sesi berikutnya dimulai.',
    ctaLabel: 'Lanjutkan Ke WhatsApp Prioritas',
    href: PRIMARY_CTA_URL,
    fallback: 'Jika tab WhatsApp tidak muncul otomatis, gunakan tombol prioritas di bawah.',
  };
};

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const SectionLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Badge
    variant="outline"
    className={cn(
      'border-[var(--line-strong)] bg-[rgba(255,255,255,0.02)] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[var(--muted-strong)]',
      className,
    )}
  >
    {children}
  </Badge>
);

const SectionHeading = ({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) => (
  <div className="space-y-4">
    <SectionLabel>{label}</SectionLabel>
    <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--paper)] sm:text-5xl lg:text-6xl">
      {title}
    </h2>
    <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">{body}</p>
  </div>
);

const Field = ({
  children,
  error,
  htmlFor,
  label,
}: {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) => (
  <div className="space-y-2.5">
    <label htmlFor={htmlFor} className="font-ui text-sm font-semibold text-[var(--paper)]">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="text-sm text-[var(--paper)]/78">
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--paper)]">
      <div className="campaign-grid" aria-hidden="true" />
      <div className="campaign-glow campaign-glow-left" aria-hidden="true" />
      <div className="campaign-glow campaign-glow-right" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(10,10,10,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Private fit check for scaling owners
            </p>
            <p className="font-display text-[1.45rem] leading-none text-[var(--paper)]">
              Coach Ferly F. Raya
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="h-11 px-5 text-sm sm:h-12 sm:px-7"
            onClick={() => scrollToId('qualification-form')}
          >
            Isi Form Dulu
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="space-y-8">
              <div className="hero-reveal space-y-6">
                <SectionLabel className="border-[var(--accent)]/20 bg-[rgba(214,253,58,0.08)] text-[var(--accent)]">
                  Untuk owner bisnis yang sudah besar
                </SectionLabel>

                <div className="space-y-5">
                  <h1 className="font-display text-[3rem] leading-[0.88] tracking-[-0.06em] text-[var(--paper)] sm:text-[4.5rem] lg:max-w-4xl lg:text-[6rem]">
                    Bisnisnya sudah jalan.
                    <span className="block text-[var(--accent)]">Ownernya masih belum benar-benar lepas.</span>
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                    Jika bisnis tumbuh tetapi semua keputusan tetap berat di Anda, masalahnya biasanya
                    bukan kurang kerja keras. Masalahnya sistem bisnis belum cukup kuat untuk membuat
                    owner tenang, tim rapi, dan pertumbuhan terasa sehat.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {intakeSignals.map((item) => (
                    <Card
                      key={item}
                      hoverEffect={false}
                      className="rounded-[1.5rem] border-[var(--line)] bg-[var(--panel-soft)] p-4"
                    >
                      <p className="text-sm leading-6 text-[var(--muted-strong)]">{item}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="hero-reveal hero-reveal-delay-1 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  variant="primary"
                  size="xl"
                  className="shadow-[0_24px_70px_rgba(214,253,58,0.18)]"
                  onClick={() => scrollToId('qualification-form')}
                >
                  Cek Kecocokan Saya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
                  Tidak ada jalur WhatsApp langsung. Sistem membuka jalur lanjut hanya setelah
                  kualifikasi selesai.
                </p>
              </div>

              <div className="hero-reveal hero-reveal-delay-2 grid gap-4 md:grid-cols-3">
                {pressureSignals.map((item) => (
                  <Card
                    key={item.label}
                    className="rounded-[1.8rem] border-[var(--line)] bg-[var(--panel)] p-6"
                  >
                    <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                      {item.label}
                    </p>
                    <h2 className="font-display text-[2rem] leading-[0.95] text-[var(--paper)]">
                      {item.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="hero-reveal hero-reveal-delay-2 lg:sticky lg:top-28">
              <div className="hero-frame relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
                <div className="absolute -right-16 top-10 h-40 w-40 rotate-12 rounded-[2rem] border border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)]" />

                <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--line)] bg-[#101010]">
                  <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between rounded-full border border-[var(--line)] bg-[rgba(8,8,8,0.78)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--muted)] backdrop-blur">
                    <span>Controlled private intake</span>
                    <span className="text-[var(--accent)]">Gate active</span>
                  </div>

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,253,58,0.12),transparent_34%)]" />
                  <img
                    src="/coach-ferly.png"
                    alt="Coach Ferly F. Raya"
                    className="h-[520px] w-full object-cover object-center sm:h-[620px] lg:h-[720px]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,rgba(10,10,10,0),rgba(10,10,10,0.95))]" />
                </div>

                <Card
                  hoverEffect={false}
                  className="relative z-20 -mt-24 ml-auto max-w-[330px] rounded-[1.7rem] border-[var(--line)] bg-[rgba(14,14,14,0.94)] p-5 backdrop-blur-xl lg:-mt-36"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
                      What gets screened
                    </p>
                    <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      'Skala bisnis dan kesiapan bicara angka',
                      'Tekanan owner dependency yang paling terasa',
                      'Urgensi untuk merapikan tim dan sistem bisnis',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent)]" />
                        <p className="text-sm leading-6 text-[var(--muted-strong)]">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-18 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <SectionHeading
              label="Problem Mirror"
              title="Masalahnya bukan bisnis tidak tumbuh. Masalahnya owner masih jadi mesin penopang utama."
              body="Ketika bisnis makin besar tetapi semua hal penting tetap menunggu Anda, pertumbuhan mulai memakan hidup owner sendiri. Di titik ini, yang dibutuhkan bukan semangat tambahan, tetapi pembacaan sistem yang jujur."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {pressureSignals.map((item, index) => (
                <Card
                  key={item.title}
                  className={cn(
                    'rounded-[1.8rem] border-[var(--line)] bg-[var(--panel)] p-6',
                    index === 1 ? 'sm:translate-y-8' : '',
                  )}
                >
                  <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] leading-[0.95] text-[var(--paper)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                </Card>
              ))}

              <Card className="rounded-[1.8rem] border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)] p-6 text-[var(--ink)]">
                <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-[rgba(10,10,10,0.58)]">
                  The real question
                </p>
                <p className="mt-4 font-display text-[2.1rem] leading-[0.95] text-[var(--ink)]">
                  “Kalau saya mundur sebentar, apakah bisnis tetap tajam?”
                </p>
                <p className="mt-4 text-sm leading-7 text-[rgba(10,10,10,0.72)]">
                  Form ini dibuat untuk menguji pertanyaan itu secepat mungkin, sebelum percakapan
                  lanjut dibuka.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2.2rem] border border-[var(--line)] bg-[var(--panel)] px-6 py-10 shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:px-8 lg:px-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <SectionHeading
                label="Proof Structure"
                title="Jalur ini disusun untuk membaca bottleneck, bukan menebak-nebak gejala."
                body="Sebelum owner bicara ke tim, halaman ini sudah mengumpulkan sinyal dasar tentang skala bisnis, tekanan operasional, dan tingkat urgensi. Itu yang membuat percakapan berikutnya lebih tajam."
              />

              <div className="grid gap-4">
                {proofFrames.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.title}
                      className="rounded-[1.7rem] border-[var(--line)] bg-[var(--panel-soft)] p-5 sm:p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)]">
                          <Icon className="h-5 w-5 text-[var(--accent)]" />
                        </div>
                        <div>
                          <h3 className="font-display text-[1.9rem] leading-[0.95] text-[var(--paper)]">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-18 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                label="Flow"
                title="Dari tekanan owner ke jalur konsultasi yang tepat."
                body="Narasinya sengaja lurus. Anda melihat masalahnya, memahami apa yang dibaca, lalu masuk ke gate yang menentukan apakah percakapan lanjut memang layak dibuka."
              />
              <div className="max-w-sm rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel-soft)] px-5 py-4">
                <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  Governing aesthetic
                </p>
                <p className="mt-3 font-display text-[1.9rem] leading-[0.96] text-[var(--paper)]">
                  Controlled.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Setiap elemen dibuat terasa privat, tegas, dan tidak ramai supaya owner langsung
                  merasa ini bukan halaman mass-market.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {processSteps.map((item) => (
                <Card
                  key={item.step}
                  className="rounded-[1.8rem] border-[var(--line)] bg-[var(--panel)] p-6"
                >
                  <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    Step {item.step}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] leading-[0.95] text-[var(--paper)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <Card className="rounded-[2rem] border-[var(--line)] bg-[var(--panel)] p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)]">
                  <BriefcaseBusiness className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <SectionLabel className="border-[var(--line)] bg-transparent text-[var(--muted)]">
                  Cocok Untuk Anda
                </SectionLabel>
              </div>

              <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--paper)]">
                Cocok jika bisnis Anda sudah berjalan dan tekanannya mulai terasa sistemik.
              </h2>

              <ul className="mt-8 space-y-4">
                {fitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rounded-[2rem] border-[var(--line)] bg-[var(--panel-soft)] p-7 lg:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)]">
                  <Clock3 className="h-5 w-5 text-[var(--paper)]" />
                </div>
                <SectionLabel className="border-[var(--line)] bg-transparent text-[var(--muted)]">
                  Belum Untuk Anda
                </SectionLabel>
              </div>

              <h2 className="mt-5 font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--paper)]">
                Bukan untuk bisnis yang masih mencari bentuk dasar.
              </h2>

              <ul className="mt-8 space-y-4">
                {notFitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    <CircleAlert className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--paper)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section id="qualification-form" className="px-5 py-18 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-7xl rounded-[2.4rem] border border-[var(--line)] bg-[rgba(13,13,13,0.94)] px-6 py-8 shadow-[0_50px_140px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-10">
              <div>
                <SectionHeading
                  label="Private Fit Check"
                  title="Lihat apakah sesi ini memang tepat untuk fase bisnis Anda."
                  body="Jawab enam pertanyaan singkat. Hasilnya menentukan apakah Anda berhenti di halaman ini, masuk ke jalur prioritas kedua, atau dibuka ke jalur prioritas utama."
                />

                <div className="mt-6 rounded-[1.7rem] border border-[var(--line)] bg-[var(--panel-soft)] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                    <span>{completedCount}/6 pertanyaan terisi</span>
                    <span>Private qualification gate</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),rgba(214,253,58,0.55))] transition-all duration-300"
                      style={{ width: `${(completedCount / 6) * 100}%` }}
                    />
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
                        onChange={(event) =>
                          updateField('tantangan', event.target.value as BusinessChallenge)
                        }
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
                        <option value="Belum yakin area yang paling menahan saya">
                          Belum yakin area yang paling menahan saya
                        </option>
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
                        onChange={(event) =>
                          updateField('dampak', event.target.value as BusinessImpact)
                        }
                        aria-invalid={Boolean(errors.dampak)}
                        aria-describedby={errors.dampak ? 'dampak-error' : undefined}
                      >
                        <option value="">Pilih besarnya dampak</option>
                        <option value="Kecil, belum terlalu terasa">Kecil, belum terlalu terasa</option>
                        <option value="Sedang, mulai mengganggu">Sedang, mulai mengganggu</option>
                        <option value="Besar, sudah menghambat growth">
                          Besar, sudah menghambat growth
                        </option>
                        <option value="Sangat besar, harus segera ditangani">
                          Sangat besar, harus segera ditangani
                        </option>
                      </select>
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Button type="submit" variant="primary" size="xl" className="w-full">
                      Lihat Jalur Konsultasi Saya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                      Owner dengan omzet di bawah Rp1 miliar berhenti di halaman ini dan tidak
                      diarahkan ke WhatsApp.
                    </p>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <Card className="rounded-[1.9rem] border-[var(--line)] bg-[var(--panel)] p-6">
                  <SectionLabel className="border-[var(--line)] bg-transparent text-[var(--muted)]">
                    Apa yang terjadi setelah submit
                  </SectionLabel>
                  <div className="mt-5 space-y-4">
                    {[
                      'Sistem membaca fase bisnis Anda dari omzet, tekanan, dan urgensi.',
                      'Jalur lanjut dibedakan otomatis: berhenti, prioritas 2, atau prioritas utama.',
                      'Jika lolos, WhatsApp terbuka dengan konteks yang lebih siap untuk dibaca tim.',
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-soft)] px-4 py-3"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent)]" />
                        <p className="text-sm leading-6 text-[var(--muted-strong)]">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="rounded-[1.9rem] border-[var(--line)] bg-[var(--panel-soft)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)]">
                      <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <p className="font-display text-[2rem] leading-[0.95] text-[var(--paper)]">
                      Halaman ini sengaja terasa privat.
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Bukan broadcast page. Karena itu ritmenya lebih tenang, copy-nya lebih tajam,
                    dan komponen-komponennya dibuat seperti satu sistem intake yang konsisten.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="consultation-path" aria-live="polite" className="px-5 py-6 sm:px-6 lg:px-8">
          <div
            className={cn(
              'mx-auto w-full max-w-7xl rounded-[2.2rem] border px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-8 lg:px-12 lg:py-10',
              outcome?.kind === 'reject'
                ? 'border-[var(--line)] bg-[rgba(255,255,255,0.03)]'
                : 'border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)] text-[var(--ink)]',
            )}
          >
            <p
              className={cn(
                'font-ui text-[11px] uppercase tracking-[0.24em]',
                outcome?.kind === 'reject' ? 'text-[var(--muted)]' : 'text-[rgba(10,10,10,0.58)]',
              )}
            >
              Consultation Path
            </p>

            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-4">
                <h2
                  className={cn(
                    'font-display text-4xl leading-[0.94] tracking-[-0.05em] sm:text-5xl',
                    outcome?.kind === 'reject' ? 'text-[var(--paper)]' : 'text-[var(--ink)]',
                  )}
                >
                  {outcome
                    ? outcome.title
                    : 'Jalur konsultasi Anda akan muncul di sini setelah form dikirim.'}
                </h2>
                <p
                  className={cn(
                    'max-w-3xl text-base leading-8 sm:text-lg',
                    outcome?.kind === 'reject'
                      ? 'text-[var(--muted)]'
                      : 'text-[rgba(10,10,10,0.72)]',
                  )}
                >
                  {outcome
                    ? outcome.body
                    : 'Setelah form dikirim, halaman ini akan menentukan apakah Anda berhenti di sini atau lanjut ke jalur percakapan yang sesuai.'}
                </p>
                {outcome?.fallback ? (
                  <p
                    className={cn(
                      'text-sm leading-7',
                      outcome.kind === 'reject'
                        ? 'text-[var(--muted)]'
                        : 'text-[rgba(10,10,10,0.68)]',
                    )}
                  >
                    {outcome.fallback}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[240px]">
                {outcome ? (
                  outcome.kind === 'reject' ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      className="h-12"
                      onClick={() => scrollToId('qualification-form')}
                    >
                      Periksa Lagi Jawaban
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="dark" size="lg" className="h-12">
                        <a href={outcome.href} target="_blank" rel="noreferrer">
                          {outcome.ctaLabel}
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="h-12"
                        onClick={() => scrollToId('qualification-form')}
                      >
                        Edit Jawaban
                      </Button>
                    </>
                  )
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-12"
                    onClick={() => scrollToId('qualification-form')}
                  >
                    Isi Form Dulu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-18 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 space-y-4">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--paper)] sm:text-5xl">
                Pertanyaan yang biasanya muncul sebelum lanjut konsultasi.
              </h2>
            </div>

            <div className="grid gap-4">
              {faqItems.map((item) => (
                <Card key={item.question} className="rounded-[1.7rem] border-[var(--line)] bg-[var(--panel)] p-0">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[1.65rem] leading-[1.05] text-[var(--paper)] marker:content-none">
                      {item.question}
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--muted)] transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--line)] px-6 pb-6 pt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                      {item.answer}
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2.3rem] border border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.36)] sm:px-8 lg:px-12 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-4">
                <SectionLabel className="border-[rgba(10,10,10,0.12)] bg-[rgba(255,255,255,0.28)] text-[rgba(10,10,10,0.64)]">
                  Final CTA
                </SectionLabel>
                <h2 className="font-display text-4xl leading-[0.92] tracking-[-0.05em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
                  Jika bisnis Anda sudah besar, pastikan jalur berikutnya juga presisi.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[rgba(10,10,10,0.72)] sm:text-lg">
                  Lengkapi private fit check lebih dulu. Setelah itu, sistem akan menentukan apakah
                  Anda berhenti di halaman ini atau lanjut ke percakapan yang tepat.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Button
                  variant="dark"
                  size="xl"
                  className="min-w-[230px]"
                  onClick={() => scrollToId('qualification-form')}
                >
                  Isi Form Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-[rgba(10,10,10,0.64)]">
                  Jalur WhatsApp tetap tertutup sampai form selesai.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[rgba(10,10,10,0.94)] p-4 backdrop-blur-xl sm:hidden">
        <Button
          variant="primary"
          size="lg"
          className="h-12 w-full"
          onClick={() => scrollToId('qualification-form')}
        >
          Isi Form Dulu
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default App;
