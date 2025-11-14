export type RootStackParamLists = {
  ReservationReview: undefined;
  WelcomeScreen: undefined;
  ReservationPayment: undefined;
  ReservationScreen: undefined;
  EmailVerificationScreen: { email: string };
  OrderPolicyScreen: undefined;
  HomeScreen: undefined;
  BookingSummaryScreen: {
    name: string;
    date: string;
    guests: number;
    reservationType: string;
    reservationFee: string;
  };
  ReservationPaymentScreen: { reservationFee: string };
  MenuViewingScreen: { category: string };
  CustomizationScreen: { order?: any; from: "OrderHomeScreen" | "CartScreen" };
  OrderHomeScreen: undefined;
  ReservationStatusScreen: { reservationStatus: string };
  OrderStatusScreen: undefined;
  CartScreen: undefined;
};
