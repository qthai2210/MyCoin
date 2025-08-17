import React from "react";
import Link from "next/link";
import styles from "./WalletOption.module.css";

interface WalletOptionProps {
  icon: string;
  title: string;
  description: string;
  official?: boolean;
  notRecommended?: boolean;
  isRestore?: boolean;
  linkTo?: string;
}

const WalletOption: React.FC<WalletOptionProps> = ({
  icon,
  title,
  description,
  official = false,
  notRecommended = false,
  isRestore = false,
  linkTo = "/create/password", // Default link to the password page
}) => {
  const content = (
    <div
      className={`${styles.optionContent} ${
        isRestore ? styles.restoreOption : ""
      }`}
    >
      <div className={styles.iconContainer}>
        <img src={icon} alt={title} className={styles.icon} />
      </div>
      <div className={styles.textContent}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          {official && <span className={styles.officialBadge}>Official</span>}
          {notRecommended && (
            <span className={styles.notRecommended}>NOT RECOMMENDED</span>
          )}
          {isRestore && <span className={styles.restoreBadge}>Restore</span>}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );

  return (
    <div
      className={`${styles.optionCard} ${isRestore ? styles.restoreCard : ""}`}
    >
      <Link href={linkTo}>{content}</Link>
    </div>
  );
};

export default WalletOption;
