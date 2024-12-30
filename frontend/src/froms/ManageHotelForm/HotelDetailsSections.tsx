import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const HotelDetailsSections = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Add Hotel</h1>
      <label className="text-gray-700 text-sm font-bold flex-1" htmlFor="name">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          id="name"
          {...register("name", { required: "This field is required" })}
        ></input>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      <div className="flex gap-4">
        <label
          className="text-gray-700 text-sm font-bold flex-1"
          htmlFor="city"
        >
          City
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            id="city"
            {...register("city", { required: "This field is required" })}
          ></input>
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>
        <label
          className="text-gray-700 text-sm font-bold flex-1"
          htmlFor="country"
        >
          country
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            id="country"
            {...register("country", { required: "This field is required" })}
          ></input>
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label
        className="text-gray-700 text-sm font-bold flex-1"
        htmlFor="description"
      >
        description
        <textarea
          className="border rounded w-full py-1 px-2 font-normal"
          id="description"
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
      <label
        className="text-gray-700 text-sm font-bold flex-1 max-w-[50%]"
        htmlFor="pricePerNight"
      >
        Price per night
        <input
          type="number"
          className="border rounded w-full py-1 px-2 font-normal"
          id="pricePerNight"
          {...register("pricePerNight", { required: "This field is required" })}
        ></input>
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label
        className="text-gray-700 text-sm font-bold flex-1 max-w-[50%]"
        htmlFor="starRating"
      >
        Star rating
        <select
          {...register("starRating", {
            required: "This field is required",
          })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option
            value=""
            key="default"
            disabled={true}
            className="text-sm font-bold"
          >
            Selet as rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => {
            return (
              <option value={num} key={num} className="text-sm font-bold">
                {num}
              </option>
            );
          })}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};

export default HotelDetailsSections;
