const useCreateAddress = async (details) => {
  if (!details) {
    throw new Error("Details object is required.");
  }

  let url = "create";
  let method = "POST";

  if (details.addressId) {
    url = "update";
    method = "PUT";
  }

  const response = await fetch(`/api/address/${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      addressId: details.addressId,
      name: details.name,
      address: details.address,
      zipcode: details.zipcode,
      city: details.city,
      country: details.country,
    }),
  });

  const data = await response.json();

  return data;
};

export default useCreateAddress;
