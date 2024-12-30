import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCurrentUser, fetchHotelById } from "../api-client";
import BookingForm from "../froms/BookinForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import BookingDetilasSummary from "../components/BookingDetilasSummary";

const Booking = () => {
  const search = useSearchContext();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const { hotelId } = useParams();

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    fetchCurrentUser,
    {}
  );
  if (!hotel) {
    return <></>;
  }
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <div className="mr-2">
        <BookingDetilasSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          hotel={hotel}
          numberOfNights={numberOfNights}
        />
      </div>
      {currentUser && (
        <BookingForm
          currentUser={currentUser}
          totalCost={numberOfNights * hotel.pricePerNight}
        />
      )}
    </div>
  );
};

export default Booking;
