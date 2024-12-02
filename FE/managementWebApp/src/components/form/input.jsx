function Input({ className, ...rest }) {
  return (
    <input className={` bg-secondGray text-primary rounded p-4 ${className}`} {...rest} />
  );
}

export default Input;
