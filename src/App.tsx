import React from 'react';
import { ArrowRight, BadgeAlert, Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { CTA_URL } from './lib/constants';

const leakPoints = [
  {
    label: 'Stock',
    title: 'Cash tertahan di inventory',
    body: 'Inventory terlihat seperti aset, tapi bisa mengunci uang yang dibutuhkan untuk operasional.',
  },
  {
    label: 'Piutang',
    title: 'Uang sudah tercatat, belum kembali',
    body: 'Revenue sudah muncul di laporan, tetapi uangnya belum masuk cukup cepat ke rekening bisnis.',
  },
  {
    label: 'Biaya',
    title: 'Biaya rutin menekan ruang napas',
    body: 'Tanpa kontrol biaya yang disiplin, omzet tambahan bisa ikut bocor tanpa terasa.',
  },
];

const pressureCards = [
  {
    title: 'Gaji jadi tekanan bulanan',
    body: 'Tim harus dibayar tepat waktu, tapi posisi cash tidak selalu siap setiap siklus payroll.',
  },
  {
    title: 'Cash tertahan di stock',
    body: 'Barang menumpuk dan uang yang seharusnya bisa berputar tertahan terlalu lama di gudang.',
  },
  {
    title: 'Piutang tidak balik-balik',
    body: 'Penjualan sudah terjadi, tetapi kas belum kembali cukup cepat untuk menopang operasi.',
  },
  {
    title: 'Biaya tidak terlihat jelas',
    body: 'Owner menanggung tekanan karena cost control tidak memberi peta yang cukup tegas.',
  },
];

const diagnosticModules = [
  {
    title: 'Collection',
    body: 'Apakah uang dari pelanggan kembali cukup cepat dan cukup disiplin untuk menjaga napas bisnis?',
  },
  {
    title: 'Inventory',
    body: 'Apakah stock menyerap cash lebih besar dari yang seharusnya dibanding kecepatannya berputar?',
  },
  {
    title: 'Cost Control',
    body: 'Apakah biaya rutin sudah terlihat, dikendalikan, dan diprioritaskan sebelum menekan profit?',
  },
];

const fitBullets = [
  'Omzet bisnis sudah besar, sekitar Rp5 miliar/bulan atau menuju level tersebut.',
  'Payroll, stock, piutang, atau biaya masih membuat owner tertekan.',
  'Anda ingin membedah cash flow, bukan mencari motivasi bisnis umum.',
  'Anda siap bicara dengan tim dan menjawab kondisi bisnis secara konkret.',
];

const notFitBullets = [
  'Belum punya bisnis berjalan.',
  'Masih tahap rencana tanpa revenue nyata.',
  'Mencari harga, diskon, atau webinar gratis.',
  'Tidak siap membuka kondisi omzet, piutang, stock, dan biaya secara jujur.',
];

const faqItems = [
  {
    question: 'Kalau omzet saya sudah besar, kenapa masih perlu konsultasi seperti ini?',
    answer:
      'Karena masalah yang diangkat video ini bukan kekurangan penjualan. Fokusnya adalah melihat di mana cash tertahan, bocor, atau tidak kembali cukup cepat sehingga owner tetap menanggung tekanan.',
  },
  {
    question: 'Apakah ini sesi motivasi atau webinar penjualan?',
    answer:
      'Tidak. CTA ini mengarah ke konsultasi awal dengan tim Coach Ferly untuk mengecek kondisi bisnis secara konkret, bukan pendaftaran event.',
  },
  {
    question: 'Apa yang dilihat lebih dulu dalam konsultasi awal?',
    answer:
      'Tiga area utama: collection, inventory, dan cost control. Tujuannya memberi peta awal apakah sistem cash flow memang sedang bocor.',
  },
];

const App: React.FC = () => {
  const openCta = () => {
    window.open(CTA_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[var(--lg6-black)] text-[var(--lg6-cream)]">
      <div className="lg6-bg" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[var(--lg6-line)] bg-[rgba(5,5,5,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.32em] text-[var(--lg6-muted)]">
              LG6 Cash Flow Diagnostic
            </p>
            <p className="font-display text-lg text-[var(--lg6-cream)]">Coach Ferly F. Raya</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="h-11 px-5 text-sm sm:h-12 sm:px-7 sm:text-base"
            onClick={openCta}
          >
            Konsultasi 1-on-1
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-8">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="hero-reveal">
                <Badge className="border-[var(--lg6-gold)]/25 bg-[var(--lg6-gold)]/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-[var(--lg6-gold)]">
                  Untuk Owner Bisnis Rp5M+/Bulan
                </Badge>
              </div>

              <div className="hero-reveal hero-reveal-delay-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="font-display text-[2.7rem] leading-[0.92] tracking-[-0.05em] text-[var(--lg6-cream)] sm:text-6xl lg:max-w-4xl lg:text-[5.4rem]">
                    Omzet Sudah Besar,
                    <span className="block text-[var(--lg6-gold)]">Tapi Cash Masih Bocor?</span>
                  </h1>
                  <p className="max-w-2xl font-ui text-base leading-8 text-[var(--lg6-muted)] sm:text-lg">
                    Kalau setiap bulan masih deg-degan bayar gaji, cash tertahan di stock, dan piutang tidak
                    balik-balik, masalahnya mungkin bukan tambah omzet. Sistem cash flow Anda perlu dibedah.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lg6-line)] bg-white/5 px-4 py-2 text-sm text-[var(--lg6-cream)]">
                    <ShieldCheck className="h-4 w-4 text-[var(--lg6-gold)]" />
                    Fokus pada sistem collection, inventory, dan kontrol biaya
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--lg6-line)] bg-white/5 px-4 py-2 text-sm text-[var(--lg6-muted)]">
                    <BadgeAlert className="h-4 w-4 text-[var(--lg6-danger)]" />
                    Bukan webinar. Bukan pitch generik.
                  </div>
                </div>
              </div>

              <div className="hero-reveal hero-reveal-delay-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-14 px-8 text-base shadow-[0_24px_60px_rgba(212,175,106,0.22)]"
                  onClick={openCta}
                >
                  Konsultasi 1-on-1
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="font-ui text-sm text-[var(--lg6-muted)]">
                  Diarahkan ke tim Coach Ferly untuk pengecekan awal.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {leakPoints.map((item) => (
                  <Card
                    key={item.label}
                    className="border-[var(--lg6-line)] bg-[var(--lg6-panel)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
                  >
                    <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--lg6-danger)]">
                      {item.label}
                    </p>
                    <h2 className="font-display text-2xl text-[var(--lg6-cream)]">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--lg6-muted)]">{item.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="hero-portrait-frame relative overflow-hidden rounded-[2rem] border border-[var(--lg6-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.48)]">
                <div className="absolute inset-x-6 top-6 z-20 flex items-center justify-between rounded-full border border-[var(--lg6-line)] bg-[rgba(5,5,5,0.7)] px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[var(--lg6-muted)]">
                  <span>Private CFO War Room</span>
                  <span className="text-[var(--lg6-gold)]">Controlled</span>
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

                <Card className="relative z-20 -mt-24 ml-auto mr-2 max-w-[340px] border-[var(--lg6-line)] bg-[rgba(11,11,11,0.92)] p-5 backdrop-blur-xl lg:-mt-40 lg:mr-4">
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-[var(--lg6-gold)]">
                      Cash Leak Diagnostic
                    </p>
                    <CircleAlert className="h-4 w-4 text-[var(--lg6-danger)]" />
                  </div>
                  <div className="mt-5 space-y-4">
                    {leakPoints.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-[var(--lg6-line)] bg-white/5 px-4 py-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-display text-xl text-[var(--lg6-cream)]">{item.label}</p>
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--lg6-danger)]" />
                        </div>
                        <p className="text-sm leading-6 text-[var(--lg6-muted)]">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="space-y-5">
              <Badge className="border-[var(--lg6-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-muted)]">
                Problem Mirror
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)] sm:text-5xl">
                Bisnis Bisa Tembus Miliaran, Tapi Owner Tetap Tidak Tenang
              </h2>
              <p className="max-w-xl text-base leading-8 text-[var(--lg6-muted)] sm:text-lg">
                Banyak bisnis tidak kekurangan penjualan. Masalahnya cash tidak terkendali. Barang menumpuk,
                pembayaran pelanggan lambat, biaya berjalan terus, dan owner tetap menjadi orang pertama yang
                menanggung tekanan setiap bulan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pressureCards.map((item) => (
                <Card
                  key={item.title}
                  className="border-[var(--lg6-line)] bg-[var(--lg6-panel)] p-6 before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-[var(--lg6-danger)]/60"
                >
                  <h3 className="font-display text-2xl text-[var(--lg6-cream)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--lg6-muted)]">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--lg6-line)] bg-[linear-gradient(135deg,rgba(212,175,106,0.08),rgba(255,255,255,0.02))] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:px-10 lg:px-14 lg:py-14">
            <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--lg6-gold)]">Reframe</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
              <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.06em] text-[var(--lg6-cream)] sm:text-5xl lg:text-6xl">
                Bukan tambah omzet dulu.
                <span className="mt-2 block text-[var(--lg6-gold)]">Rapikan cash flow dulu.</span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-[var(--lg6-muted)] sm:text-lg">
                Dari video Coach Ferly: fokusnya bukan sekadar tambah omzet. Fokusnya merapikan sistem collection,
                inventory, dan kontrol biaya supaya cash bisa bertahan di bisnis, bukan hanya lewat.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <Badge className="border-[var(--lg6-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-muted)]">
                  3 Titik Bocor
                </Badge>
                <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)] sm:text-5xl">
                  3 Titik Bocor Yang Harus Dilihat
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-[var(--lg6-muted)] sm:text-lg">
                Konsultasi awal harus membantu owner melihat di mana cash hilang dari sistem sebelum bisnis dipaksa
                tumbuh lebih cepat.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_1fr]">
              {diagnosticModules.map((item, index) => (
                <Card
                  key={item.title}
                  className={`border-[var(--lg6-line)] bg-[var(--lg6-panel)] p-6 lg:p-7 ${
                    index === 1 ? 'lg:translate-y-10' : ''
                  }`}
                >
                  <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-[var(--lg6-danger)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] text-[var(--lg6-cream)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--lg6-muted)] sm:text-base">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 rounded-[2rem] border border-[var(--lg6-line)] bg-[rgba(255,255,255,0.03)] px-6 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14 lg:py-14">
            <div className="space-y-4">
              <Badge className="border-[var(--lg6-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-muted)]">
                Desired State
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)] sm:text-5xl">
                Bisnis Tetap Jalan. Owner Bisa Tidur Lebih Tenang.
              </h2>
            </div>

            <div className="space-y-5">
              <p className="text-base leading-8 text-[var(--lg6-muted)] sm:text-lg">
                Targetnya bukan membuat klaim instan. Targetnya memberi owner peta yang lebih jelas: cash masuk dari
                mana, tertahan di mana, bocor di mana, dan keputusan apa yang harus diprioritaskan.
              </p>
              <div className="inline-flex items-start gap-3 rounded-2xl border border-[var(--lg6-line)] bg-[rgba(212,175,106,0.08)] px-4 py-4 text-sm leading-7 text-[var(--lg6-cream)]">
                <ShieldCheck className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--lg6-gold)]" />
                Dipandu oleh Coach Ferly F. Raya dan tim untuk pengecekan awal melalui funnel LG6.
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2">
            <Card className="border-[var(--lg6-line)] bg-[var(--lg6-panel)] p-7 lg:p-8">
              <Badge className="border-[var(--lg6-gold)]/25 bg-[var(--lg6-gold)]/10 px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-gold)]">
                Cocok Untuk Anda
              </Badge>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)]">
                Cocok Jika Anda Sudah Punya Bisnis Berjalan
              </h2>
              <ul className="mt-8 space-y-4">
                {fitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--lg6-muted)] sm:text-base">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--lg6-gold)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-[var(--lg6-line)] bg-[rgba(196,81,58,0.08)] p-7 lg:p-8">
              <Badge className="border-[var(--lg6-danger)]/30 bg-[var(--lg6-danger)]/10 px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-danger)]">
                Tidak Untuk Anda
              </Badge>
              <h2 className="mt-5 font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)]">
                Tidak Untuk Bisnis Yang Masih Mencari Ide
              </h2>
              <ul className="mt-8 space-y-4">
                {notFitBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--lg6-muted)] sm:text-base">
                    <CircleAlert className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--lg6-danger)]" />
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
              <Badge className="border-[var(--lg6-line)] bg-transparent px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-muted)]">
                FAQ
              </Badge>
              <h2 className="font-display text-4xl leading-tight tracking-[-0.05em] text-[var(--lg6-cream)] sm:text-5xl">
                Pertanyaan Yang Biasanya Muncul Sebelum Masuk Konsultasi
              </h2>
            </div>

            <div className="grid gap-4">
              {faqItems.map((item) => (
                <Card key={item.question} className="border-[var(--lg6-line)] bg-[var(--lg6-panel)] p-0">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-xl text-[var(--lg6-cream)] marker:content-none">
                      {item.question}
                      <span className="rounded-full border border-[var(--lg6-line)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--lg6-muted)] transition group-open:rotate-180">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-[var(--lg6-line)] px-6 pb-6 pt-4 text-sm leading-7 text-[var(--lg6-muted)] sm:text-base">
                      {item.answer}
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--lg6-line)] bg-[linear-gradient(135deg,rgba(212,175,106,0.14),rgba(255,255,255,0.03))] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,0.36)] sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-5">
                <Badge className="border-[var(--lg6-line)] bg-[rgba(5,5,5,0.16)] px-4 py-1 uppercase tracking-[0.24em] text-[var(--lg6-cream)]">
                  CTA
                </Badge>
                <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.05em] text-[var(--lg6-black)] sm:text-5xl lg:text-6xl">
                  Ingin Tahu Apakah Sistem Anda Bocor?
                </h2>
                <p className="max-w-2xl text-base leading-8 text-[rgba(5,5,5,0.76)] sm:text-lg">
                  Klik tombol di bawah untuk masuk ke konsultasi awal dengan tim Coach Ferly. Halaman ini hanya
                  punya satu tujuan: membawa owner yang serius ke percakapan awal yang relevan.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Button
                  variant="white"
                  size="lg"
                  className="h-14 min-w-[220px] border border-black/10 px-8 text-base shadow-[0_20px_50px_rgba(5,5,5,0.18)]"
                  onClick={openCta}
                >
                  Konsultasi 1-on-1
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-[rgba(5,5,5,0.62)]">{CTA_URL}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--lg6-line)] bg-[rgba(5,5,5,0.94)] p-4 backdrop-blur-xl sm:hidden">
        <Button variant="primary" size="lg" className="h-12 w-full text-sm" onClick={openCta}>
          Konsultasi 1-on-1
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default App;
