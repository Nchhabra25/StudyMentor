import { motion } from "framer-motion"
import {
  Brain,
  Sparkles,
  FileText,
  Star,
  BarChart3,
  Shield,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import Button from "../components/common/Button"
import {Link} from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}
const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
}

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg tracking-tight">
              StudyMentor<span className="text-emerald-400">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <a href="/login" className="hover:text-slate-900">Login</a>
          </nav>

          <Button className="px-4 py-2 text-sm sm:text-base">
            <Link to='/login'>
            Get Started
            </Link>
          </Button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-24 pb-24 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeLeft}
          className="space-y-6 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full bg-indigo-100 text-slate-800 mx-auto lg:mx-0">
            <Sparkles size={14} />
            AI-powered studying
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Study smarter.
            <br />
            <span className="text-emerald-500">Remember more.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
            Upload documents, generate AI flashcards and quizzes, and track
            your learning — all in one clean workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button className="gap-2 w-full sm:w-auto">
              Try it free <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          variants={fadeRight}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src="/heroimg.png"
            alt="App preview"
            className="rounded-3xl w-full"
          />
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, title: "AI Flashcards", desc: "Auto-generate flashcards." },
            { icon: FileText, title: "AI Quizzes", desc: "Instant smart quizzes." },
            { icon: Star, title: "Smart Review", desc: "Revise what matters." },
            { icon: BarChart3, title: "Progress Tracking", desc: "Visual insights." },
            { icon: Shield, title: "Secure Data", desc: "Private by default." },
            { icon: Sparkles, title: "Clean UX", desc: "Zero distractions." },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-12 h-12 rounded-xl bg-linear-to-r from-emerald-400 to-teal-600 flex items-center justify-center mb-6">
                <f.icon className="text-white/80" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FAQ ================= */}
<section
  id="faq"
  className="max-w-5xl mx-auto px-4 sm:px-6 pt-14"
>
  <motion.div
    initial="hidden"
    whileInView="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.12 } },
    }}
  >
    <motion.h2
      variants={fadeUp}
      className="text-3xl sm:text-4xl font-bold text-center mb-6"
    >
      Questions, answered.
    </motion.h2>

    <motion.p
      variants={fadeUp}
      className="text-slate-600 text-center max-w-2xl mx-auto mb-16"
    >
      Everything you need to know before getting started. No fluff, no
      confusion.
    </motion.p>

    <div className="space-y-4">
      {[
        {
          q: "How does StudyMentor AI generate flashcards and quizzes?",
          a: "Once you upload a document, our AI analyzes the content, identifies key concepts, definitions, and relationships, then automatically creates structured flashcards and quizzes designed for active recall — not rote memorization.",
        },
        {
          q: "What file formats are supported?",
          a: "You can upload PDFs, Word documents, and text files. We’re actively working on support for PPTs, images, and handwritten notes.",
        },
        {
          q: "Is my data private and secure?",
          a: "Yes. Your documents are private by default. We don’t share your data, and everything is protected using industry-standard security practices.",
        },
        {
          q: "Can I track my learning progress?",
          a: "Absolutely. StudyMentor AI tracks what you’ve reviewed, how often, and what you struggle with — so you always know where to focus next.",
        },
        {
          q: "Is this free to use?",
          a: "You can start for free and explore the core features. Advanced AI tools and analytics are available in premium plans.",
        },
      ].map((item, i) => (
        <motion.details
          key={i}
          variants={fadeUp}
          className="group rounded-2xl border border-slate-200 bg-white p-6 cursor-pointer"
        >
          <summary className="flex items-center justify-between font-medium text-slate-900">
            {item.q}
            <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-slate-500" />
          </summary>
          <p className="mt-4 text-slate-600 leading-relaxed">
            {item.a}
          </p>
        </motion.details>
      ))}
    </div>
  </motion.div>
</section>


      {/* ================= CTA ================= */}
<section className="py-10 px-4 sm:px-6">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-400 to-teal-600 max-w-3/4 mx-auto p-8"
  >
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
      <div className="max-w-xl text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Stop rereading.  
          <br />
          Start actually learning.
        </h2>
        <p className="text-white/90 text-lg">
          Turn your notes into flashcards, quizzes, and real understanding —
          automatically.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link to='/login'>
        <Button variant="ghost" className="bg-white mx-auto  text-slate-800 w-full sm:w-auto">
          Get Started Free
        </Button>
        </Link>
      </div>
    </div>

    {/* Glow */}
    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
  </motion.div>
</section>
</div>
  )
}

export default HomePage
