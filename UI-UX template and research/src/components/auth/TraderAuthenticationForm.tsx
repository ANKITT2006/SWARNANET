"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { PasswordVisibilityToggle } from "./PasswordVisibilityToggle";
import { AuthenticationFeedback } from "./AuthenticationFeedback";
import {
  getRememberMe,
  getSavedEmail,
  setRememberMe,
  setSavedEmail,
  setStoredUser,
  setAuthToken,
} from "@/lib/auth";

interface TraderAuthenticationFormProps {
  onSuccess?: () => void;
}

export function TraderAuthenticationForm({
  onSuccess,
}: TraderAuthenticationFormProps) {
  const [traderId, setTraderId] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    traderId?: string;
    password?: string;
    totp?: string;
  }>({});

  // Restore remembered trader ID if set
  useEffect(() => {
    const isRemembered = getRememberMe();
    setRemember(isRemembered);
    if (isRemembered) {
      const saved = getSavedEmail();
      if (saved) setTraderId(saved);
    }
  }, []);

  const validateForm = () => {
    const errors: { traderId?: string; password?: string; totp?: string } = {};
    const trimmedId = traderId.trim();

    if (!trimmedId) {
      errors.traderId = "Trader ID or Institutional Email is required";
    }

    if (!password) {
      errors.password = "Security PIN or Passcode is required";
    } else if (password.length < 6) {
      errors.password = "Security credentials must be at least 6 characters";
    }

    if (totpCode.trim() && !/^\d{6}$/.test(totpCode.trim())) {
      errors.totp = "2FA TOTP code must be exactly 6 digits";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRememberMe(remember);
      if (remember) {
        setSavedEmail(traderId.trim());
      } else {
        setSavedEmail("");
      }

      setSuccessMessage("Handshake authenticated. Routing to MCX Bullion Terminal...");
      const idPart = traderId.trim();
      const authenticatedUser = {
        id: `usr_${Date.now()}`,
        name: idPart.includes("@") ? idPart.split("@")[0].toUpperCase() : idPart.toUpperCase(),
        email: idPart.includes("@") ? idPart : `${idPart}@desk.terminal`,
        role: "Institutional Arbitrage Analyst",
        traderId: idPart.toUpperCase(),
      };
      setStoredUser(authenticatedUser);
      setAuthToken(`token_auth_${Date.now()}`);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = "/";
        }
      }, 300);
    } catch {
      setErrorMessage("Authentication gateway timeout. Please verify credentials and network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      <AuthenticationFeedback error={errorMessage} success={successMessage} />

      {/* 1. Institutional Trader ID or Email matching Photo 1 */}
      <div>
        <div className="flex items-center justify-between mb-1 px-0.5">
          <label
            htmlFor="trader-id-input"
            className="block text-xs font-medium text-[#F1EEE7]"
          >
            Institutional Trader ID or Email
          </label>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#858D97]">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="trader-id-input"
            type="text"
            value={traderId}
            onChange={(e) => {
              setTraderId(e.target.value);
              if (fieldErrors.traderId) {
                setFieldErrors((prev) => ({ ...prev, traderId: undefined }));
              }
            }}
            placeholder="Enter Trader ID or email"
            autoComplete="username"
            disabled={isLoading}
            className={`w-full rounded-xl bg-[#0B0E14]/90 border py-2.5 pl-9 pr-3 text-xs font-mono text-[#F1EEE7] placeholder-[#858D97]/50 focus:outline-none transition-all ${
              fieldErrors.traderId
                ? "border-[#E47777] focus:border-[#E47777] focus:ring-1 focus:ring-[#E47777]"
                : "border-white/10 focus:border-[#D5B16D]/60 focus:ring-1 focus:ring-[#D5B16D]/30"
            }`}
            aria-invalid={Boolean(fieldErrors.traderId)}
            aria-describedby={fieldErrors.traderId ? "trader-id-error" : undefined}
          />
        </div>
        {fieldErrors.traderId && (
          <p id="trader-id-error" className="mt-1 text-[10px] font-mono text-[#E47777]">
            {fieldErrors.traderId}
          </p>
        )}
      </div>

      {/* 2. Security PIN / Passcode matching Photo 1 */}
      <div>
        <div className="flex items-center justify-between mb-1 px-0.5">
          <label
            htmlFor="password-input"
            className="block text-xs font-medium text-[#F1EEE7]"
          >
            Security PIN / Passcode
          </label>
          <Link
            href="/forgot-password"
            className="text-[10px] font-mono text-[#D5B16D] hover:underline transition-colors focus:outline-none"
          >
            Reset PIN
          </Link>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#858D97]">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="Enter trading desk passcode"
            autoComplete="current-password"
            disabled={isLoading}
            className={`w-full rounded-xl bg-[#0B0E14]/90 border py-2.5 pl-9 pr-10 text-xs font-mono text-[#F1EEE7] placeholder-[#858D97]/50 focus:outline-none transition-all ${
              fieldErrors.password
                ? "border-[#E47777] focus:border-[#E47777] focus:ring-1 focus:ring-[#E47777]"
                : "border-white/10 focus:border-[#D5B16D]/60 focus:ring-1 focus:ring-[#D5B16D]/30"
            }`}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            <PasswordVisibilityToggle
              isVisible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              controlId="password-input"
            />
          </div>
        </div>
        {fieldErrors.password && (
          <p id="password-error" className="mt-1 text-[10px] font-mono text-[#E47777]">
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* 3. 2FA / TOTP Authenticator Token matching Photo 1 */}
      <div>
        <div className="flex items-center justify-between mb-1 px-0.5">
          <label
            htmlFor="totp-input"
            className="flex items-center gap-1.5 text-xs font-medium text-[#F1EEE7]"
          >
            <KeyRound className="h-3.5 w-3.5 text-[#D5B16D]" aria-hidden="true" />
            <span>2FA / TOTP Token</span>
          </label>
          <span className="text-[10px] font-mono text-[#858D97] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            Optional
          </span>
        </div>
        <div className="relative">
          <input
            id="totp-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={totpCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setTotpCode(val);
              if (fieldErrors.totp) {
                setFieldErrors((prev) => ({ ...prev, totp: undefined }));
              }
            }}
            placeholder="6-digit rolling code"
            disabled={isLoading}
            className={`w-full rounded-xl bg-[#0B0E14]/90 border py-2.5 px-3 text-xs font-mono tracking-widest text-[#F1EEE7] placeholder-[#858D97]/50 focus:outline-none transition-all ${
              fieldErrors.totp
                ? "border-[#E47777] focus:border-[#E47777]"
                : "border-white/10 focus:border-[#D5B16D]/60 focus:ring-1 focus:ring-[#D5B16D]/30"
            }`}
            aria-invalid={Boolean(fieldErrors.totp)}
            aria-describedby={fieldErrors.totp ? "totp-error" : undefined}
          />
        </div>
        {fieldErrors.totp && (
          <p id="totp-error" className="mt-1 text-[10px] font-mono text-[#E47777]">
            {fieldErrors.totp}
          </p>
        )}
      </div>

      {/* 4. Session Checkbox matching Photo 1 */}
      <div className="flex items-center justify-between pt-0.5 px-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={isLoading}
            className="h-3.5 w-3.5 rounded border-white/20 bg-[#0B0E14] text-[#D5B16D] focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
          />
          <span className="text-xs text-[#858D97]">
            Remember Workstation Session
          </span>
        </label>
      </div>

      {/* 5. Submit Button matching Photo 1 */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#F1EEE7] bg-[#161B24]/90 hover:bg-[#202733] border border-white/15 hover:border-white/25 active:scale-[0.99] transition-all focus:outline-none focus:ring-1 focus:ring-[#D5B16D]/40 disabled:opacity-60 disabled:pointer-events-none cursor-pointer shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#D5B16D]" aria-hidden="true" />
              <span>Verifying Desk Clearance...</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 text-[#D5B16D]" aria-hidden="true" />
              <span>Authenticate & Access Terminal</span>
              <ArrowRight className="h-4 w-4 text-[#858D97]" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
