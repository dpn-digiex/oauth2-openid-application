import { useState, useEffect } from "react";
import Modal from "react-modal";
import ReCAPTCHA from "react-google-recaptcha";
import { envConfig } from "@utils";
import { IoCloseSharp } from "react-icons/io5";

import styles from "./index.module.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "480px",
  },
};

const RecaptchaModal = ({
  onVerifyRecaptcha,
}: {
  onVerifyRecaptcha: (result: { passed: boolean }) => void;
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setIsOpenModal(true);
  }, []);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="reCAPTCHA Modal"
    >
      <div className={styles.header}>
        <p className={styles.titleModal}>Security Verification</p>
        <div className={styles.closeIcon} onClick={closeModal}>
          <IoCloseSharp />
        </div>
      </div>
      <div id="recaptcha-container" className={styles.recaptchaContainer}>
        <p className={styles.description}>Let do a quick security check.</p>
        <ReCAPTCHA
          hl="en"
          size="normal"
          sitekey={envConfig.GOOGLE_RECAPTCHA_SITE_KEY || ""}
          onChange={handleRecaptchaChange}
        />
      </div>
    </Modal>
  );
};

export default RecaptchaModal;
