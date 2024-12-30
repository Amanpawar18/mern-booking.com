import { useForm } from "react-hook-form";
import { UserType } from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { createBooking } from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  totalCost: number;
};
export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  hotelId: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, totalCost }: Props) => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const search = useSearchContext();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: totalCost,
    },
  });
  const { mutate: bookRoom, isLoading } = useMutation(
    "createBooking",
    createBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved !", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Failed to save booking", type: "ERROR" });
      },
    }
  );
  const onSubmit = (formData: BookingFormData) => {
    // check the payment completed
    bookRoom({ ...formData });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span>Confirm your detials</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            readOnly
            type="text"
            disabled
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200"
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            readOnly
            type="text"
            disabled
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200"
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            readOnly
            type="text"
            disabled
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200"
            {...register("email")}
          />
        </label>
      </div>
      <div className="bg-blue-200 p-4 rounded-md">
        <div className="font-semibold text-lg">Total Cost: ${totalCost}</div>
        <div className="text-xs">Includes all taxes & charges</div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details: COD</h3>
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          Confirm booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
