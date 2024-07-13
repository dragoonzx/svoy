import { SvoyCardLanding } from "@/components/SvoyCardLanding";

const LandingPage = () => {
  return (
    <div>
      <div className="my-20">
        <h1 className="text-4xl px-4 md:text-5xl lg:text-6xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto ">
          The Future of Networking is Here. <br /> Built on Aptos.
        </h1>
      </div>
      <div className="text-center flex flex-col items-center mt-20">
        <p className="text-left font-mono text-sm pb-4">Reimagine Your Business Card</p>
        <SvoyCardLanding />
      </div>
      <div className="text-center mt-10 mb-6 font-mono">
        <ul>
          <li>Connections & Kudos</li>
          <li>Raffles & auctions</li>
          <li>Showcase loved NFTs and etc</li>
        </ul>
      </div>
      {/* <div className="mt-40 text-center">
        <h3 className="my-6 md:text-4xl text-2xl">Let's disrupt together</h3>
        <FeatureCard
          title="Core technologies"
          description="Using best technologies and using with wisdom"
          icon="icons"
        />
      </div> */}
    </div>
  );
};

export default LandingPage;
