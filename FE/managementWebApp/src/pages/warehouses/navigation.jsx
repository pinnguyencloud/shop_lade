function Navigation() {
  const moduleItems = [
    { id: "importWarehouse", label: "Nhập kho", path: "" },
    { id: "exportWarehouse", label: "Xuất kho", path: "" },
    { id: "inventory", label: "QL Tồn kho", path: "" },
  ];
  return (
    <div className="grid grid-cols-4">
      {moduleItems.map((moduleItem) => (
        <button key={moduleItem.id}>{moduleItem.label}</button>
      ))}
    </div>
  );
}

export default Navigation;
