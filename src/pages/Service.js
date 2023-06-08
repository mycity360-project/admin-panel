try {
  const token = LocalStorage.getData("token");
  const respData = await http.get("service/?page=1", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = respData.map((service) => ({
    key: service.id.toString(),
    code: service.code,
    title: service.name,
    icon: service.icon,
    description: service.description,
    phone: service.phone,
    images: service.images,
    serviceID: service.id,
  }));
  console.log(respData, "44");
  // setData(data);
} catch (error) {
  console.error("Error fetching data:", error);
} finally {
  setLoading(false);
}
