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
        paymentReferenceNumber,
        paymentAmount,
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
            payment_reference_number: paymentReferenceNumber!,
            payment_amount: paymentAmount!,
          },
        ])
        .select()
        .single();

      if (error)
        return console.error("supabase error in createReservation()", error);

      return data;
    } catch (error: any) {
      console.error("error in createReservation: ", error);
    }
  }
  async getReservationData(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("error in getting reservation information: ", error);
    }
  }

  async getReservationStatus(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("reservation_status")
        .eq("reservation_id", reservationId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("error in getting reservation status ", error);
    }
  }

  async getReservationAmount(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("reservation_amount")
        .eq("reservation_id", reservationId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("error in getting reservation amount ", error);
    }
  }

  async assignSecurityId(employeeId: string, reservationId: string) {
    try {
      // modify this:
      const { data, error } = await supabase
        .from("reservations")
        .update({ assigned_security_id: employeeId })
        .eq("reservation_id", reservationId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("reservationRepository/assignSecurityId ", error);
    }
  }
}

export const reservationRepository = new ReservationRepository();
