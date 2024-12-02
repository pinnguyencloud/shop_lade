import Input from "../form/input";

function Header() {
  return (
    <div className="w-full h-[88px] flex justify-between items-center bg-white pl-[290px] pr-10">
      <Input className={"h-1/3"} />
      <div className="flex gap-5">
        <div>TB</div>
        <div>User</div>
      </div>
    </div>
  );
}

export default Header;
