"use client";

import ClientOnly from "@/components/ClientOnly";
import TextInput from "@/components/TextInput";
import MainLayout from "@/components/layouts/MainLayout";
import { useUser } from "@/context/user";
import useCreateAddress from "@/hooks/useCreateAddress";
import useIsLoading from "@/hooks/useIsLoading";
import useUserAddress from "@/hooks/useUserAddress";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Address() {
  const router = useRouter();
  const { user } = useUser();

  const [addressId, setAddressId] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [error, setError] = useState({});

  const showError = (type) => {
    if (Object.entries(error).length > 0 && error?.type === type) {
      return error.message;
    }

    return "";
  };

  const getAddress = async () => {
    if (user?.id == null || user?.id == undefined) {
      useIsLoading(false);
      return;
    }

    const response = await useUserAddress();

    if (response) {
      setTheCurrentAddress(response);
      useIsLoading(false);
      return;
    }

    useIsLoading(false);
  };

  useEffect(() => {
    useIsLoading(true);
    getAddress();
  }, [user]);

  const setTheCurrentAddress = (result) => {
    setAddressId(result.id);
    setName(result.name);
    setAddress(result.address);
    setZipcode(result.zipcode);
    setCity(result.city);
    setCountry(result.country);
  };

  const validate = () => {
    setError({});
    let isError = false;

    if (!name) {
      setError({ type: "name", message: "Name is required" });
      isError = true;
    } else if (!address) {
      setError({ type: "address", message: "Address is required" });
      isError = true;
    } else if (!zipcode) {
      setError({ type: "zipcode", message: "Zipcode is required" });
      isError = true;
    } else if (!city) {
      setError({ type: "city", message: "City is required" });
      isError = true;
    } else if (!country) {
      setError({ type: "country", message: "Country is required" });
      isError = true;
    }
    return isError;
  };

  const submit = async (event) => {
    event.preventDefault();
    let isError = validate();

    if (isError) {
      toast.error(error.message, { autoClose: 3000 });
      return;
    }

    try {
      setIsUpdatingAddress(true);

      const response = await useCreateAddress({
        addressId,
        name,
        address,
        zipcode,
        city,
        country,
      });

      setTheCurrentAddress(response);
      setIsUpdatingAddress(false);

      toast.success("Address updated", { autoClose: 3000 });
      router.push("/checkout");
    } catch (error) {
      setIsUpdatingAddress(false);
      console.log(error);
      alert(error);
    }
  };

  return (
    <MainLayout>
      <section id="AddressPage" className="mt-4 max-w-[600px] mx-auto px-2">
        <div className="p-3 mx-auto bg-white rounded-lg">
          <h2 className="mb-2 text-xl text-bold">Address Details</h2>

          <form onSubmit={submit}>
            <div className="mb-4">
              <ClientOnly>
                <TextInput
                  className="w-full"
                  string={name}
                  placeholder="Name"
                  onUpdate={setName}
                  error={showError("name")}
                />
              </ClientOnly>
            </div>
            <div className="mb-4">
              <ClientOnly>
                <TextInput
                  className="w-full"
                  string={address}
                  placeholder="Address"
                  onUpdate={setAddress}
                  error={showError("address")}
                />
              </ClientOnly>
            </div>

            <div className="mb-4">
              <ClientOnly>
                <TextInput
                  className="w-full"
                  string={zipcode}
                  placeholder="Zip Code"
                  onUpdate={setZipcode}
                  error={showError("zipcode")}
                />
              </ClientOnly>
            </div>

            <div className="mb-4">
              <ClientOnly>
                <TextInput
                  className="w-full"
                  string={city}
                  placeholder="City"
                  onUpdate={setCity}
                  error={showError("city")}
                />
              </ClientOnly>
            </div>

            <div className="mb-4">
              <ClientOnly>
                <TextInput
                  className="w-full"
                  string={country}
                  placeholder="Country"
                  onUpdate={setCountry}
                  error={showError("country")}
                />
              </ClientOnly>
            </div>

            <button
              type="submit"
              disabled={isUpdatingAddress}
              className={`w-full p-3 mt-6 text-lg font-semibold text-white bg-blue-600 rounded ${
                isUpdatingAddress ? "bg-blue-800" : "bg-blue-600"
              }`}
            >
              {!isUpdatingAddress ? (
                <p>Update Address</p>
              ) : (
                <p className="flex items-center justify-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Please wait...
                </p>
              )}
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
