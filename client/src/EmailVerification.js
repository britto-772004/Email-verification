import React, { useState } from "react";
import axios from "axios";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // 1: send email, 2: verify
  const [message, setMessage] = useState("");

  const sendCode = async () => {
    try {
      const res = await axios.post("http://localhost:8000/email/sendemail", { email }, {
        headers : {'Content-Type' : 'application/json'},
        withCredentials: true // important if using sessions
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending code");
    }
  };

  const verifyCode = async () => {
    try {
      const res = await axios.post("http://localhost:8000/email/verifyemail", { email, code }, {
        headers : {"Content-Type" : "application/json"},
        withCredentials: true
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying code");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Email Verification</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={sendCode} style={{ padding: "8px 12px" }}>Send Code</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Code sent to: <b>{email}</b></p>
          <input
            type="text"
            placeholder="Enter the 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          />
          <button onClick={verifyCode} style={{ padding: "8px 12px" }}>Verify Code</button>
        </>
      )}

      {message && (
        <div style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</div>
      )}
    </div>
  );
}
