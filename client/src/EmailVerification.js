import React, { useState, useEffect } from "react";
import axios from "axios";

 const backendapi = "https://email-verification-dvyz.onrender.com";
//const backendapi = "http://localhost:8000";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code, 3: success
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // countdown in seconds

  // Countdown effect
  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0 && step === 2) {
      setMessage("Code expired. Please request a new one.");
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const sendCode = async () => {
    try {
      const res = await axios.post(
        // "http://localhost:8000/email/sendemail",
        `${backendapi}/email/sendemail`,
        { email },
        { withCredentials : true, headers: { "Content-Type": "application/json" } }
      );
      setMessage(res.data.message);
      setStep(2);
      setTimeLeft(60); // reset timer to 1 minute
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending code");
    }
  };

  const verifyCode = async () => {
    try {
      console.log("email : ",email);
      console.log("passcode : ",code);
      const res = await axios.post(
        // "http://localhost:8000/email/verifyemail",
        `${backendapi}/email/verifyemail`,
        { email, code },
        { withCredentials : true, headers: { "Content-Type": "application/json" } }
      );
      setMessage(res.data.message);
      if (res.data.message.toLowerCase().includes("success")) {
        setStep(3); // move to success screen
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying code");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Email Verification</h2>

      {/* Step 1 - Enter Email */}
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={sendCode} style={{ padding: "8px 12px" }}>
            Send Code
          </button>
        </>
      )}

      {/* Step 2 - Enter Code */}
      {step === 2 && (
        <>
          <p>Code sent to: <b>{email}</b></p>
          <p>
            Time left:{" "}
            <span style={{ color: timeLeft <= 10 ? "red" : "black" }}>
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </p>
          <input
            type="text"
            placeholder="Enter the 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button
            onClick={verifyCode}
            style={{ padding: "8px 12px" }}
            disabled={timeLeft === 0} // disable after expiry
          >
            Verify Code
          </button>
        </>
      )}

      {/* Step 3 - Success Screen */}
      {step === 3 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", color: "green" }}>✅</div>
          <h3 style={{ color: "green" }}>Successfully Verified!</h3>
        </div>
      )}

      {/* Message Display */}
      {message && step !== 3 && (
        <div style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</div>
      )}
    </div>
  );
}
