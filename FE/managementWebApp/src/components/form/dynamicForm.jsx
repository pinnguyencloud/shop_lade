import MyInput from "./myInput";

function DynamicForm({ categoryId, formData, setFormData, config }) {
  const category = config.find((cat) => cat.id === categoryId);

  if (!category) {
    return <div className="h-[720px] w-full"></div>;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value ? parseFloat(value) : value,
    }));
  };

  const handleSubCategorySelect = (e) => {
    const subCategoryId = parseInt(e.target.value, 10);
    const subCategory = category.subCategories.find(
      (subCat) => subCat.id === subCategoryId
    );
    setFormData((prev) => ({
      ...prev,
      subCategoryId,
      ...(subCategory?.fields?.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {}) || {}),
    }));
  };

  return (
    <div className="w-full h-[720px] p-4">
      {category.subCategories && category.subCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block mb-2 font-bold">
            Chọn danh mục con:
          </label>
          <select
            id="subCategory"
            className="border rounded w-full p-2"
            onChange={handleSubCategorySelect}
          >
            <option value="">Chọn một danh mục con</option>
            {category.subCategories.map((subCat) => (
              <option key={subCat.id} value={subCat.id}>
                {subCat.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {(category.fields || []).map((field) => (
        <MyInput
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={handleChange}
        />
      ))}

      {formData.subCategoryId &&
        category.subCategories
          .find((subCat) => subCat.id === formData.subCategoryId)
          ?.fields?.map((field) => (
            <MyInput
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}

      <MyInput
        type="number"
        name={"stock"}
        label={"Số lượng"}
        value={formData.stock || 0}
        onChange={handleChange}
      />
      <MyInput
        type="number"
        name={"price"}
        label={"Giá cả"}
        value={formData.price}
        step="0.01"
        onChange={handleChange}
      />
    </div>
  );
}

export default DynamicForm;
