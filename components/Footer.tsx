import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <ul className={styles.links}>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">How it works</a>
              </li>
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Advertise With Us</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <ul className={styles.links}>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Bug Bounty</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <ul className={styles.links}>
              <li>
                <a href="#">MEW Mobile App</a>
              </li>
              <li>
                <a href="#">Enkrypt</a>
              </li>
              <li>
                <a href="#">MEW Portfolio Manager</a>
              </li>
              <li>
                <a href="#">ethVM</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Press Kit</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <ul className={styles.links}>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Customer Support</a>
              </li>
              <li>
                <a href="#">Security Policy</a>
              </li>
              <li>
                <a href="#">Verify Message</a>
              </li>
              <li>
                <a href="#">Convert Units</a>
              </li>
              <li>
                <a href="#">Send Offline Helper</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <p className={styles.donationText}>
              Help us keep MEW free and open-source, your donations go a long
              way towards making that possible.
            </p>
            <div className={styles.donationLinks}>
              <a href="#" className={styles.donationLink}>
                <span className={styles.cryptoIcon}>◊</span> Ethereum Donation
              </a>
              <a href="#" className={styles.donationLink}>
                <span className={styles.cryptoIcon}>₿</span> Bitcoin Donation
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2023 MyEtherWallet. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon}>
              Facebook
            </a>
            <a href="#" className={styles.socialIcon}>
              Twitter
            </a>
            <a href="#" className={styles.socialIcon}>
              Instagram
            </a>
            <a href="#" className={styles.socialIcon}>
              LinkedIn
            </a>
            <a href="#" className={styles.socialIcon}>
              GitHub
            </a>
            <a href="#" className={styles.socialIcon}>
              Reddit
            </a>
            <a href="#" className={styles.socialIcon}>
              Medium
            </a>
            <a href="#" className={styles.socialIcon}>
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
