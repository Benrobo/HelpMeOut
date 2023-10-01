import Image from "next/image";
import { inter, workSans } from "../config/fonts";
import workPlaceHolder from "../public/images/banner/work_placeholder.png";

const Works = ({ img, title, desc }) => {
  return (
    <article className="flex-col flex justify-center items-center scale-[.70] ">
      <Image
        src={img}
        width={50}
        height={0}
        alt="How it wors"
        className="mb-8"
      />
      <h3
        className={`${inter.variable} font-inter font-semibold text-center mb-4 lg:text-[28px] text-xl text-[#1B233D]`}
      >
        {title}
      </h3>
      <p
        className={`${workSans.variable} font-workSans max-w-[358px] mb-7 text-center leading-primary font-normal lg:text-xl text-base`}
      >
        {desc}
      </p>
      <Image src={workPlaceHolder} width={0} height={0} alt="Placeholder" />
    </article>
  );
};

export default Works;
