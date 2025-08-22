'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './phrase.module.css';

export default function ImportPhrasePage() {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!recoveryPhrase.trim()) {
      setError('Please enter your recovery phrase');
      return;
    }

    const wordCount = recoveryPhrase.trim().split(/\s+/).length;
    if (wordCount !== 12 && wordCount !== 24) {
      setError('Recovery phrase must be 12 or 24 words');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // In a real app, we would import the wallet using the recovery phrase
    // For demo purposes, we'll just navigate to the dashboard
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoHeader}>
        <Link href="/">
          <Image
            src="/logo-enkrypt.svg"
            alt="Enkrypt"
            width={120}
            height={28}
            className={styles.logo}
          />
        </Link>
      </div>

      <div className={styles.contentWrapper}>
        <Link href="/create/option" className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Import Recovery Phrase</h1>
          <p className={styles.subtitle}>Import your existing wallet using a 12 or 24-word recovery phrase</p>
          
          <form onSubmit={handleSubmit}>
            {/* Recovery Phrase field */}
            <div className={styles.inputContainer}>
              <label htmlFor="recoveryPhrase" className={styles.label}>Recovery Phrase</label>
              <textarea
                id="recoveryPhrase"
                placeholder="Enter your recovery phrase (12 or 24 words separated by spaces)"
                value={recoveryPhrase}
                onChange={(e) => setRecoveryPhrase(e.target.value)}
                className={styles.textArea}
                rows={4}
              />
              <p className={styles.helperText}>
                Type your recovery phrase (mnemonic) with spaces between each word.
              </p>
            </div>

            {/* Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.label}>New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Confirm Password field */}
            <div className={styles.inputContainer}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.divider}></div>
            
            <button 
              type="submit" 
              className={styles.importButton}
            >
              Import Wallet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
