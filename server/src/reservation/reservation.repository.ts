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
        return console.log(
          "Query failed in reservationRepository/createReservation()",
          error,
        );

      return data;
    } catch (error: any) {
      console.log("Error in createReservation: ", error);
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
      console.log("Error in getting reservation information: ", error);
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
      console.log("Error in getting reservation status ", error);
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
      console.log("Error in getting reservation amount ", error);
    }
  }

  async assignSecurityId(employeeId: string, reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .update({ assigned_security_id: employeeId })
        .eq("reservation_id", reservationId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.log("Error in reservationRepository/assignSecurityId ", error);
    }
  }

  async createCancellation(
    reservationId: string,
    reason: string,
    notes: string,
  ) {
    try {
      const { data, error } = await supabase
        .from("reservation_cancellations")
        .insert([{ reservation_id: reservationId, reason, notes }])
        .select()
        .single();

      await this.updateReservationStatus(reservationId, "cancelled");

      if (error)
        return console.log(
          "Query failed in reservationRepository/createCancellation()",
          error.cause,
        );

      return data;
    } catch (error) {
      console.log(
        "Error in reservationRepository/createCancellation() ",
        error,
      );
    }
  }

  async getCancellationData(reservationCancellationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservation_cancellations")
        .select("*")
        .eq("reservation_cancellation_id", reservationCancellationId);

      if (error)
        return console.log(
          "Query failed in reservationRepository/getCancellationData()",
          error,
        );

      return data;
    } catch (error) {
      console.log(
        "Error in reservationRepository/createCancellation() ",
        error,
      );
    }
  }

  async getBookingDays() {
    try {
      const { data, error } = await supabase
        .from("booking_days")
        .select("date, booked_slots")
        .eq("status", "available");

      if (error) throw error;

      return data;
    } catch (error) {
      console.log("Error in getting reserved dates ", error);
    }
  }

  async updateReservationStatus(reservationId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .update([{ reservation_status: status }])
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return { message: "Reservation status updated successfully." };
    } catch (error) {
      console.error("Error in repository/updateReservationStatus():", error);
    }
  }
  async getReservationById(reservationId: string) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("reservation_id", reservationId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getReservationById():", error);
      return null;
    }
  }

  async updateBookedSlots(date: string, pax: number) {
    try {
      const formattedDate = date?.split("T")[0];

      const { data: currentData, error: fetchError } = await supabase
        .from("booking_days")
        .select("booked_slots")
        .eq("date", formattedDate)
        .single();

      if (fetchError) throw fetchError;

      const newSlots = (currentData?.booked_slots || 0) + pax;

      const { data, error } = await supabase
        .from("booking_days")
        .update({ booked_slots: newSlots })
        .eq("date", formattedDate)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.log("Error in reservationRepository/updateBookedSlots ", error);
    }
  }
}

export const reservationRepository = new ReservationRepository();
