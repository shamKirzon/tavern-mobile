interface OtpValidationResult {
  isExpired: boolean | undefined;
  isValid: boolean | undefined;
}

class OtpService {
  private otps: Record<string, { otp: string; expireAt: number }> = {};

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expireAt = Date.now() + 3 * 60 * 1000;

    this.otps[email] = { otp, expireAt };

    return otp;
  }

  async validateOtp(email: string, otp: string): Promise<OtpValidationResult> {
    const record = this.otps[email];

    if (!record) return { isExpired: true, isValid: false };
    if (record?.expireAt < Date.now()) {
      return { isExpired: true, isValid: false };
    }
    if (parseInt(otp) !== parseInt(record.otp)) {
      return { isExpired: false, isValid: false };
    }

    delete this.otps[email];
    return { isExpired: false, isValid: true };
  }
}

export const otpService = new OtpService();
