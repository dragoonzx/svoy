import { SvoyCard } from "@/components/SvoyCard";

const CardPage = () => {
  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center w-[380px]">
        <div className="mb-8">
          <SvoyCard />
        </div>
      </div>
    </div>
  );
};

export default CardPage;
