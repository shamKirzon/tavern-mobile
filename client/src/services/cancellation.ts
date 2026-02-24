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

export const getCancellationData = async (
  reservationCancellationId: string,
) => {
  try {
    const res = await axiosInstance.get(
      `/reservation/cancellation/get-cancellation-data/${reservationCancellationId}`,
    );
    return res.data.result[0].status;
  } catch (error: any) {
    console.log("services/cancellation/getCancellationData() error:", error);
  }
};
