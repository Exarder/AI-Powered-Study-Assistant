import { Link } from 'react-router-dom';
import { STUDY_MODES } from '../utils/prompts';

const FEATURES = [
  {
    title: 'Tanya Materi Kuliah',
    description:
      'Ajukan pertanyaan tentang konsep, definisi, atau bagian materi yang belum dipahami. Tutor AI menjawab dengan bahasa yang jelas.',
    icon: '📚',
  },
  {
    title: 'Rangkuman Cepat',
    description:
      'Gunakan Summary Mode untuk mendapatkan catatan padat yang siap dipelajari ulang sebelum ujian.',
    icon: '📝',
  },
  {
    title: 'Soal Latihan',
    description:
      'Quiz Mode memberikan soal latihan interaktif beserta pembahasan setelah Anda menjawab.',
    icon: '🎯',
  },
  {
    title: 'Riwayat Sesi',
    description:
      'Percakapan tersimpan selama sesi browser aktif, sehingga Anda bisa melanjutkan belajar tanpa kehilangan konteks.',
    icon: '💬',
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium text-indigo-600">AI-Powered Study Assistant</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Belajar lebih pintar dengan tutor AI
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              StudyAI membantu Anda memahami materi kuliah, merangkum catatan, dan berlatih
              soal — semua dalam satu antarmuka yang bersih dan fokus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Mulai Chat Tutor
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Lihat Fitur
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900">Fitur utama</h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Dirancang untuk mahasiswa yang ingin belajar mandiri dengan bantuan AI yang terarah.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm"
            >
              <span className="text-2xl" role="img" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">Mode belajar</h2>
          <p className="mt-2 text-slate-600">
            Pilih mode sesuai kebutuhan Anda di halaman chat.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {Object.values(STUDY_MODES).map((mode) => (
              <div
                key={mode.id}
                className="rounded-xl border border-slate-200 p-5 text-center"
              >
                <span className="text-3xl" role="img" aria-hidden>
                  {mode.icon}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{mode.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{mode.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/chat"
              className="inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Buka Chat Tutor →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
