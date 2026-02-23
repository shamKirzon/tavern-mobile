import { axiosInstance } from "../api/axiosInstance";

export const createCancellation = async ({
  reservationId,
  reason,
  notes,
}: {
  reservationId: any;
  reason: string | undefined;
  notes: string | undefined;
}) => {
  try {
    const res = await axiosInstance.post(
      "/reservation/cancellation/create-cancellation",
      {
        reservationId,
        reason,
        notes,
      },
    );
    if (!res) return console.log("Can't create cancellation. ");
    return res.data.result.reservation_cancellation_id;
  } catch (error: any) {
    console.log("services/cancellation/createCancellation() error:", error);
  }
};
