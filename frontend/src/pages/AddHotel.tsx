import { useMutation } from "react-query";
import ManageHotelForm from "../froms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import { addMyHotel } from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();

  const { mutate, isLoading } = useMutation(addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved !!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <div>
      <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};

export default AddHotel;
