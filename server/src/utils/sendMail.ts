import { transporter } from "../lib/transporter";

export async function sendMail(to: string, otp: string): Promise<void> {
  const subject = "Your Tav Restobar OTP Code";

  const html = `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #2a2a2a; /* dark grey background */
      padding: 40px;
      color: #ffffff;
    ">
      <div style="
        max-width: 600px;
        margin: auto;
        background: #1e1e1e;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        overflow: hidden;
        border-top: 4px solid #8A1717;
      ">
        <!-- Header -->
        <div style="background-color: #8A1717; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 2px;">TAV</h1>
          <p style="color: #f0f0f0; margin: 5px 0 0; font-size: 14px;">
            EST. 2008 — Tav Restobar
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #f7c331; margin-bottom: 20px;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px; color: #d0d0d0; margin-bottom: 30px;">
            Use the code below to verify your email. It expires in <strong>3 minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="
            display: inline-block;
            background-color: #8A1717;
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 6px;
            padding: 20px 40px;
            border-radius: 12px;
            margin-bottom: 30px;
          ">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #aaaaaa;">
            If you did not request this, simply ignore this email.
          </p>

          <p style="font-size: 14px; color: #bbbbbb; margin-top: 25px;">
            Cheers,<br>
            <strong>The Tav Restobar Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background-color: #1a1a1a;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #777;
        ">
          © ${new Date().getFullYear()} Tav Restobar. All rights reserved.
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Tav Restobar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
