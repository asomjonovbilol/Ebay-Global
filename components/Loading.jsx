import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <>
      <div className="fixed bg-black bg-opacity-70 inset-0 w-full z-40 flex items-center justify-center h-[100vh] overflow-hidden">
        <div className="p-3 rounded-md">
          <AiOutlineLoading3Quarters
            size={100}
            className="text-blue-400 animate-spin"
          />
          <p className="pt-5 text-xl text-center text-white font-bont">
            Loading...
          </p>
        </div>
      </div>
    </>
  );
};

export default Loading;
