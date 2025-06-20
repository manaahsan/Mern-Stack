import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

type InputFieldProps = {
  type: string;
  placeholder: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  address: Record<string, any>;
};

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  name,
  handleChange,
  address,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={address[name] || ""}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded"
  />
);

const AddAddress = () => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    // add other fields as needed
  });
  const { axios, user, navigate, toast } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/address/add", {addressData:address});
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }// for debug
  };
  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                name="firstName"
                placeholder="First Name"
                address={address}
              />
              <InputField
                handleChange={handleChange}
                type="text"
                name="lastName"
                placeholder="Last Name"
                address={address}
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="email"
              name="email"
              placeholder="Email"
              address={address}
            />
            <InputField
              handleChange={handleChange}
              type="text"
              name="street"
              placeholder="Street"
              address={address}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                name="city"
                placeholder="city"
                address={address}
              />
              <InputField
                handleChange={handleChange}
                type="text"
                name="country"
                placeholder="Country"
                address={address}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="number"
                name="zipcode"
                placeholder="Zipcode"
                address={address}
              />
              <InputField
                handleChange={handleChange}
                type="text"
                name="state"
                placeholder="State"
                address={address}
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="text"
              name="phone"
              placeholder="Phone"
              address={address}
            />
            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase"
            >
              Save Address
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          alt="add-address"
          className="md:mr-16 mb-16 md:mt-0"
        />
      </div>
    </div>
  );
};

export default AddAddress;
