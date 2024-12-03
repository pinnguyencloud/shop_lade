const MyInput = ({
  field,
  value,
  onChange,
  label,
  type = "text",
  name,
  id,
  options = [],
  placeholder,
  className,
  ...rest
}) => {
  // Lấy giá trị từ `field` nếu tồn tại, hoặc từ props trực tiếp
  const inputType = field?.type || type;
  const inputLabel = field?.label || label;
  const inputName = field?.name || name;
  const inputId = field?.id || id || `input-${inputName}`;
  const inputOptions = field?.options || options;
  const inputPlaceholder = field?.placeholder || placeholder;

  const renderInput = () => {
    switch (inputType) {
      case "text":
      case "number":
        return (
          <input
            id={inputId}
            type={inputType}
            name={inputName}
            value={value || ""}
            onChange={onChange}
            {...rest}
            placeholder={inputPlaceholder || ""}
            className={`peer w-full border rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-primary text-primary ${className}`}
          />
        );
      case "select":
        return (
          <select
            id={inputId}
            name={inputName}
            value={value || ""}
            onChange={onChange}
            className={`peer w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary text-primary bg-white ${className}`}
          >
            <option value="" disabled>
              {inputPlaceholder || `Chọn ${inputLabel?.toLowerCase()}`}
            </option>
            {inputOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
      case "radio":
        return (
          <div className="flex items-center space-x-2">
            {inputOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-1">
                <input
                  id={`${inputId}-${option.value}`}
                  type={inputType}
                  name={inputName}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="peer form-checkbox focus:outline-none focus:ring-primary text-primary"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case "textarea":
        return (
          <textarea
            id={inputId}
            name={inputName}
            value={value || ""}
            onChange={onChange}
            placeholder={inputPlaceholder || ""}
            className={`peer w-full border rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-primary text-primary ${className}`}
            rows={4} // Số dòng mặc định
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full mb-4 ${inputType === "checkbox" || inputType === "radio" ? "" : "peer"}`}
    >
      {renderInput()}
      {inputType !== "checkbox" &&
        inputType !== "radio" &&
        inputType !== "select" && (
          <label
            htmlFor={inputId}
            className="absolute left-3 top-1 text-gray-800 text-sm transform -translate-y-2 scale-90 transition-all duration-200
            peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-1
            peer-focus:scale-90 peer-focus:text-primary"
          >
            {inputLabel}
          </label>
        )}
    </div>
  );
};

export default MyInput;
