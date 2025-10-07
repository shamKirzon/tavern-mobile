interface OtpValidationResult {
  isExpired: boolean | undefined;
  isValid: boolean | undefined;
}

class OtpService {
  private otps: Record<string, { otp: string; expireAt: number }> = {};

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = Date.now() + 5 * 60 * 1000;

    if (this.otps[email]) {
      this.otps[email] = { otp, expireAt };
    }

    return otp;
  }

  async validateOtp(email: string, otp: string): Promise<OtpValidationResult> {
    const record = this.otps[email];

    if (!record) return { isExpired: true, isValid: false };
    if (record?.expireAt < Date.now()) {
      delete this.otps[email];
      return { isExpired: true, isValid: false };
    }
    if (parseInt(otp) !== parseInt(record.otp)) {
      delete this.otps[email];
      return { isExpired: false, isValid: false };
    }

    delete this.otps[email];
    return { isExpired: false, isValid: true };
  }
}

export const otpService = new OtpService();
