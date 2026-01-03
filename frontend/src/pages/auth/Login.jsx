import React, { useState } from "react"
import { motion } from "framer-motion"
import { authService } from "../../../services/authService"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import Button from "../../components/common/Button"

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token, user } = await authService.login(email, password)
      login(user, token)
      toast.success("Welcome back 👋")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error("Password too short")
    if (!email.includes("@")) return toast.error("Invalid email")

    setLoading(true)
    try {
      await authService.register(username, email, password)
      toast.success("Account created. Please login.")
      setIsRegister(false)
    } catch (err) {
      toast.error(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="relative w-full max-w-4xl min-h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl flex">

        {/* FORM PANEL */}
        <motion.div
  className="w-full md:w-1/2 flex items-center justify-center p-8 z-10 bg-white"
  initial={false}
  animate={{ 
    // On mobile (default), x is always 0. 
    // On md (768px+), x toggles between 0% and 100%.
    x: window.innerWidth < 768 ? "0%" : (isRegister ? "100%" : "0%") 
  }}
  transition={{ duration: 0.6, ease: "easeInOut" }}
>
          <div className="w-full max-w-sm">

            {/* LOGIN */}
            {!isRegister && (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Welcome back
                </h2>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border border-slate-400/50 focus:ring-2 focus:ring-emerald-500 outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-emerald-500 outline-none border-slate-400/50 "
                />

                <Button
                  disabled={loading}
                  onClick={handleLogin}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>

                <p
                  onClick={() => setIsRegister(true)}
                  className="text-sm text-center text-slate-600 cursor-pointer"
                >
                  New here?{" "}
                  <span className="text-emerald-600 font-semibold">
                    Create an account →
                  </span>
                </p>

                <Button
                  variant="secondary"
                  className="w-full border mt-4 border-slate-400/50 "
                >
                  <Link to="/">Go back to home</Link>
                </Button>
              </form>
            )}

            {/* REGISTER */}
            {isRegister && (
              <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Create account
                </h2>

                <input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-emerald-500 outline-none border-slate-400/50 "
                />

                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-emerald-500 outline-none border-slate-400/50 "
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-100 border focus:ring-2 focus:ring-emerald-500 outline-none border-slate-400/50 "
                />

                <Button
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  {loading ? "Creating..." : "Register"}
                </Button>

                <p
                  onClick={() => setIsRegister(false)}
                  className="text-sm text-center text-slate-600 cursor-pointer"
                >
                  ←{" "}
                  <span className="text-emerald-600 font-semibold">
                    Already have an account
                  </span>
                </p>

                <Button
                  variant="secondary"
                  className="w-full border mt-4 border-slate-400/50 "
                >
                  <Link to="/">Go back to home</Link>
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* IMAGE PANEL (DESKTOP ONLY) */}
        <motion.div
          animate={{ x: isRegister ? "-100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-1/2 h-full hidden md:flex bg-gradient-to-r from-emerald-400 to-teal-600"
        >
          <img
            src="/loginimg.png"
            alt="App preview"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage
