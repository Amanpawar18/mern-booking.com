import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchMyHotelById, updateMyHotelById } from "../api-client";
import ManageHotelForm from "../froms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { showToast } = useAppContext();
  const { hotelId } = useParams();
  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const { mutate, isLoading } = useMutation(updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved !!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Fail to save hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditHotel;
