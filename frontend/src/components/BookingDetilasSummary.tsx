import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

const BookingDetilasSummary = ({
  checkIn,
  childCount,
  checkOut,
  adultCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking details</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">
          {`${hotel.name}, ${hotel.city}, ${hotel.country}`}
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold">{checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-4">
        Total length of stay:
        <div className="font-bold">{numberOfNights} nights</div>
      </div>
      <div className="">
        Guests:
        <div className="font-bold">
          {adultCount} adult & {childCount} child
        </div>
      </div>
    </div>
  );
};

export default BookingDetilasSummary;
