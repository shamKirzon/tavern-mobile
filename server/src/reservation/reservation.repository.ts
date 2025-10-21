import { supabase } from "../lib/supabase-client";
import { ReservationData } from "../types/Reservation";

class ReservationRepository {
  async createReservation(reservationData: ReservationData) {
    try {
      const {
        email,
        firstName,
        lastName,
        mobileNumber,
        validIdUrl,
        paymentUrl,
        reservationType,
        date,
        pax,
        reservationAmount,
      } = reservationData;

      const customerId = await supabase
        .from("customers")
        .select("customer_id")
        .eq("email", email)
        .single();

      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            valid_id_url: validIdUrl,
            payment_url: paymentUrl,
            reservation_type: reservationType,
            date,
            pax,
            reservation_amount: reservationAmount,
            customer_id: customerId.data?.customer_id,
          },
        ])
        .eq("email", email)
        .select()
        .single();

      if (error)
        return console.error("supabase error in createReservation()", error);

      return data;
    } catch (error: any) {
      console.error("error in createReservation: ", error);
    }
  }
}

export const reservationRepository = new ReservationRepository();
